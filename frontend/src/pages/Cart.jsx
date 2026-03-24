import { useNavigate } from "react-router-dom"

function Cart({ cart, setCart, setShowCart }) {
  const navigate = useNavigate()

  // ⭐ คำนวณราคารวมใหม่
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  const removeItem = (index) => {
    const newCart = cart.filter((item, i) => i !== index)
    setCart(newCart)
  }

  // ⭐ เพิ่มจำนวนสินค้า
  const increaseQty = (index) => {
    const newCart = [...cart]
    newCart[index].qty += 1
    setCart(newCart)
  }

  // ⭐ ลดจำนวนสินค้า
  const decreaseQty = (index) => {
    const newCart = [...cart]
    if (newCart[index].qty > 1) {
      newCart[index].qty -= 1
    } else {
      newCart.splice(index, 1)
    }
    setCart(newCart)
  }

  const goCheckout = () => {
    if (cart.length === 0) {
      alert("Cart is empty")
      return
    }
    navigate("/checkout")
  }

  return (
    <div style={{ padding: "40px", backgroundColor: "#0f0f0f", minHeight: "100vh", color: "white" }}>
      
      {/* ✅ ปุ่มย้อนกลับไปหน้า Products (ใช้สไตล์สีชมพู) */}
      <button 
        onClick={() => setShowCart(false)}
        style={{
          background: "none",
          border: "none",
          color: "#ff2e93",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "bold",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "5px"
        }}
      >
        ← Back to Products
      </button>

      <h1 style={{ color: "#ff2e93", marginBottom: "30px" }}>Your Cart</h1>

      {cart.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <p style={{ fontSize: "18px", color: "#aaa" }}>Your cart is empty 🛒</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {cart.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                backgroundColor: "#1a1a1a",
                padding: "15px",
                borderRadius: "12px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
              }}
            >
              <img src={item.image} width="80" alt={item.name} style={{ borderRadius: "8px", objectFit: "cover" }} />

              <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0", color: "#ff2e93" }}>{item.name}</h3>
                <p style={{ margin: "5px 0", color: "#ccc" }}>{item.price} บาท</p>

                {/* ⭐ ปุ่มปรับจำนวนสินค้า */}
                <div style={{ display: "flex", gap: "15px", alignItems: "center", marginTop: "10px" }}>
                  <button 
                    onClick={() => decreaseQty(index)}
                    style={{ background: "#333", color: "white", border: "none", width: "30px", height: "30px", borderRadius: "5px", cursor: "pointer" }}
                  >
                    -
                  </button>
                  <span style={{ fontSize: "18px", fontWeight: "bold" }}>{item.qty}</span>
                  <button 
                    onClick={() => increaseQty(index)}
                    style={{ background: "#333", color: "white", border: "none", width: "30px", height: "30px", borderRadius: "5px", cursor: "pointer" }}
                  >
                    +
                  </button>
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <p style={{ margin: "0 0 10px 0", fontWeight: "bold", fontSize: "16px" }}>
                  {item.price * item.qty} บาท
                </p>
                <button
                  onClick={() => removeItem(index)}
                  style={{
                    background: "#ff4d4d",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* 💰 ส่วนสรุปราคาทั้งหมด */}
          <div style={{ 
            marginTop: "30px", 
            padding: "20px", 
            backgroundColor: "#1a1a1a", 
            borderRadius: "12px",
            textAlign: "right",
            borderTop: "2px solid #ff2e93"
          }}>
            <h2 style={{ margin: "0 0 20px 0" }}> Total: <span style={{ color: "#ff2e93" }}>{total} บาท</span> </h2>
            <button
              onClick={goCheckout}
              style={{
                padding: "12px 40px",
                background: "linear-gradient(90deg, #ff85c0, #ff2e93)",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: "bold",
                transition: "0.3s"
              }}
            >
              Checkout Now
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart