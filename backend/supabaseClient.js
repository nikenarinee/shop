import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

// เปลี่ยนชื่อตรงนี้ให้ตรงกับใน .env เป๊ะๆ
const supabaseUrl = process.env.VITE_SUPABASE_URL 
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Error: อ่านค่าจาก .env ไม่ได้ เช็คชื่อตัวแปรอีกรอบนะครับ");
}

export const supabase = createClient(supabaseUrl, supabaseKey)