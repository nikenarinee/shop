import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { Link } from "react-router-dom" // ✅ ใช้ Link สำหรับกลับหน้า Products

function OwnerOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error) {
      setOrders(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return (
    <div style={{ padding: "40px", backgroundColor: "#0f0f0f", minHeight: "100vh", color: "white" }}>
      
      {/* ✅ ปุ่มย้อนกลับไปหน้า Products */}
      <div style={{ marginBottom: "20px" }}>
        <Link 
          to="/" 
          style={{ 
            color: "#ff2e93", 
            textDecoration: "none", 
            fontSize: "16px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "5px"
          }}
        >
          ← Back to Products
        </Link>
      </div>

      <h1 style={{ color: "#ff2e93", marginBottom: "30px" }}>Owner Dashboard</h1>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        <div style={{ display: "grid", gap: "20px" }}>
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                backgroundColor: "#1a1a1a",
                padding: "20px",
                borderRadius: "16px",
                border: "1px solid #333",
                boxShadow: "0 5px 15px rgba(0,0,0,0.3)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ margin: "0 0 10px 0", color: "#ff2e93" }}>Order ID: #{order.id}</h3>
                  <p style={{ margin: "5px 0" }}><b>User:</b> {order.user_email}</p>
                  <p style={{ margin: "5px 0" }}><b>Total:</b> <span style={{ color: "#ff2e93" }}>{order.total} บาท</span></p>
                  <p style={{ margin: "5px 0", fontSize: "14px", color: "#888" }}>
                    <b>Date:</b> {new Date(order.created_at).toLocaleString('th-TH')}
                  </p>
                </div>

                {/* 🔥 แสดงสลิปการชำระเงิน */}
                {order.payment_slip && (
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "14px", marginBottom: "5px" }}>Payment Slip:</p>
                    <a href={order.payment_slip} target="_blank" rel="noreferrer">
                      <img
                        src={order.payment_slip}
                        alt="slip"
                        width="120"
                        style={{ 
                          borderRadius: "10px", 
                          border: "2px solid #ff2e93", 
                          cursor: "pointer",
                          transition: "0.3s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                        onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                      />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OwnerOrders