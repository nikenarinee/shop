import { useState } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate, Link } from "react-router-dom"
import "../auth.css"

export default function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false) // ✅ 1. State สำหรับเปิด/ปิดตา

  const isStrongPassword = (pass) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    return regex.test(pass)
  }

  const handleRegister = async () => {
    if (!name || !phone || !email || !password) {
      alert("กรอกข้อมูลให้ครบ")
      return
    }

    if (!isStrongPassword(password)) {
      alert("รหัสผ่านไม่ปลอดภัยพอ! ต้องมีอย่างน้อย 8 ตัวอักษร, พิมพ์ใหญ่, พิมพ์เล็ก, ตัวเลข และสัญลักษณ์")
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })

      if (error) {
        alert(error.message)
        return
      }

      const user = data.user || data.session?.user

      if (!user) {
        alert("สมัครสำเร็จ กรุณาเช็คอีเมลเพื่อยืนยันตัวตน")
        navigate("/login")
        return
      }

      const { error: insertError } = await supabase
        .from("users")
        .insert([
          {
            id: user.id,
            name: name,
            phone: phone,
            email: email,
            role: "user"
          }
        ])

      if (insertError) {
        alert("บันทึกข้อมูลล้มเหลว: " + insertError.message)
        return
      }

      alert("สมัครสมาชิกสำเร็จ 🎉")
      navigate("/login")

    } catch (err) {
      alert("เกิดข้อผิดพลาดไม่คาดคิด")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>
        
        <input
          placeholder="Name"
          value={name}
          disabled={loading}
          onChange={(e) => setName(e.target.value)}
        />
        
        <input
          placeholder="Phone"
          value={phone}
          disabled={loading}
          onChange={(e) => setPhone(e.target.value)}
        />
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          disabled={loading}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        {/* ✅ 2. ปรับช่องรหัสผ่านให้มีปุ่มดูรหัส */}
        <div style={{ position: "relative", width: "100%" }}>
          <input
            type={showPassword ? "text" : "password"} // สลับ type
            placeholder="Password (8+ ตัวอักษร, A, a, 1, @)"
            value={password}
            disabled={loading}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", paddingRight: "45px" }} // เว้นที่ให้ไอคอน
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "18px"
            }}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
        
        {/* ✅ 3. ปรับสีข้อความแนะนำให้เป็นสีขาว */}
        <p style={{ color: "white", fontSize: "12px", textAlign: "left", marginTop: "5px", marginBottom: "15px" }}>
          * ใช้รหัสผ่านที่ยากต่อการเดาเพื่อความปลอดภัย
        </p>

        <button 
          className="login-btn" 
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "กำลังบันทึก..." : "Register"}
        </button>

        <div className="auth-links">
          <Link to="/login">← กลับไป Login</Link>
        </div>
      </div>
    </div>
  )
}