import "./styles/global.css";
import React, { Suspense, lazy, type JSX } from "react";
import { useAuth } from "./context/AuthContext";
import { LoginPage } from "./pages/Login";
import  {SignUpPage}  from "./pages/Signup";
import { DashboardPage } from "./pages/Dashboard";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";

const RequireAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

export function App() {
  const navigate = useNavigate();
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background text-foreground">
        <main className="">
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<LoginPage onLogin={() => navigate('/dashboard')} onNavigateToSignUp={() => navigate('/signup')} />} />
              <Route path="/signup" element={<SignUpPage onSignUp={() => navigate('/dashboard')} onNavigateToLogin={()=> navigate('/login')} />} />
              <Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;