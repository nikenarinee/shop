import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

function Orders() {

  const [orders, setOrders] = useState([])

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {

    const { data: userData } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_email", userData.user.email) // 🔥 ตรงนี้สำคัญ
      .order("id", { ascending: false })

    if (error) {
      console.log(error)
      return
    }

    setOrders(data)
  }

  return (

    <div style={{ padding: "20px" }}>

      <h1>Your Orders</h1>

      {orders.length === 0 && (
        <p>ยังไม่มีออเดอร์</p>
      )}

      {orders.map(order => (

        <div key={order.id} style={{
          border: "1px solid #ccc",
          padding: "15px",
          marginTop: "10px",
          borderRadius: "10px"
        }}>

          <h3>Order #{order.id}</h3>

          <p>Total: {order.total} บาท</p>

          <p>Status: {order.payment_status}</p>

          {/* 🔥 แสดงสลิป */}
          {order.slip_url && (
            <img
              src={order.slip_url}
              width="200"
              style={{ marginTop: "10px" }}
            />
          )}

        </div>

      ))}

    </div>

  )
}

export default Orders