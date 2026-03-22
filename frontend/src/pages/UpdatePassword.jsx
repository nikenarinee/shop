import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleUpdate = async () => {
    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      setMessage("❌ Error: " + error.message);
    } else {
      setMessage("✅ เปลี่ยนรหัสผ่านสำเร็จ! กำลังพาไปหน้า Login...");
      setTimeout(() => navigate("/login"), 3000);
    }
  };

  return (
    <div style={{ color: "white", padding: "50px", textAlign: "center" }}>
      <h2>สร้างรหัสผ่านใหม่</h2>
      <input 
        type="password" 
        placeholder="รหัสผ่านใหม่" 
        onChange={(e) => setPassword(e.target.value)} 
        style={{ padding: "10px", margin: "10px" }}
      />
      <button onClick={handleUpdate} style={{ padding: "10px 20px" }}>อัปเดตรหัสผ่าน</button>
      <p>{message}</p>
    </div>
  );
}
export default UpdatePassword;