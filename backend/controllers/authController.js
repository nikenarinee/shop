import { supabase } from "../supabaseClient.js"

// 1. ฟังก์ชันสมัครสมาชิก (Register)
export const register = async (req, res) => {
  const { name, email, password } = req.body

  // ตรวจสอบเบื้องต้นว่าส่งข้อมูลมาครบไหม
  if (!name || !email || !password) {
    return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" })
  }

  const { data, error } = await supabase
    .from("users")
    .insert([{ name, email, password }]) // ในอนาคตแนะนำให้ใช้ bcrypt เข้ารหัส password ก่อนนะครับ
    .select() // เพิ่ม .select() เพื่อให้ Supabase ส่งข้อมูลที่ insert กลับมาแสดงผล

  if (error) {
    return res.status(400).json({ message: error.message })
  }

  res.status(201).json({
    message: "Register success",
    data: data[0]
  })
}

// 2. ฟังก์ชันเข้าสู่ระบบ (Login) **ต้องเพิ่มตัวนี้เพื่อให้ Error หายไป**
export const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: "กรุณากรอกอีเมลและรหัสผ่าน" })
  }

  // ค้นหาผู้ใช้จาก email และ password
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("password", password) // เช็คแบบตรงตัว (ถ้าทำระบบจริงควรเช็คแบบ Hash)
    .single()

  if (error || !data) {
    return res.status(401).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" })
  }

  res.json({
    message: "Login success",
    user: {
      id: data.id,
      name: data.name,
      email: data.email
    }
  })
}