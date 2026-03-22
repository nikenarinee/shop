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

    <div style={{ padding: "20px" }}>

      <h1>Your Cart</h1>

      <button onClick={() => setShowCart(false)}>
        Back to Products
      </button>

      {cart.length === 0 && <p>Cart is empty</p>}

      {cart.map((item, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginTop: "15px",
            borderBottom: "1px solid #ddd",
            paddingBottom: "10px"
          }}
        >

          <img src={item.image} width="80" alt="" />

          <div style={{ flex: 1 }}>
            <h3>{item.name}</h3>
            <p>{item.price} บาท</p>

            {/* ⭐ ปุ่ม quantity */}
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>

              <button onClick={() => decreaseQty(index)}>
                -
              </button>

              <span>{item.qty}</span>

              <button onClick={() => increaseQty(index)}>
                +
              </button>

            </div>

            <p>
              รวม: {item.price * item.qty} บาท
            </p>

          </div>

          <button
            onClick={() => removeItem(index)}
            style={{
              background: "red",
              color: "white",
              border: "none",
              padding: "6px 10px",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Remove
          </button>

        </div>
      ))}

      <h2 style={{ marginTop: "20px" }}>
        Total: {total} บาท
      </h2>

      <button
        onClick={goCheckout}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "green",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Checkout
      </button>

    </div>

  )
}

export default Cart