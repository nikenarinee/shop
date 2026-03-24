import { useEffect, useState } from "react"
import { Link } from "react-router-dom" // ✅ เพิ่ม Link
import { supabase } from "../lib/supabase"

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    const { data: userData } = await supabase.auth.getUser()

    if (userData?.user) {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_email", userData.user.email)
        .order("id", { ascending: false })

      if (!error) {
        setOrders(data)
      }
    }
    setLoading(false)
  }

  return (
    <div style={{ padding: "40px", backgroundColor: "#0f0f0f", minHeight: "100vh", color: "white" }}>
      
      {/* ✅ ปุ่มย้อนกลับไปหน้า Products */}
      <div style={{ marginBottom: "25px" }}>
        <Link 
          to="/" 
          style={{ 
            color: "#ff2e93", 
            textDecoration: "none", 
            fontSize: "16px",
            fontWeight: "bold",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          ← Back to Products
        </Link>
      </div>

      <h1 style={{ color: "#ff2e93", marginBottom: "30px" }}>Your Purchase History</h1>

      {loading ? (
        <p>Loading your orders...</p>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "50px", color: "#666" }}>
          <p>คุณยังไม่มีประวัติการสั่งซื้อ</p>
          <Link to="/" style={{ color: "#ff2e93" }}>ไปช้อปปิ้งกันเลย!</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {orders.map(order => (
            <div key={order.id} style={{
              backgroundColor: "#1a1a1a",
              padding: "25px",
              borderRadius: "15px",
              border: "1px solid #333",
              boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #333", paddingBottom: "15px", marginBottom: "15px" }}>
                <h3 style={{ margin: 0, color: "#ff2e93" }}>Order #{order.id}</h3>
                <span style={{ 
                  backgroundColor: order.payment_status === "completed" ? "#2ecc71" : "#f1c40f", 
                  color: "black", 
                  padding: "4px 12px", 
                  borderRadius: "20px", 
                  fontSize: "12px", 
                  fontWeight: "bold" 
                }}>
                  {order.payment_status}
                </span>
              </div>

              {/* ✅ ส่วนแสดงรายการสินค้าที่สั่ง (สั่งอะไรไปบ้าง) */}
              <div style={{ marginBottom: "15px" }}>
                <p style={{ color: "#888", fontSize: "14px", marginBottom: "10px" }}>Items Details:</p>
                {order.items && Array.isArray(order.items) ? (
                  order.items.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px", fontSize: "15px" }}>
                      <span>{item.name} x {item.qty}</span>
                      <span>{item.price * item.qty} บาท</span>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: "14px", color: "#555" }}>ไม่มีข้อมูลรายการสินค้า</p>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid #333", paddingTop: "15px" }}>
                <div>
                  <p style={{ margin: "0", fontSize: "18px", fontWeight: "bold" }}>
                    Total: <span style={{ color: "#ff2e93" }}>{order.total} บาท</span>
                  </p>
                  <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#555" }}>
                    Date: {new Date(order.created_at).toLocaleString('th-TH')}
                  </p>
                </div>

                {/* 🔥 แสดงสลิป (ถ้ามี) */}
                {order.slip_url && (
                  <a href={order.slip_url} target="_blank" rel="noreferrer">
                    <img
                      src={order.slip_url}
                      alt="payment slip"
                      width="80"
                      style={{ borderRadius: "8px", border: "1px solid #ff2e93", cursor: "pointer" }}
                    />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders