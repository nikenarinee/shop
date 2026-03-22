import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate } from "react-router-dom"

export default function Profile({ user }) {

  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [bankName, setBankName] = useState("")
  const [bankAccount, setBankAccount] = useState("")

  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", user.email)   // ✅ ใช้ email แทน id
      .single()

    if (!error && data) {
      setName(data.name || "")
      setPhone(data.phone || "")
      setAddress(data.address || "")
      setBankName(data.bank_name || "")
      setBankAccount(data.bank_account || "")
    } else {
      console.log("Fetch profile error:", error)
    }
  }

  const updateProfile = async () => {
    const { error } = await supabase
      .from("users")
      .update({
        name,
        phone,
        address,
        bank_name: bankName,
        bank_account: bankAccount
      })
      .eq("email", user.email)  // ✅ ใช้ email แทน id

    if (error) {
      console.log(error)
      alert("Update failed")
      return
    }

    alert("อัปเดตโปรไฟล์สำเร็จ 🎉")
    setEditMode(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h2>My Profile</h2>

        <input placeholder="Name" value={name} disabled={!editMode} onChange={e=>setName(e.target.value)} />
        <input placeholder="Phone" value={phone} disabled={!editMode} onChange={e=>setPhone(e.target.value)} />
        <input placeholder="Address" value={address} disabled={!editMode} onChange={e=>setAddress(e.target.value)} />
        <input placeholder="Bank Name" value={bankName} disabled={!editMode} onChange={e=>setBankName(e.target.value)} />
        <input placeholder="Bank Account" value={bankAccount} disabled={!editMode} onChange={e=>setBankAccount(e.target.value)} />

        {!editMode ? (
          <button onClick={() => setEditMode(true)} style={{ marginTop:"10px" }}>
            ✏️ Edit Profile
          </button>
        ) : (
          <button onClick={updateProfile} style={{ marginTop:"10px" }}>
            💾 Save Changes
          </button>
        )}

        <button
          onClick={()=>navigate("/")}
          style={{
            marginTop: "15px",
            background: "#ff2e93",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
           
        Back to Products
      
        </button>

      </div>
    </div>
  )
}