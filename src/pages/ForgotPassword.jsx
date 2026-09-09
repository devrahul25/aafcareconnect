import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { 
  Mail, Lock, KeyRound, ArrowLeft, Loader2, 
  CheckCircle2, Eye, EyeOff, ShieldCheck, RefreshCw 
} from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { authApi } from "@/api/authApi";

export default function ForgotPassword() {
  const navigate = useNavigate();

  // Multi-step state: 1 = Request Code, 2 = Verify Code & Set New Password, 3 = Success
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  // Timer countdown for resending verification code
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const validatePassword = (pw) => {
    if (pw.length < 8) return "Password must be at least 8 characters long.";
    if (!/[A-Z]/.test(pw)) return "Password must contain at least one uppercase letter.";
    if (!/[0-9]/.test(pw)) return "Password must contain at least one number.";
    if (!/[\W_]/.test(pw)) return "Password must contain at least one special character.";
    return null;
  };

  // Step 1: Request Password Reset Code
  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError("Please enter your registered email address.");
      return;
    }

    setLoading(true);
    try {
      await authApi.forgotPassword(cleanEmail);
      setStep(2);
      setResendTimer(60); // 60s cooldown
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to send verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend Code
  const handleResendCode = async () => {
    if (resendTimer > 0 || resending) return;
    setError("");
    setResending(true);
    try {
      await authApi.forgotPassword(email.trim().toLowerCase());
      setResendTimer(60);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to resend code.");
    } finally {
      setResending(false);
    }
  };

  // Step 2: Verify Code & Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    const cleanCode = code.trim();
    if (cleanCode.length !== 6) {
      setError("Please enter the 6-digit verification code sent to your email.");
      return;
    }

    const pwError = validatePassword(newPassword);
    if (pwError) {
      setError(pwError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword(email.trim().toLowerCase(), cleanCode, newPassword);
      setStep(3);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || "Failed to reset password.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================================
  // STEP 3: SUCCESS VIEW
  // =========================================================================
  if (step === 3) {
    return (
      <AuthLayout
        title="Password Reset Successful"
        subtitle="Your credentials have been securely updated"
      >
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs border border-emerald-100">
            <CheckCircle2 size={32} />
          </div>

          <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
            Your password has been changed successfully. You can now sign in to your AafCareConnect account using your new password.
          </p>

          <button
            type="button"
            onClick={() => navigate("/login", { replace: true, state: { message: "Password updated successfully. Please sign in." } })}
            className="w-full h-12 bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-xl font-medium text-sm transition-colors shadow-sm flex items-center justify-center"
          >
            Sign In Now
          </button>
        </div>
      </AuthLayout>
    );
  }

  // =========================================================================
  // STEP 2: VERIFICATION CODE & NEW PASSWORD VIEW
  // =========================================================================
  if (step === 2) {
    return (
      <AuthLayout
        title="Reset Your Password"
        subtitle={`Verification code sent to ${email}`}
        footer={
          <Link to="/login" className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors inline-flex items-center gap-1.5">
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        }
      >
        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 text-red-600 text-xs font-semibold text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleResetPassword} className="space-y-4">
          {/* Verification Code */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="code" className="text-xs font-semibold text-slate-600 tracking-wide">
                6-Digit Verification Code
              </Label>
              <button
                type="button"
                onClick={() => { setStep(1); setError(""); }}
                className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold"
              >
                Change email
              </button>
            </div>
            <div className="relative mx-auto max-w-full">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={2.5} />
              <input
                id="code"
                type="text"
                maxLength={6}
                autoFocus
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                className="w-full h-12 pl-11 pr-4 rounded-xl bg-[#f0f4f8] text-base font-bold tracking-widest text-slate-900 border-none outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all placeholder:tracking-normal placeholder:font-normal placeholder:text-slate-400"
                required
              />
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <Label htmlFor="newPassword" className="text-xs font-semibold text-slate-600 tracking-wide block">
              New Password
            </Label>
            <div className="relative mx-auto max-w-full">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={2.5} />
              <input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-12 pl-11 pr-11 rounded-xl bg-[#f0f4f8] text-sm text-slate-900 border-none outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all placeholder:text-slate-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-xs font-semibold text-slate-600 tracking-wide block">
              Confirm New Password
            </Label>
            <div className="relative mx-auto max-w-full">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={2.5} />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-12 pl-11 pr-11 rounded-xl bg-[#f0f4f8] text-sm text-slate-900 border-none outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all placeholder:text-slate-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || code.length !== 6 || !newPassword}
              className="w-full h-12 bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-xl font-medium text-sm transition-colors shadow-sm flex items-center justify-center disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <ShieldCheck className="w-5 h-5 mr-2" />}
              Set New Password
            </button>
          </div>

          {/* Resend Code Action */}
          <div className="text-center pt-2">
            {resendTimer > 0 ? (
              <span className="text-xs text-slate-400 font-medium">
                Resend code in <strong className="text-slate-600">{resendTimer}s</strong>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resending}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5"
              >
                {resending ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
                Didn't receive code? Resend
              </button>
            )}
          </div>
        </form>
      </AuthLayout>
    );
  }

  // =========================================================================
  // STEP 1: REQUEST VERIFICATION CODE VIEW
  // =========================================================================
  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email to receive a verification code"
      footer={
        <Link to="/login" className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors inline-flex items-center gap-1.5">
          <ArrowLeft size={14} /> Back to Sign In
        </Link>
      }
    >
      {error && (
        <div className="mb-6 p-3 rounded-xl bg-red-50 text-red-600 text-xs font-semibold text-center border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleRequestCode} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-semibold text-slate-600 tracking-wide block">
            Registered Email
          </Label>
          <div className="relative mx-auto max-w-full">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={2.5} />
            <input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 pl-11 pr-4 rounded-xl bg-[#f0f4f8] text-sm text-slate-900 border-none outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all placeholder:text-slate-400"
              required
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            We will send a 6-digit security verification code to this email address.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full h-12 bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-xl font-medium text-sm transition-colors shadow-sm flex items-center justify-center disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : null}
            Send Verification Code
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
