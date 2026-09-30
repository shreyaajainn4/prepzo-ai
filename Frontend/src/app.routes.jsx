import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import Protected from "./features/auth/components/Protected";

// Lazy-load all page components for code splitting
const Login = lazy(() => import("./features/auth/pages/Login"));
const Register = lazy(() => import("./features/auth/pages/Register"));
const ForgotPassword = lazy(() => import("./features/auth/pages/ForgotPassword"));
const Home = lazy(() => import("./features/interview/pages/Home"));
const Interview = lazy(() => import("./features/interview/pages/Interview"));
const LandingPage = lazy(() => import("./features/landing/LandingPage"));

// Loading fallback matching the app's dark theme
const PageLoader = () => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#0a0f1a',
    }}>
        <div style={{
            width: '32px',
            height: '32px',
            border: '3px solid rgba(255,255,255,0.08)',
            borderTopColor: '#ec4899',
            borderRadius: '50%',
            animation: 'spin 0.7s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
);

// Wrap lazy components with Suspense
const withSuspense = (Component) => (
    <Suspense fallback={<PageLoader />}>
        <Component />
    </Suspense>
);

export const router = createBrowserRouter([
    {
        path: "/landing",
        element: withSuspense(LandingPage)
    },
    {
        path: "/login",
        element: withSuspense(Login)
    },
    {
        path: "/register",
        element: withSuspense(Register)
    },
    {
        path: "/forgot-password",
        element: withSuspense(ForgotPassword)
    },
    {
        path: "/",
        element: <Protected>{withSuspense(Home)}</Protected>
    },
    {
        path:"/interview/guest",
        element: <Protected>{withSuspense(Interview)}</Protected>
    },
    {
        path:"/interview/:interviewId",
        element: <Protected>{withSuspense(Interview)}</Protected>
    }
])