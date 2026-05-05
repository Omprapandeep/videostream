import React, { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/appreal.png";
const Login = () => {

  const navigate = useNavigate();

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const res = await api.post("/users/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }

  };

  return (

    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0f]  relative overflow-hidden" >

      {/* background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-125  h-100 bg-[#16a34a] opacity-[0.12] rounded-full blur-[100px]"> </div>
        <div className="absolute top-1/4 right-1/4 w-100 h-125 bg-purple-700 opacity-[0.10] rounded-full blur-[120px] "></div>
        <div className="absolute bottom-1/4 right-1/3 w-75 h-75 bg-emerald-500 opacity-[0.08] rounded-full blur-[90px]" />
      </div>


      {/* grid texture */}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`, backgroundSize: "48px 48px" }}> </ div>



      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-125 rounded-[20px] p-10 flex flex-col "
        style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "0.5px solid rgba(255,255,255,0.12)",
          boxShadow: "0 32px 64px rgba(0,0,0,0.4) ,inset 0 1px 0 rgba(255,255,255,0.08) "
        }}
      >

        {/* logo */}
        <div className="flex items-center gap-2.5 mb-4" >
          <div className="w-18.5 h-13.5 rounded-[9px] flex items-center justify-center"
          >

            <img src={logo} alt="Logo" className="logo w-18 h-14" />

          </div>
        </div>

        {/* Heading */}
        <h2 className="text-white text-[22px] font-medium tracking-tight mb-1">
          Welcome back
        </h2>
        <p className="text-white/40 text-[13px] mb-7">
          Sign in to continue watching
        </p>

        {/* Error */}
        {error && (
          <div
            className="mb-5 px-4 py-2.5 rounded-lg text-[13px] text-[#f87171]"
            style={{
              background: "rgba(248,113,113,0.10)",
              border: "0.5px solid rgba(248,113,113,0.25)",
            }}
          >
            {error}
          </div>
        )}

        {/* email */}
        <div className="mb-3.5">
          <label className="text-white/40 text-[14px] mb-1.5 uppercase tracking-widest block" >
            Email
          </label>

          <input
            name="email"
            placeholder="Enter your email"
            type="email"
            onChange={handleChange}
            className="w-full px-3.5 py-2.75 rounded-[10px] text-[14px] text-white   placeholder-white/25 outline-none transition-all duration-200 focus:border-[#7c3aed]/50"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "0.5px solid rgba(255,255,255,0.12)",
            }}
          />
        </div>

        {/* Password */}
        <div className="mb-1">
          <label className="block text-[11px] uppercase tracking-widest text-white/40 mb-1.5">
            Password
          </label>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            onChange={handleChange}
            className="w-full px-3.5 py-2.75 rounded-[10px] text-[14px] text-white placeholder-white/25 outline-none transition-all duration-200 focus:border-[#7c3aed]/50"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "0.5px solid rgba(255,255,255,0.12)",
            }}
          />
        </div>

        {/* Forgot */}
        <div className="flex justify-end mt-1.5 mb-5">
          <Link
            to="/forgot-password"
            className="text-[12px] text-white/35 hover:text-[#a78bfa] transition-colors"
          >
            Forgot password?
          </Link>
        </div>



        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 rounded-[10px] text-[14px] font-medium text-white active:scale-[0.98] transition-all duration-150"
          style={{ background: "linear-gradient(135deg, #22c55e 0%, #7c3aed 100%)", boxShadow: "0 4px 24px rgba(124,58,237,0.30), 0 2px 12px rgba(34,197,94,0.20)" }}
        >
          Sign in
        </button>


        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <hr className="flex-1 border-none border-t border-white/10" style={{ borderTopWidth: "0.5px", borderColor: "rgba(255,255,255,0.1)" }} />
          <span className="text-[12px] text-white/30">or</span>
          <hr className="flex-1 border-none" style={{ borderTopWidth: "0.5px", borderColor: "rgba(255,255,255,0.1)" }} />
        </div>

        {/* Google */}
        <button
          type="button"
          className="w-full py-2.75 rounded-[10px] text-[13px] text-white/70 flex items-center justify-center gap-2 hover:bg-white/10 transition-all duration-150"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "0.5px solid rgba(255,255,255,0.12)",
          }}
        >
          <svg viewBox="0 0 48 48" width={16} height={16}>
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
          </svg>
          Continue with Google
        </button>

        {/* Sign up */}
        <p className="mt-6 text-center text-[13px] text-white/35">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-[#a78bfa] font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>

    </div>

  );
};

export default Login;