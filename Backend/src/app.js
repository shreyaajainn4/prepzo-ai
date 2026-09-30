const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.set("trust proxy", 1)

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://prepzo-ai-frontend.vercel.app"
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}))

/* Health check — lightweight endpoint for warm-up pings (no auth, no DB) */
app.get("/api/health", (req, res) => res.json({ status: "ok" }))

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)



module.exports = app