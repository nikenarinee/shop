import { useState } from "react"
import { supabase } from "../lib/supabase"

function ForgotPassword() {

  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const handleReset = async () => {

    if (!email) {
      setMessage("กรุณาใส่อีเมล")
      return
    }

    // 🔥 เรียก Supabase ส่งลิงก์รีเซ็ตรหัส
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/update-password"
    })

    if (error) {
      setMessage("❌ ส่งอีเมลไม่สำเร็จ")
    } else {
      setMessage("✅ ส่งลิงก์รีเซ็ตรหัสไปที่อีเมลแล้ว")
    }

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

        <button onClick={handleReset}>
          Reset Password
        </button>

        <p>{message}</p>

      </div>
    </div>
  )
}

export default ForgotPassword