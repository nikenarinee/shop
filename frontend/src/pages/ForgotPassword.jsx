import { useState } from "react"
import { supabase } from "../lib/supabase"

function ForgotPassword() {

  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleReset = async () => {

    if (!email) {
      setMessage("กรุณาใส่อีเมล")
      return
    }

    setLoading(true)
    setMessage("")

    // 🔥 ใส่ URL ตรงๆ ชัดๆ
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://shop-fron.onrender.com/update-password"
    })

    if (error) {
      setMessage("❌ ส่งอีเมลไม่สำเร็จ")
      console.log(error)
    } else {
      setMessage("✅ ส่งลิงก์รีเซ็ตรหัสไปที่อีเมลแล้ว 📩")
    }

    setLoading(false)
  }

  return (
    <div className="checkout-container">
      <div className="box">

        <h2>Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />

        <button onClick={handleReset} disabled={loading}>
          {loading ? "กำลังส่ง..." : "Reset Password"}
        </button>

        <p>{message}</p>

      </div>
    </div>
  )
}

export default ForgotPassword