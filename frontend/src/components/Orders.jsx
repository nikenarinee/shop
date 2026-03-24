import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"

function Orders({ setShowOrders }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

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
      
      {/* ✅ ปุ่มย้อนกลับ */}
      <div style={{ marginBottom: "25px" }}>
        <button 
          onClick={() => setShowOrders ? setShowOrders(false) : navigate("/")}
          style={{ 
            background: "none", border: "none", color: "#ff2e93", 
            cursor: "pointer", fontSize: "16px", fontWeight: "bold",
            display: "flex", alignItems: "center", gap: "8px" 
          }}
        >
          ← Back to Products
        </button>
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
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          {orders.map(order => (
            <div key={order.id} style={{
              backgroundColor: "#1a1a1a", padding: "25px", borderRadius: "15px",
              border: "1px solid #333", boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
            }}>
              
              {/* Header: Order ID & Status */}
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #333", paddingBottom: "15px", marginBottom: "20px" }}>
                <h3 style={{ margin: 0, color: "#ff2e93" }}>Order #{order.id}</h3>
                <span style={{ 
                  backgroundColor: order.payment_status === "completed" ? "#2ecc71" : "#f1c40f", 
                  color: "black", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" 
                }}>
                  {order.payment_status || 'pending'}
                </span>
              </div>

              {/* ✅ รายการสินค้าแบบ Mini Cards (ตามเรฟที่คุณต้องการ) */}
              <div style={{ marginBottom: "20px" }}>
                <p style={{ color: "#888", fontSize: "14px", marginBottom: "15px" }}>Items Details:</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {order.items && Array.isArray(order.items) ? (
                    order.items.map((item, idx) => (
                      <div key={idx} style={{
                        display: "flex", alignItems: "center", gap: "15px",
                        backgroundColor: "#111", padding: "10px", borderRadius: "10px", border: "1px solid #222"
                      }}>
                        {/* รูปสินค้าจิ๋ว */}
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          style={{ width: "60px", height: "60px", borderRadius: "8px", objectFit: "cover", border: "1px solid #333" }} 
                        />
                        
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: 0, color: "#ff2e93", fontSize: "15px" }}>{item.name}</h4>
                          <p style={{ margin: "4px 0 0 0", color: "#aaa", fontSize: "13px" }}>{item.price} บาท</p>
                        </div>

                        <div style={{ textAlign: "right" }}>
                          <p style={{ margin: 0, fontSize: "14px", color: "white" }}>x{item.qty}</p>
                          <p style={{ margin: "4px 0 0 0", fontWeight: "bold", color: "white" }}>{item.price * item.qty} บาท</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: "14px", color: "#555" }}>ไม่มีข้อมูลรายการสินค้า</p>
                  )}
                </div>
              </div>

              {/* Footer: Total & Slip */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid #333", paddingTop: "15px" }}>
                <div>
                  <p style={{ margin: "0", fontSize: "18px", fontWeight: "bold" }}>
                    Total: <span style={{ color: "#ff2e93" }}>{order.total} บาท</span>
                  </p>
                  <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#555" }}>
                    Date: {new Date(order.created_at).toLocaleString('th-TH')}
                  </p>
                </div>

                {order.slip_url && (
                  <a href={order.slip_url} target="_blank" rel="noreferrer">
                    <img
                      src={order.slip_url}
                      alt="slip"
                      width="80"
                      style={{ borderRadius: "8px", border: "1px solid #ff2e93", cursor: "pointer", transition: "0.3s" }}
                      onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                      onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
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