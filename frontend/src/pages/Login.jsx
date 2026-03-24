import { useState } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate, Link } from "react-router-dom"
import "../auth.css"

export default function Login({ setUser }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน")
      return
    }

    setLoading(true)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง")
        return
      }

      const currentUser = data.session?.user
      if (!currentUser) return

      setUser(currentUser)

      // ดึงข้อมูล Role จากตาราง users
      const { data: roleData, error: roleError } = await supabase
        .from("users")
        .select("role")
        .eq("email", currentUser.email)
        .single()

      if (roleError || !roleData) {
        // ถ้าเข้าสู่ระบบได้แต่ไม่มีข้อมูลในตาราง users ให้ไปหน้าแรก
        navigate("/") 
        return
      }

      const role = roleData.role

      // ✅ แยกเส้นทางตาม Role
      if (role === "owner") {
        navigate("/owner-dashboard") // ไปหน้าเจ้าของร้าน
      } else if (role === "admin") {
        navigate("/admin")           // ไปหน้าแอดมิน
      } else {
        navigate("/")                // ลูกค้าทั่วไป
      }

    } catch (err) {
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          disabled={loading}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          disabled={loading}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button 
          className="login-btn" 
          onClick={handleLogin} 
          disabled={loading}
        >
          {loading ? "กำลังเข้าสู่ระบบ..." : "Login"}
        </button>
        <div className="auth-links">
          <Link to="/forgot-password">Forgot Password?</Link>
          <Link to="/register">สมัครสมาชิก</Link>
        </div>
      </div>
    </div>
  )
}