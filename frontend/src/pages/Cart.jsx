import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Cart({ cart, setCart, setShowCart }) {
  const navigate = useNavigate()
  
  // ✅ เริ่มต้นเป็นค่าว่าง [] เพื่อให้ผู้ใช้เลือกเอง หรือถ้าไม่เลือกเลยจะซื้อทั้งหมด
  const [selectedIndexes, setSelectedIndexes] = useState([])

  // ⭐ คำนวณราคารวม (ถ้าไม่ติ๊กเลย ให้รวมทั้งหมด / ถ้าติ๊ก ให้รวมเฉพาะที่ติ๊ก)
  const isAnySelected = selectedIndexes.length > 0
  const finalTotal = isAnySelected 
    ? cart.reduce((sum, item, index) => selectedIndexes.includes(index) ? sum + item.price * item.qty : sum, 0)
    : cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  const toggleSelect = (index) => {
    if (selectedIndexes.includes(index)) {
      setSelectedIndexes(selectedIndexes.filter(i => i !== index))
    } else {
      setSelectedIndexes([...selectedIndexes, index])
    }
  }

  const goCheckout = () => {
    if (cart.length === 0) {
      alert("Cart is empty")
      return
    }

    // ✅ Logic: ถ้าติ๊กเลือกให้ส่งเฉพาะที่เลือก / ถ้าไม่ติ๊กเลยให้ส่งทั้งหมด
    const itemsToPay = isAnySelected 
      ? cart.filter((_, index) => selectedIndexes.includes(index))
      : cart

    navigate("/checkout", { 
      state: { 
        selectedItems: itemsToPay, 
        total: finalTotal 
      } 
    })
  }

  // ... (ฟังก์ชัน removeItem, increaseQty, decreaseQty เหมือนเดิม) ...
  const removeItem = (index) => {
    const newCart = cart.filter((item, i) => i !== index)
    setCart(newCart)
    setSelectedIndexes(selectedIndexes.filter(i => i !== index))
  }

  const increaseQty = (index) => {
    const newCart = [...cart]
    newCart[index].qty += 1
    setCart(newCart)
  }

  const decreaseQty = (index) => {
    const newCart = [...cart]
    if (newCart[index].qty > 1) {
      newCart[index].qty -= 1
    } else {
      newCart.splice(index, 1)
      setSelectedIndexes(selectedIndexes.filter(i => i !== index))
    }
    setCart(newCart)
  }

  return (
    <div style={{ padding: "40px", backgroundColor: "#0f0f0f", minHeight: "100vh", color: "white" }}>
      
      <button 
        onClick={() => setShowCart(false)}
        style={{ background: "none", border: "none", color: "#ff2e93", cursor: "pointer", fontSize: "16px", fontWeight: "bold", marginBottom: "20px", display: "flex", alignItems: "center", gap: "5px" }}
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
                gap: "15px",
                backgroundColor: "#1a1a1a",
                padding: "15px",
                borderRadius: "12px",
                border: selectedIndexes.includes(index) ? "1px solid #ff2e93" : "1px solid transparent",
                boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
              }}
            >
              <input 
                type="checkbox" 
                checked={selectedIndexes.includes(index)}
                onChange={() => toggleSelect(index)}
                style={{ width: "20px", height: "20px", accentColor: "#ff2e93", cursor: "pointer" }}
              />

              <img src={item.image} width="80" alt={item.name} style={{ borderRadius: "8px", objectFit: "cover" }} />

              <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0", color: "#ff2e93" }}>{item.name}</h3>
                <p style={{ margin: "5px 0", color: "#ccc" }}>{item.price} บาท</p>
                <div style={{ display: "flex", gap: "15px", alignItems: "center", marginTop: "10px" }}>
                  <button onClick={() => decreaseQty(index)} style={{ background: "#333", color: "white", border: "none", width: "30px", height: "30px", borderRadius: "5px", cursor: "pointer" }}>-</button>
                  <span style={{ fontSize: "18px", fontWeight: "bold" }}>{item.qty}</span>
                  <button onClick={() => increaseQty(index)} style={{ background: "#333", color: "white", border: "none", width: "30px", height: "30px", borderRadius: "5px", cursor: "pointer" }}>+</button>
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <p style={{ margin: "0 0 10px 0", fontWeight: "bold", fontSize: "16px" }}>
                  {item.price * item.qty} บาท
                </p>
                <button
                  onClick={() => removeItem(index)}
                  style={{ background: "#ff4d4d", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "14px" }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div style={{ 
            marginTop: "30px", 
            padding: "20px", 
            backgroundColor: "#1a1a1a", 
            borderRadius: "12px", 
            textAlign: "right", 
            borderTop: "2px solid #ff2e93" 
          }}>
            <p style={{ color: "#aaa", fontSize: "14px", marginBottom: "5px" }}>
              {isAnySelected ? `เลือกจ่ายเฉพาะที่ติ๊ก (${selectedIndexes.length} รายการ)` : "จ่ายทั้งหมดในตะกร้า"}
            </p>
            <h2 style={{ margin: "0 0 20px 0" }}> Total: <span style={{ color: "#ff2e93" }}>{finalTotal.toLocaleString()} บาท</span> </h2>
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
              {isAnySelected ? `Checkout Selected (${selectedIndexes.length})` : "Checkout All"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart