import { useState } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate, Link } from "react-router-dom"
import "../auth.css"

export default function Login({ setUser }) {   // ✅ รับ setUser จาก App

  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      alert(error.message)
      return
    }

    // ✅ เก็บ user ใน state ของ App
    const currentUser = data.session?.user
    setUser(currentUser)

    // ✅ เช็ค role
    const { data: roleData } = await supabase
      .from("users")
      .select("role")
      .eq("email", currentUser.email)
      .single()

    const role = roleData?.role

    if (role === "admin") {
      navigate("/admin")   // แอดมินไปหน้า /admin
    } else {
      navigate("/")        // user ไปหน้า /
    }

  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          onChange={(e)=>setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e)=>setPassword(e.target.value)}
        />
        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>
        <div className="auth-links">
          <Link to="/forgot-password">Forgot Password?</Link>
          <Link to="/register">สมัครสมาชิก</Link>
        </div>
      </div>
    </div>
  )
}