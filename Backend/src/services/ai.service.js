const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
// NOTE: puppeteer is lazy-loaded inside generatePdfFromHtml() to avoid
// adding 2-5s to cold start when PDF generation isn't needed

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

// ── Retry helper with exponential backoff ─────────────────────────────────────
async function withRetry(fn, { maxRetries = 3, baseDelayMs = 1500 } = {}) {
    let lastError
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn()
        } catch (err) {
            lastError = err
            const isRetryable =
                err?.status === 503 ||
                err?.status === 429 ||
                err?.status === 500 ||
                String(err?.message).toLowerCase().includes("overloaded") ||
                String(err?.message).toLowerCase().includes("unavailable") ||
                String(err?.message).toLowerCase().includes("resource exhausted")

            // Don't retry 404 (wrong model name) — just fail fast
            if (err?.status === 404 || !isRetryable || attempt === maxRetries) throw err

            const delay = baseDelayMs * Math.pow(2, attempt) + Math.random() * 500
            console.log(`[AI Retry] Attempt ${attempt + 1}/${maxRetries} failed (${err?.status}). Retrying in ${Math.round(delay)}ms...`)
            await new Promise(r => setTimeout(r, delay))
        }
    }
    throw lastError
}

// ── Model list with correct prefix (tried in order) ───────────────────────────
const MODELS = [
    "models/gemini-2.5-flash-lite",
    "models/gemini-2.0-flash-lite",
    "models/gemini-2.0-flash-lite-001",
    "models/gemini-flash-lite-latest",
    "models/gemini-2.5-flash",
]

async function callAiWithFallback(prompt, schema) {
    for (const model of MODELS) {
        try {
            console.log(`[AI] Trying model: ${model}`)
            const response = await withRetry(() =>
                ai.models.generateContent({
                    model,
                    contents: prompt,
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: zodToJsonSchema(schema),
                    }
                })
            )
            console.log(`[AI] Success with model: ${model}`)
            return JSON.parse(response.text)
        } catch (err) {
            console.log(`[AI] Model ${model} failed (${err?.status}): ${err?.message?.slice(0, 80)}`)
            if (model === MODELS[MODELS.length - 1]) throw err
        }
    }
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `Generate an interview report for a candidate with the following details:
Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}`

    return await callAiWithFallback(prompt, interviewReportSchema)
}



async function generatePdfFromHtml(htmlContent) {
    // Lazy-load puppeteer only when actually needed for PDF generation
    const puppeteer = require("puppeteer")
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

The response should be a JSON object with a single field "html" which contains the HTML content of the resume.
The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience.
The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
The content should not sound like it's generated by AI and should be as close as possible to a real human-written resume.
You can highlight the content using some colors or different font styles but the overall design should be simple and professional.
The content should be ATS friendly.
The resume should not be lengthy, ideally 1-2 pages long when converted to PDF.`

    const jsonContent = await callAiWithFallback(prompt, resumePdfSchema)
    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)
    return pdfBuffer
}

module.exports = { generateInterviewReport, generateResumePdf }