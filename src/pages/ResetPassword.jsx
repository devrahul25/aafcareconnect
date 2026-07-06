import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, Loader2, ShieldCheck } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import AuthLayout from "@/components/AuthLayout";
import { authApi } from "@/api/authApi";

export default function ResetPassword() {
  const navigate = useNavigate();

  // Step 1: email + OTP; Step 2: new password
  const [step, setStep]               = useState(1);
  const [email, setEmail]             = useState("");
  const [otpCode, setOtpCode]         = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError]             = useState("");
  const [loading, setLoading]         = useState(false);

  // ---------------------------------------------------------------------------
  // Step 1 — Verify email + OTP
  // ---------------------------------------------------------------------------
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otpCode.length < 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }
    setError("");
    setStep(2);
  };

  // ---------------------------------------------------------------------------
  // Step 2 — Set new password
  // ---------------------------------------------------------------------------
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await authApi.resetPassword(email, otpCode, newPassword);
      navigate("/login", { replace: true, state: { message: "Password reset successfully. Please log in." } });
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to reset password.");
      // If OTP is invalid, send back to step 1
      if (err.response?.data?.code === "AUTH_INVALID_OTP") {
        setStep(1);
        setOtpCode("");
      }
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Step 1 UI — Email + OTP
  // ---------------------------------------------------------------------------
  if (step === 1) {
    return (
      <AuthLayout
        icon={ShieldCheck}
        title="Enter reset code"
        subtitle="Check your email for the 6-digit code"
        footer={
          <Link to="/forgot-password" className="text-primary font-medium hover:underline">
            Didn't get a code? Request again
          </Link>
        }
      >
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                autoFocus
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Reset Code</Label>
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otpCode}
                onChange={setOtpCode}
                autoComplete="one-time-code"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full h-12 font-medium"
            disabled={!email || otpCode.length < 6}
          >
            Continue
          </Button>
        </form>
      </AuthLayout>
    );
  }

  // ---------------------------------------------------------------------------
  // Step 2 UI — New password
  // ---------------------------------------------------------------------------
  return (
    <AuthLayout
      icon={Lock}
      title="Set new password"
      subtitle="Enter your new password below"
    >
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleResetPassword} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              autoFocus
              placeholder="Min. 8 characters with uppercase & number"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Resetting...
            </>
          ) : (
            "Reset password"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
