import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2, CheckCircle2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { firebaseSignIn } from "@/lib/firebase";
import { authApi } from "@/api/authApi";
import { useAuth } from "@/lib/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const successMessage = location.state?.message;

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

  return (
    <AuthLayout
      title="Welcome to AafCareConnect"
      subtitle="Sign in to continue"
    >
      {successMessage && (
        <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold text-center border border-emerald-200 flex items-center justify-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-3 rounded-xl bg-red-50 text-red-600 text-sm text-center font-medium border border-red-100">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-semibold text-slate-600 tracking-wide block">
            Email
          </Label>
          <div className="relative mx-auto max-w-full">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={2.5} />
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 pl-11 pr-4 rounded-xl bg-[#f0f4f8] text-sm text-slate-900 border-none outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all placeholder:text-slate-400"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-xs font-semibold text-slate-600 tracking-wide">
              Password
            </Label>
            <Link 
              to="/forgot-password" 
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative mx-auto max-w-full">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={2.5} />
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 pl-11 pr-4 rounded-xl bg-[#f0f4f8] text-sm text-slate-900 border-none outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all placeholder:text-slate-400"
              required
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-xl font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 flex items-center justify-center disabled:opacity-60 shadow-sm"
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

