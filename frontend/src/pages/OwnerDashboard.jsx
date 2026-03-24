import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { Link } from "react-router-dom"

function OwnerDashboard() {
  const [report, setReport] = useState({ totalSales: 0, orderCount: 0, pendingAmount: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReport()
  }, [])

  const fetchReport = async () => {
    setLoading(true)
    const { data, error } = await supabase.from("orders").select("*")

    if (!error && data) {
      // คำนวณยอดขายที่จ่ายเงินแล้ว (paid)
      const paidOrders = data.filter(o => o.payment_status === "paid")
      const total = paidOrders.reduce((sum, o) => sum + o.total, 0)
      
      // คำนวณยอดที่รอตรวจสอบ (pending)
      const pending = data.filter(o => o.payment_status === "pending")
        .reduce((sum, o) => sum + o.total, 0)

      setReport({
        totalSales: total,
        orderCount: data.length,
        pendingAmount: pending
      })
    }
    setLoading(false)
  }

  return (
    <div style={{ padding: "40px", backgroundColor: "#0f0f0f", minHeight: "100vh", color: "white" }}>
      <h1 style={{ color: "#ff2e93" }}>Owner Dashboard 📈</h1>
      <p style={{ color: "#888" }}>ภาพรวมรายได้ของ PinkShop</p>

      {loading ? <p>Loading Report...</p> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginTop: "30px" }}>
          
          {/* Card 1: ยอดขายรวม */}
          <div style={cardStyle}>
            <p style={{ fontSize: "14px", color: "#888" }}>ยอดขายที่สำเร็จแล้ว</p>
            <h2 style={{ fontSize: "32px", color: "#2ecc71" }}>฿{report.totalSales.toLocaleString()}</h2>
          </div>

          {/* Card 2: ยอดที่รอ Approve */}
          <div style={cardStyle}>
            <p style={{ fontSize: "14px", color: "#888" }}>ยอดเงินที่รอตรวจสอบ</p>
            <h2 style={{ fontSize: "32px", color: "#f1c40f" }}>฿{report.pendingAmount.toLocaleString()}</h2>
          </div>

          {/* Card 3: จำนวนออเดอร์ทั้งหมด */}
          <div style={cardStyle}>
            <p style={{ fontSize: "14px", color: "#888" }}>ออเดอร์ทั้งหมด</p>
            <h2 style={{ fontSize: "32px", color: "#ff2e93" }}>{report.orderCount} รายการ</h2>
          </div>

        </div>
      )}

      <div style={{ marginTop: "40px", display: "flex", gap: "15px" }}>
        <Link to="/admin" style={btnStyle}>ตรวจสอบออเดอร์ (Admin Mode)</Link>
        <Link to="/manage-products" style={{ ...btnStyle, backgroundColor: "#333" }}>จัดการสินค้าในร้าน</Link>
      </div>
    </div>
  )
}

const cardStyle = {
  backgroundColor: "#1a1a1a",
  padding: "30px",
  borderRadius: "20px",
  border: "1px solid #333",
  textAlign: "center"
}

const btnStyle = {
  padding: "15px 25px",
  backgroundColor: "#ff2e93",
  color: "white",
  textDecoration: "none",
  borderRadius: "10px",
  fontWeight: "bold"
}

export default OwnerDashboard