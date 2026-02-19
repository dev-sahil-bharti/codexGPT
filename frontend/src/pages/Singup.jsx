import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Github, Chrome, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import logo from '../assets/logo.png';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // OTP States
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const { signup, sendOtp } = useAuth(); // Import sendOtp
  const navigate = useNavigate();

  const passwordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: "", color: "" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    const levels = [
      { label: "Weak", color: "bg-red-500" },
      { label: "Fair", color: "bg-orange-500" },
      { label: "Good", color: "bg-yellow-500" },
      { label: "Strong", color: "bg-green-500" },
    ];
    return { score, ...levels[score - 1] || levels[0] };
  };

  const strength = passwordStrength(formData.password);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    else if (formData.name.trim().length < 3) newErrors.name = "Name must be at least 3 characters";

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Enter a valid email";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";

    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    const result = await sendOtp(formData.email);
    setLoading(false);

    if (result.success) {
      setOtpSent(true);
      if (result.devMode) {
        alert("DEV MODE: Check VS Code Console for OTP code");
      } else {
        alert("OTP Sent to " + formData.email);
      }
    } else {
      setErrors({ email: result.error });
    }
  };

  const handleVerifyAndSignup = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setErrors({ otp: "Enter a valid 6-digit OTP" });
      return;
    }

    setLoading(true);
    // Call signup with OTP
    const result = await signup(formData.name, formData.email, formData.password, otp);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
    } else {
      setErrors({ ...errors, otp: result.error }); // Show error on OTP or general
      alert(result.error);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-10 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 size={44} className="text-green-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Account Created!</h2>
          <p className="text-white/50 text-sm mb-6">
            Welcome aboard, <span className="text-purple-400 font-medium">{formData.name}</span>! Your account has been created successfully.
          </p>
          <button
            onClick={() => {
              setSuccess(false);
              navigate('/login');
            }}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-xl transition-all duration-200"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full opacity-10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full opacity-10 blur-3xl pointer-events-none" />

      {/* Card */}
      <div className="relative w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">

        {/* Header */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg mb-4 p-2">
            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* OTP VIEW */}
        {otpSent ? (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Verify Email</h2>
              <p className="text-white/50 text-sm">
                Enter the 6-digit code sent to <span className="text-white">{formData.email}</span>
              </p>
            </div>

            <form onSubmit={handleVerifyAndSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">One-Time Password</label>
                <div className="relative">
                  <ShieldCheck size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => {
                      if (e.target.value.length <= 6) setOtp(e.target.value);
                      setErrors({ ...errors, otp: "" });
                    }}
                    placeholder="123456"
                    className={`w-full bg-white/5 border ${errors.otp ? "border-red-500/60" : "border-white/10"} text-white tracking-widest text-center text-lg placeholder-white/10 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-purple-500/60 focus:bg-white/10 transition-all duration-200`}
                  />
                </div>
                {errors.otp && <p className="text-red-400 text-xs mt-1.5 text-center">{errors.otp}</p>}
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? "Verifying..." : "Verify & Create Account"}
              </button>
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="w-full py-2 text-white/40 hover:text-white text-sm transition-colors"
              >
                Back to details
              </button>
            </form>
          </div>
        ) : (
          // SIGN UP FORM
          <>
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-white">Create account</h1>
              <p className="text-white/40 text-sm mt-1">Sign up to get started for free</p>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button className="flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-white/80 text-sm font-medium transition-all duration-200">
                <Chrome size={17} className="text-blue-400" /> Google
              </button>
              <button className="flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-white/80 text-sm font-medium transition-all duration-200">
                <Github size={17} /> GitHub
              </button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/25 text-xs font-medium tracking-wider">OR SIGN UP WITH EMAIL</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full bg-white/5 border ${errors.name ? "border-red-500/60" : "border-white/10"} text-white placeholder-white/20 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-purple-500/60 focus:bg-white/10 transition-all duration-200`}
                  />
                </div>
                {errors.name && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">⚠ {errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`w-full bg-white/5 border ${errors.email ? "border-red-500/60" : "border-white/10"} text-white placeholder-white/20 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-purple-500/60 focus:bg-white/10 transition-all duration-200`}
                  />
                </div>
                {errors.email && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">⚠ {errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 8 characters"
                    className={`w-full bg-white/5 border ${errors.password ? "border-red-500/60" : "border-white/10"} text-white placeholder-white/20 rounded-xl pl-10 pr-11 py-3 text-sm outline-none focus:border-purple-500/60 focus:bg-white/10 transition-all duration-200`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Password Strength Bar */}
                {formData.password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength.score ? strength.color : "bg-white/10"}`} />
                      ))}
                    </div>
                    <p className={`text-xs ${strength.score <= 1 ? "text-red-400" : strength.score === 2 ? "text-orange-400" : strength.score === 3 ? "text-yellow-400" : "text-green-400"}`}>
                      {strength.label} password
                    </p>
                  </div>
                )}
                {errors.password && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">⚠ {errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    className={`w-full bg-white/5 border ${errors.confirmPassword
                      ? "border-red-500/60"
                      : formData.confirmPassword && formData.password === formData.confirmPassword
                        ? "border-green-500/60"
                        : "border-white/10"
                      } text-white placeholder-white/20 rounded-xl pl-10 pr-11 py-3 text-sm outline-none focus:border-purple-500/60 focus:bg-white/10 transition-all duration-200`}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password === formData.confirmPassword && !errors.confirmPassword && (
                  <p className="text-green-400 text-xs mt-1.5 flex items-center gap-1">✓ Passwords match</p>
                )}
                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">⚠ {errors.confirmPassword}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                      <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                    </svg>
                    Sending Code...
                  </>
                ) : (
                  <>
                    Send OTP <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-white/40 text-sm mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default SignUp;