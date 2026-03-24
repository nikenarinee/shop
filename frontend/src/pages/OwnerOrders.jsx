import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

function OwnerOrders() {

  const [orders, setOrders] = useState([])

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

    </div>

  )
}

export default OwnerOrders