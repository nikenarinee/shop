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

  const handleRegister = async () => {

    if (!name || !phone || !email || !password) {
      alert("กรอกข้อมูลให้ครบ")
      return
    }

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
      alert("สมัครสำเร็จ กรุณาเช็คอีเมลก่อน")
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
      console.log("INSERT ERROR:", insertError)
      alert(insertError.message)
      return
    }

    alert("สมัครสมาชิกสำเร็จ 🎉")

    // 🔥 เด้งไป login
    navigate("/login")
  }

  return (

    <div className="auth-container">

      <div className="auth-card">

        <h2>Register</h2>

        <input
          placeholder="Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <input
          placeholder="Phone"
          value={phone}
          onChange={(e)=>setPhone(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button className="login-btn" onClick={handleRegister}>
          Register
        </button>

        {/* ลิงก์ด้านล่าง */}
        <div className="auth-links">
          <Link to="/login">← กลับไป Login</Link>
        </div>

      </div>

    </div>

  )
}

