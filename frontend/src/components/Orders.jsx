import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"

function Orders({ setShowOrders }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)

      // ✅ เอา user มากรอง
      const { data: userData } = await supabase.auth.getUser()

      if (!userData?.user) {
        setOrders([])
        return
      }

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_email", userData.user.email) // ✅ สำคัญ!
        .order("id", { ascending: false })

      if (error) {
        console.error(error)
        return
      }

      setOrders(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: "40px", backgroundColor: "#0f0f0f", minHeight: "100vh", color: "white" }}>
      
      <button 
        onClick={() => setShowOrders ? setShowOrders(false) : navigate("/")}
        style={{
          background: "none",
          border: "none",
          color: "#ff2e93",
          cursor: "pointer",
          fontWeight: "bold",
          marginBottom: "20px"
        }}
      >
        ← Back to Products
      </button>

      <h1 style={{ color: "#ff2e93", marginBottom: "30px" }}>
        Your Purchase History
      </h1>

      {loading && <p>Loading...</p>}

      {!loading && orders.length === 0 && (
        <p style={{ color: "#888" }}>ไม่มีออเดอร์</p>
      )}

      {!loading && orders.map(order => (
        <div
          key={order.id}
          style={{
            backgroundColor: "#1a1a1a",
            padding: "20px",
            borderRadius: "15px",
            border: "1px solid #333",
            marginBottom: "20px"
          }}
        >
          <h3 style={{ color: "#ff2e93" }}>
            Order #{order.id}
            <span style={{
              float: "right",
              fontSize: "12px",
              backgroundColor: "#f1c40f",
              color: "black",
              padding: "2px 10px",
              borderRadius: "10px"
            }}>
              {order.payment_status}
            </span>
          </h3>

          <p style={{ fontSize: "14px", color: "#888" }}>Items Details:</p>

          {/* ✅ รายการสินค้า */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "15px 0" }}>
            {order.items && Array.isArray(order.items) ? (
              order.items.map((item, idx) => (
                <div key={idx} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  backgroundColor: "#111",
                  padding: "10px",
                  borderRadius: "10px"
                }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "8px",
                      objectFit: "cover",
                      backgroundColor: "#333"
                    }}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/50?text=No+Img"
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: "bold" }}>{item.name}</p>
                    <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>
                      {item.price} บาท
                    </p>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: 0, color: "#ff2e93" }}>
                      x{item.qty || 1}
                    </p>
                    <p style={{ margin: 0, fontWeight: "bold" }}>
                      {(item.price * (item.qty || 1))} บาท
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>ไม่มีข้อมูลรายการสินค้า</p>
            )}
          </div>

          {/* ✅ Total + Slip */}
          <div style={{
            borderTop: "1px solid #333",
            paddingTop: "15px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <p style={{ fontSize: "18px", fontWeight: "bold" }}>
              Total: <span style={{ color: "#ff2e93" }}>{order.total} บาท</span>
            </p>

            {order.slip_url && (
              <a href={order.slip_url} target="_blank" rel="noreferrer">
                <img
                  src={order.slip_url}
                  width="60"
                  style={{ borderRadius: "5px" }}
                  alt="slip"
                />
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Orders