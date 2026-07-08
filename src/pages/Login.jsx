import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";
import { firebaseSignIn, firebaseSignInWithGoogle } from "@/lib/firebase";
import { authApi } from "@/api/authApi";
import { useAuth } from "@/lib/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // MOCK INTERCEPT: Bypass Firebase and API entirely for these specific test accounts
      if (email === "superadmin@eserve.org.uk" || email === "orgadmin@eserve.org.uk" || email === "manager@eserve.org.uk" || email === "trainer@eserve.org.uk" || email === "learner@eserve.org.uk") {
        let mockRole = "learner";
        let mockToken = "mock-learner-token";
        let fullName = "Foster Carer";
        
        if (email.startsWith("super")) {
          mockRole = "super_admin";
          mockToken = "mock-super-admin-token";
          fullName = "Super Admin";
        } else if (email.startsWith("org")) {
          mockRole = "org_admin";
          mockToken = "mock-org-admin-token";
          fullName = "Org Admin";
        } else if (email.startsWith("manager")) {
          mockRole = "manager";
          mockToken = "mock-manager-token";
          fullName = "Team Manager";
        } else if (email.startsWith("trainer")) {
          mockRole = "trainer";
          mockToken = "mock-trainer-token";
          fullName = "Course Trainer";
        }
        
        login(mockToken, "mock-refresh-token", {
          email,
          full_name: fullName,
          role: mockRole
        });
        navigate("/", { replace: true });
        return;
      }

      // Normal flow
      const idToken = await firebaseSignIn(email, password);
      const result = await authApi.login(idToken);
      const { access_token, refresh_token, user } = result.data;
      login(access_token, refresh_token, user);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      const idToken = await firebaseSignInWithGoogle();
      const result = await authApi.socialLogin(idToken);
      const { access_token, refresh_token, user } = result.data;
      login(access_token, refresh_token, user);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Google sign-in failed.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome to AafCareConnect"
      subtitle="Sign in to continue"
    >
      {/* Social Login Buttons */}
      <div className="space-y-3 mb-8">
        <button
          type="button"
          onClick={handleGoogle}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-3 h-12 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200 shadow-sm"
        >
          {googleLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
          ) : (
            <GoogleIcon className="w-5 h-5" />
          )}
          <span className="text-sm font-medium text-slate-700">Continue with Google</span>
        </button>
      </div>

      {/* Divider */}
      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-100" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-4 text-slate-400 font-medium tracking-wide">OR</span>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-xl bg-red-50 text-red-600 text-sm text-center font-medium border border-red-100">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5 text-center">
          <Label htmlFor="email" className="text-xs font-semibold text-slate-600 tracking-wide">Email</Label>
          <div className="relative mx-auto max-w-full">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={2.5} />
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 pl-11 pr-4 rounded-xl bg-[#f0f4f8] text-sm text-slate-900 border-none outline-none focus:ring-2 focus:ring-slate-200 transition-shadow placeholder:text-slate-400"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5 text-center">
          <Label htmlFor="password" className="text-xs font-semibold text-slate-600 tracking-wide">Password</Label>
          <div className="relative mx-auto max-w-full">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={2.5} />
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 pl-11 pr-4 rounded-xl bg-[#f0f4f8] text-sm text-slate-900 border-none outline-none focus:ring-2 focus:ring-slate-200 transition-shadow placeholder:text-slate-400"
              required
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full h-12 bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-xl font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 flex items-center justify-center"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : null}
            Sign in
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
