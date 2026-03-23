import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate } from "react-router-dom"

function OwnerOrders() {
  const [orders, setOrders] = useState([])
  const navigate = useNavigate()

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error) {
      setOrders(data)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleGoToProducts = () => {
    navigate("/products") // เปลี่ยนเป็น path หน้า Product ของคุณ
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Owner Dashboard</h1>

      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            marginTop: "10px"
          }}
        >
          <p><b>Order ID:</b> {order.id}</p>
          <p><b>User:</b> {order.user_email}</p>
          <p><b>Total:</b> {order.total} บาท</p>
          <p><b>Date:</b> {order.created_at}</p>

          {order.payment_slip && (
            <img
              src={order.payment_slip}
              width="200"
            />
          )}
        </div>
      ))}

      {/* ปุ่มกลับไปหน้า Product */}
      <button
        onClick={handleGoToProducts}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#FFD966", // สีเหลืองพาสเทล
          color: "#006994",          // ฟ้าน้ำทะเล
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        Go to Products
      </button>
    </div>
  )
}

export default OwnerOrders