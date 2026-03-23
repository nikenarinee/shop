import { useState } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate } from "react-router-dom"

function UpdatePassword() {
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleUpdate = async () => {
    const { error } = await supabase.auth.updateUser({
      password: password
    })

    if (error) {
      alert("เปลี่ยนรหัสไม่สำเร็จ")
      console.log(error)
    } else {
      alert("เปลี่ยนรหัสสำเร็จ 🎉")
      navigate("/login")
    }
  }

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>ตั้งรหัสผ่านใหม่</h2>

      <input
        type="password"
        placeholder="รหัสใหม่"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleUpdate}>
        บันทึกรหัสใหม่
      </button>
    </div>
  )
}

export default UpdatePassword