import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/authRoutes.js"

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/auth", authRoutes)

app.get("/", (req, res) => {
  res.send("API running with Supabase")
})

// ลบส่วน mongoose.connect ออกไปแล้ว 
// เพราะเราเชื่อมต่อผ่าน supabaseClient.js แทน

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`)
  console.log(`🚀 Ready to use Supabase!`)
})