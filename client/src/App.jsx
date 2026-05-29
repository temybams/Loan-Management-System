import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AuthForm } from "./components/auth/AuthForm";
import { AppShell } from "./components/layout/AppShell";
import { LandingPage } from "./components/landing/LandingPage";

function Root() {
  const { isAuthenticated } = useAuth();
  const [authMode, setAuthMode] = useState(null);

  if (isAuthenticated) return <AppShell />;

  if (authMode) {
    return <AuthForm initialMode={authMode} onBack={() => setAuthMode(null)} />;
  }

  return <LandingPage onAuth={setAuthMode} />;
}

export default function App() {
  return (
    <AuthProvider>
      <Root />
    </AuthProvider>
  );
}
