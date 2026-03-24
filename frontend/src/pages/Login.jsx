import { useState } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate, Link } from "react-router-dom"
import "../auth.css"

export default function Login({ setUser }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false) // 1. ป้องกันการกดซ้ำ

  const handleLogin = async () => {
    // 2. Client-side Validation เบื้องต้น
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
        // 3. ปรับ Error Message ให้เป็นกลาง (OWASP A07)
        alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง")
        return
      }

      const currentUser = data.session?.user
      if (!currentUser) return

      setUser(currentUser)

      // 4. ดึงข้อมูล Role อย่างปลอดภัย
      const { data: roleData, error: roleError } = await supabase
        .from("users")
        .select("role")
        .eq("email", currentUser.email)
        .single()

      if (roleError || !roleData) {
        navigate("/") // ถ้าหา role ไม่เจอ ให้ไปหน้าแรกไว้ก่อนเพื่อความปลอดภัย
        return
      }

      const role = roleData.role
      if (role === "admin") {
        navigate("/admin")
      } else {
        navigate("/")
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
          disabled={loading} // ปิด input ขณะโหลด
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          disabled={loading}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button 
          className="login-btn" 
          onClick={handleLogin} 
          disabled={loading} // 5. ป้องกันการสแปมปุ่ม Login
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