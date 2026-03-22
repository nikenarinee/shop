import { useState } from "react";
import { supabase } from "../lib/supabase";

function UpdatePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleUpdate = async () => {
    // 🔥 สั่งอัปเดตรหัสผ่านใหม่
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      setMessage("❌ เปลี่ยนรหัสผ่านไม่สำเร็จ: " + error.message);
    } else {
      setMessage("✅ เปลี่ยนรหัสผ่านเรียบร้อยแล้ว! ลอง Login ใหม่ได้เลย");
    }
  };

  return (
    <div className="box">
      <h2>ตั้งรหัสผ่านใหม่</h2>
      <input
        type="password"
        placeholder="Enter new password"
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={handleUpdate}>Update Password</button>
      <p>{message}</p>
    </div>
  );
}
export default UpdatePassword;