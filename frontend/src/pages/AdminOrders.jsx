import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { Link } from "react-router-dom" // ✅ ใช้ Link เพื่อการเปลี่ยนหน้าเว็บที่ถูกต้อง

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
      
      {/* ✅ ปุ่มย้อนกลับไปหน้า Admin หลัก */}
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
        <div style={{ display: "grid", gap: "20px" }}>
          {orders.map(order => (
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
                  <h3 style={{ margin: "0 0 10px 0", color: "#ff2e93" }}>Order #{order.id}</h3>
                  <p style={{ margin: "5px 0" }}><b>User:</b> {order.user_email}</p>
                  <p style={{ margin: "5px 0" }}><b>Total:</b> {order.total} บาท</p>
                  <p style={{ margin: "5px 0" }}>
                    <b>Status:</b> 
                    <span style={{ 
                      marginLeft: "10px",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "14px",
                      backgroundColor: order.payment_status === "paid" ? "#2ecc71" : order.payment_status === "rejected" ? "#e74c3c" : "#f1c40f",
                      color: "white"
                    }}>
                      {order.payment_status}
                    </span>
                  </p>
                </div>

                {/* 🔥 แสดงสลิป (ขยายรูปได้เมื่อคลิก) */}
                {order.slip_url && (
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "14px", marginBottom: "5px" }}>Payment Slip:</p>
                    <a href={order.slip_url} target="_blank" rel="noreferrer">
                      <img
                        src={order.slip_url}
                        alt="slip"
                        width="120"
                        style={{ borderRadius: "10px", border: "2px solid #ff2e93", cursor: "pointer" }}
                      />
                    </a>
                  </div>
                )}
              </div>

              <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                <button
                  onClick={() => updateStatus(order.id, "paid")}
                  style={{
                    background: "#2ecc71",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    flex: 1
                  }}
                >
                  ✅ Approve
                </button>

                <button
                  onClick={() => updateStatus(order.id, "rejected")}
                  style={{
                    background: "#e74c3c",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    flex: 1
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