"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Building2,
  Clock,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  Sparkles,
  User,
  Zap,
} from "lucide-react";
import { useAppContext } from "@/app/providers";

const GoogleIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-card border border-border rounded-3xl ${className}`}>{children}</div>
);

interface InputFieldProps {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ComponentType<{ className?: string }>;
  required?: boolean;
}

const InputField = ({ id, type, label, placeholder, value, onChange, icon: Icon, required = false }: InputFieldProps) => (
  <div className="space-y-2">
    <label htmlFor={id} className="text-sm font-medium text-foreground">
      {label}
    </label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full h-11 rounded-xl border border-input bg-background px-3 pl-11 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-300"
        required={required}
      />
    </div>
  </div>
);

interface PasswordFieldProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  onTogglePassword: () => void;
}

const PasswordField = ({ id, label, placeholder, value, onChange, showPassword, onTogglePassword }: PasswordFieldProps) => (
  <div className="space-y-2">
    <label htmlFor={id} className="text-sm font-medium text-foreground">
      {label}
    </label>
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        id={id}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full h-11 rounded-xl border border-input bg-background px-3 pl-11 pr-11 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-300"
      />
      <button
        type="button"
        onClick={onTogglePassword}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-300"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  </div>
);

interface CheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox = ({ id, label, checked, onChange }: CheckboxProps) => (
  <label htmlFor={id} className="flex items-center gap-3 cursor-pointer text-sm text-foreground">
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 rounded border-input text-primary focus:ring-primary focus:ring-offset-background"
    />
    <span className="select-none">{label}</span>
  </label>
);

function Divider({ text }: { text: string }) {
  return (
    <div className="relative py-5">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-xs uppercase text-muted-foreground">
        <span className="bg-card px-2">{text}</span>
      </div>
    </div>
  );
}

function FeatureLine({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-3 text-sm text-white/90">
      <div className="mt-1 h-8 w-8 rounded-2xl bg-white/10 flex items-center justify-center">{icon}</div>
      <p>{text}</p>
    </div>
  );
}

function AnimatedBlob({ color, position, delay = "" }: { color: string; position: string; delay?: string }) {
  return <div className={`absolute ${position} w-72 h-72 ${color} rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-blob ${delay}`} />;
}

function GradientWave() {
  return (
    <div className="absolute inset-0 opacity-20">
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 560">
        <defs>
          <linearGradient id="gradient-wave" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.08" />
          </linearGradient>
        </defs>
        <path fill="url(#gradient-wave)" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,218.7C672,235,768,245,864,234.7C960,224,1056,192,1152,186.7C1248,181,1344,203,1392,213.3L1440,224L1440,560L1392,560C1344,560,1248,560,1152,560C1056,560,960,560,864,560C768,560,672,560,576,560C480,560,384,560,288,560C192,560,96,560,48,560L0,560Z" />
      </svg>
    </div>
  );
}

export default function SignIn() {
  const { handleLoginSuccess, setPostLoginRedirect } = useAppContext();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [eventType, setEventType] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    handleLoginSuccess(email.split("@")[0] || "User", email || "user@example.com");
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);
    if (!fullName || !email || !signupPassword) {
      setSignupError("Please fill the required fields.");
      return;
    }
    if (signupPassword !== confirmPassword) {
      setSignupError("Passwords do not match.");
      return;
    }
    if (!agreeTerms) {
      setSignupError("You must agree to the terms to continue.");
      return;
    }

    setPostLoginRedirect("organiser/signup");
    handleLoginSuccess(fullName, email);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[1.3fr_0.95fr]">
      <div className="flex items-center justify-center bg-background p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-xl space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">Organiser Portal</p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">{mode === "signin" ? "Welcome back" : "Create your organiser account"}</h1>
            <p className="text-sm text-muted-foreground">{mode === "signin" ? "Already have an organiser account? Sign in below." : "Fill in your details to create your account and connect Stripe."}</p>
          </div>

          <Card className="p-6 sm:p-8 shadow-xl shadow-slate-200/40">
            {mode === "signin" ? (
              <form onSubmit={handleSignIn} className="space-y-6">
                <InputField id="signin-email" type="email" label="Email address" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} icon={Mail} required />
                <PasswordField id="signin-password" label="Password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} showPassword={showPassword} onTogglePassword={() => setShowPassword(!showPassword)} />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm">
                  <Checkbox id="remember" label="Remember me" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                  <Link href="#" className="text-primary font-medium">Forgot password?</Link>
                </div>

                <button type="submit" className="w-full h-12 rounded-2xl bg-primary text-white text-base font-semibold">Sign in to Dashboard</button>

                <Divider text="Or continue with" />

                <button type="button" onClick={() => console.log("Google sign in")} className="w-full h-12 rounded-2xl border border-input bg-background text-foreground flex items-center justify-center gap-3 text-sm font-semibold hover:bg-slate-50 transition">
                  <GoogleIcon className="h-5 w-5" /> Continue with Google
                </button>

                <p className="text-center text-sm text-muted-foreground">
                  Don’t have an account? <button type="button" onClick={() => setMode("signup")} className="text-primary font-semibold">Create one</button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField id="fullName" type="text" label="Full name" placeholder="Jane Smith" value={fullName} onChange={(e) => setFullName(e.target.value)} icon={User} required />
                  <InputField id="phone" type="tel" label="Phone number" placeholder="+61 4XX XXX XXX" value={phone} onChange={(e) => setPhone(e.target.value)} icon={Phone} />
                </div>
                <InputField id="organisation" type="text" label="Organisation" placeholder="Sunset Events Co." value={organisation} onChange={(e) => setOrganisation(e.target.value)} icon={Building2} />
                <InputField id="signup-email" type="email" label="Email address" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} icon={Mail} required />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField id="eventType" type="text" label="Primary event type" placeholder="Concert, theatre, festival…" value={eventType} onChange={(e) => setEventType(e.target.value)} />
                  <InputField id="signup-password" type="password" label="Password" placeholder="At least 8 characters" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} icon={Lock} required />
                </div>
                <PasswordField id="confirmPassword" label="Confirm password" placeholder="Repeat your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} showPassword={false} onTogglePassword={() => {}} />

                <Checkbox id="agreeTerms" label="I agree to the Terms & Conditions" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />

                {signupError && <p className="text-sm text-destructive">{signupError}</p>}

                <button type="submit" className="w-full h-12 rounded-2xl bg-primary text-white text-base font-semibold">Create account & continue</button>

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account? <button type="button" onClick={() => setMode("signin")} className="text-primary font-semibold">Sign in</button>
                </p>
              </form>
            )}
          </Card>
        </div>
      </div>

      <div className="relative overflow-hidden bg-slate-950 px-6 py-8 sm:px-8 sm:py-10">
        <AnimatedBlob color="bg-cyan-400/20" position="-top-16 -left-10" delay="animation-delay-2000" />
        <AnimatedBlob color="bg-purple-500/20" position="top-10 right-0" />
        <AnimatedBlob color="bg-indigo-500/20" position="bottom-12 left-10" delay="animation-delay-4000" />
        <GradientWave />

        <div className="relative z-10 min-h-[420px] rounded-[2rem] bg-gradient-to-br from-blue-900 via-slate-950 to-indigo-950 p-8 text-white shadow-2xl shadow-black/30">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/80">
              <Sparkles className="h-3.5 w-3.5 text-white" /> New here? Start free
            </span>
            <h2 className="text-3xl font-bold tracking-tight">Create your Organiser account</h2>
            <p className="text-sm text-white/75 leading-relaxed">
              List your first event in minutes. No upfront cost — we only earn when you sell.
            </p>
            <div className="space-y-4">
              <FeatureLine icon={<Zap className="h-4 w-4" />} text="Go live the same day" />
              <FeatureLine icon={<BarChart3 className="h-4 w-4" />} text="Real-time sales dashboard" />
              <FeatureLine icon={<Clock className="h-4 w-4" />} text="Paid out in 2–3 business days" />
            </div>
          </div>

          <div className="mt-8">
            {mode === "signin" ? (
              <button type="button" onClick={() => setMode("signup")} className="w-full rounded-2xl bg-white px-6 py-4 text-base font-semibold text-slate-950 shadow-xl shadow-black/20 hover:brightness-105 transition">
                Get Started — It’s Free <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <div className="rounded-3xl border border-white/10 bg-white/10 p-6 text-sm text-white/80">
                After you create your account, you’ll be redirected to Stripe Connect to finish payouts setup.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
