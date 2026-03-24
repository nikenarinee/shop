import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { Link } from "react-router-dom"

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("id", { ascending: false })

    if (error) {
      console.log(error)
    } else {
      setOrders(data || [])
    }
    setLoading(false)
  }

  const updateStatus = async (id, status) => {
    const { error } = await supabase
      .from("orders")
      .update({ payment_status: status })
      .eq("id", id)

    if (error) {
      alert("Update failed: " + error.message)
      return
    }

    alert(`Order #${id} is now ${status}`)
    fetchOrders()
  }

  return (
    <div style={{ padding: "40px", backgroundColor: "#0f0f0f", minHeight: "100vh", color: "white" }}>
      
      <div style={{ marginBottom: "20px" }}>
        <Link 
          to="/admin" 
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
          ← Back to Admin Dashboard
        </Link>
      </div>

      <h1 style={{ color: "#ff2e93", marginBottom: "30px" }}>Admin Orders</h1>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        <div style={{ display: "grid", gap: "25px" }}>
          {orders.map(order => (
            <div
              key={order.id}
              style={{
                backgroundColor: "#1a1a1a",
                padding: "25px",
                borderRadius: "16px",
                border: "1px solid #333",
                boxShadow: "0 5px 15px rgba(0,0,0,0.3)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div>
                  <h3 style={{ margin: "0 0 10px 0", color: "#ff2e93" }}>Order #{order.id}</h3>
                  <p style={{ margin: "5px 0" }}><b>User:</b> {order.user_email}</p>
                  <p style={{ margin: "5px 0" }}><b>Date:</b> {new Date(order.created_at).toLocaleString('th-TH')}</p>
                </div>

                {/* Status Badge */}
                <span style={{ 
                  padding: "6px 15px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: "bold",
                  backgroundColor: order.payment_status === "paid" ? "#2ecc71" : order.payment_status === "rejected" ? "#e74c3c" : "#f1c40f",
                  color: "black"
                }}>
                  {order.payment_status}
                </span>
              </div>

              {/* ✅ ส่วนที่เพิ่มมา: รายการสินค้าที่ลูกค้าสั่ง (แบบ Mini Cards) */}
              <div style={{ marginBottom: "25px" }}>
                <p style={{ color: "#888", fontSize: "14px", marginBottom: "12px" }}>Items Details:</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {order.items && Array.isArray(order.items) ? (
                    order.items.map((item, idx) => (
                      <div key={idx} style={{
                        display: "flex", alignItems: "center", gap: "15px",
                        backgroundColor: "#111", padding: "12px", borderRadius: "12px", border: "1px solid #222"
                      }}>
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          style={{ width: "50px", height: "50px", borderRadius: "8px", objectFit: "cover", border: "1px solid #333" }} 
                          onError={(e) => { e.target.src = "https://via.placeholder.com/50?text=No+Img" }}
                        />
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0, fontWeight: "bold", color: "white" }}>{item.name}</p>
                          <p style={{ margin: "2px 0 0 0", color: "#888", fontSize: "12px" }}>{item.price} บาท</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ margin: 0, color: "#ff2e93", fontWeight: "bold" }}>x{item.qty || 1}</p>
                          <p style={{ margin: 0, fontWeight: "bold" }}>{(item.price * (item.qty || 1))} บาท</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: "#444" }}>ไม่มีข้อมูลรายการสินค้า</p>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid #333", paddingTop: "20px" }}>
                <div>
                   <p style={{ margin: "0", fontSize: "20px", fontWeight: "bold" }}>
                    Total: <span style={{ color: "#ff2e93" }}>{order.total} บาท</span>
                  </p>
                  <p style={{ margin: "5px 0 0 0", fontSize: "13px", color: "#555" }}>Method: {order.payment_method}</p>
                </div>

                {/* Payment Slip */}
                {order.slip_url && (
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "12px", color: "#888", marginBottom: "5px" }}>Payment Slip:</p>
                    <a href={order.slip_url} target="_blank" rel="noreferrer">
                      <img
                        src={order.slip_url}
                        alt="slip"
                        width="100"
                        style={{ borderRadius: "8px", border: "2px solid #ff2e93", cursor: "pointer" }}
                      />
                    </a>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                <button
                  onClick={() => updateStatus(order.id, "paid")}
                  style={{
                    background: "#2ecc71", color: "white", border: "none", padding: "12px",
                    borderRadius: "8px", cursor: "pointer", fontWeight: "bold", flex: 1
                  }}
                >
                  ✅ Approve
                </button>
                <button
                  onClick={() => updateStatus(order.id, "rejected")}
                  style={{
                    background: "#e74c3c", color: "white", border: "none", padding: "12px",
                    borderRadius: "8px", cursor: "pointer", fontWeight: "bold", flex: 1
                  }}
                >
                  ❌ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminOrders