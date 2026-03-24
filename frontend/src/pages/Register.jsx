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
  const [loading, setLoading] = useState(false) // 1. เพิ่ม Loading state

  // ✅ ฟังก์ชันเช็คความรัดกุม (Regex)
  const isStrongPassword = (pass) => {
    // ยาว 8+, มีพิมพ์ใหญ่, พิมพ์เล็ก, ตัวเลข, อักขระพิเศษ
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    return regex.test(pass)
  }

  const handleRegister = async () => {
    if (!name || !phone || !email || !password) {
      alert("กรอกข้อมูลให้ครบ")
      return
    }

    // 2. ตรวจสอบความปลอดภัยของรหัสผ่านก่อนส่งไป Server
    if (!isStrongPassword(password)) {
      alert("รหัสผ่านไม่ปลอดภัยพอ! ต้องมีอย่างน้อย 8 ตัวอักษร, พิมพ์ใหญ่, พิมพ์เล็ก, ตัวเลข และสัญลักษณ์ (@$!%*?&)")
      return
    }

    setLoading(true) // เริ่มทำงาน

    try {
      // สมัคร auth
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

      // บันทึกลง users table
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
      setLoading(false) // จบการทำงาน
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
        <input
          type="password"
          placeholder="Password (8+ ตัวอักษร, A, a, 1, @)"
          value={password}
          disabled={loading}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        {/* แสดงคำแนะนำเล็กๆ ด้านล่าง input รหัสผ่าน */}
        <p className="password-hint">
          ใช้รหัสผ่านที่ยากต่อการเดาเพื่อความปลอดภัย
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