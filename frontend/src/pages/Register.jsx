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
  const [showPassword, setShowPassword] = useState(false) // ✅ ควบคุมการเปิด/ปิดตา

  // ✅ ฟังก์ชันเช็คความรัดกุม (OWASP A07: Identification and Authentication Failures)
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
      alert("รหัสผ่านไม่ปลอดภัยพอ! ต้องมีอย่างน้อย 8 ตัวอักษร, พิมพ์ใหญ่, พิมพ์เล็ก, ตัวเลข และสัญลักษณ์ (@$!%*?&)")
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
        alert("สมัครสำเร็จ กรุณาเช็คอีเมลเพื่อยืนยันตัวตนก่อนเข้าสู่ระบบ")
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
        console.error("INSERT ERROR:", insertError)
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
        
        {/* ✅ ส่วนของ Password ที่แก้ไข: จัดลูกตาไว้ขวาในกล่องขาว และไม่ล้น */}
        <div style={{ 
          position: "relative", 
          width: "100%", 
          display: "flex", 
          alignItems: "center" 
        }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            disabled={loading}
            onChange={(e) => setPassword(e.target.value)}
            style={{ 
              width: "100%", 
              paddingRight: "45px", // เว้นที่ให้ลูกตา
              boxSizing: "border-box", // ✅ ป้องกันกล่องล้นขอบสีดำ
              height: "45px", // ปรับความสูงให้สมดุล
              borderRadius: "8px",
              border: "none",
              backgroundColor: "white",
              color: "#333"
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "12px",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "18px",
              padding: "0",
              color: "#333",
              display: "flex",
              alignItems: "center"
            }}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
        
        {/* ✅ ข้อความแนะนำสีขาว */}
        <p style={{ 
          color: "white", 
          fontSize: "12px", 
          textAlign: "left", 
          marginTop: "8px", 
          marginBottom: "15px",
          width: "100%" 
        }}>
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