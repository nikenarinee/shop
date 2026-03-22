import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

function AdminOrders({ setShowAdmin }) {

  const [orders, setOrders] = useState([])

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("id", { ascending: false })

    if (error) {
      console.log(error)
      return
    }

    setOrders(data || [])
  }

  const updateStatus = async (id, status) => {

    const { error } = await supabase
      .from("orders")
      .update({ payment_status: status })
      .eq("id", id)

    if (error) {
      console.log(error)
      alert("Update failed")
      return
    }

    fetchOrders()
  }

  return (

    <div style={{ padding: "20px" }}>

      <h1>Admin Orders</h1>

      <button onClick={() => setShowAdmin(false)}>
        ⬅ Back
      </button>

      {orders.length === 0 && <p>No orders yet</p>}

      {orders.map(order => (

        <div
          key={order.id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginTop: "15px",
            borderRadius: "10px"
          }}
        >

          <h3>Order #{order.id}</h3>

          <p><b>User:</b> {order.user_email}</p>
          <p><b>Total:</b> {order.total} บาท</p>
          <p><b>Status:</b> {order.payment_status}</p>

          {/* 🔥 แสดงสลิป */}
          {order.slip_url && (
            <div style={{ marginTop: "10px" }}>
              <p>Payment Slip:</p>
              <img
                src={order.slip_url}
                alt="slip"
                width="200"
                style={{ borderRadius: "10px" }}
              />
            </div>
          )}

          <div style={{ marginTop: "15px" }}>

            <button
              onClick={() => updateStatus(order.id, "paid")}
              style={{
                background: "green",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "6px",
                marginRight: "10px",
                cursor: "pointer"
              }}
            >
              ✅ Approve
            </button>

            <button
              onClick={() => updateStatus(order.id, "rejected")}
              style={{
                background: "red",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              ❌ Reject
            </button>

          </div>

        </div>

      ))}

    </div>

  )

}

export default AdminOrders