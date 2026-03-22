import { useState } from "react"
import { supabase } from "../lib/supabase"

function Checkout({ cart, user }) {

  const [coupon, setCoupon] = useState("")
  const [discount, setDiscount] = useState(0)
  const [slip, setSlip] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState("")

  // รวมราคาสินค้า
  const total = cart.reduce((sum, item) => sum + item.price, 0)
  const finalTotal = Math.max(total - discount, 0) // ✅ กันไม่ให้ติดลบ

  // ✅ เพิ่มระบบคูปองแบบง่าย
  const applyCoupon = () => {
    let applied = false

    if(coupon === "PINK10") {
      setDiscount(Math.floor(total * 0.10)) // 10% ของ total
      applied = true
    } else if(coupon === "SALE50") {
      setDiscount(50) // ลด 50 บาท
      applied = true
    }

    if(applied){
      alert(`✅ Coupon applied! ลด ${discount || (coupon==="PINK10" ? Math.floor(total*0.10) : 50)} บาท`)
    } else {
      alert("❌ Invalid coupon")
      setDiscount(0)
    }
  }

  const createOrder = async () => {

    if (!user) {
      alert("Please login first")
      return
    }

    if (cart.length === 0) {
      alert("Cart is empty")
      return
    }

    if (!paymentMethod) {
      alert("กรุณาเลือกวิธีชำระเงิน")
      return
    }

    if (!slip) {
      alert("กรุณาอัปโหลดสลิป")
      return
    }

    const fileName = `${Date.now()}-${slip.name}`

    const { error: uploadError } = await supabase
      .storage
      .from("slips")
      .upload(fileName, slip, {
        contentType: slip.type
      })

    if (uploadError) {
      alert(uploadError.message)
      return
    }

    const { data: urlData } = supabase
      .storage
      .from("slips")
      .getPublicUrl(fileName)

    const slipUrl = urlData.publicUrl

    const { error } = await supabase
      .from("orders")
      .insert([
        {
          user_id: user.id,
          user_email: user.email,
          items: JSON.stringify(cart),
          total: finalTotal,
          payment_status: "pending",
          slip_url: slipUrl,
          payment_method: paymentMethod
        }
      ])

    if (error) {
      alert("Order failed")
      return
    }

    alert("Order placed successfully!")
    window.location.href = "/"
  }

  return(
    <div className="checkout-container">
      <div className="box">

        <h2>Checkout</h2>

        {cart.map((item, index) => (
          <p key={index}>
            {item.name} - {item.price} บาท
          </p>
        ))}

        <h3>Total: {total} บาท</h3>
        <h3>Discount: {discount} บาท</h3>
        <h2>Final: {finalTotal} บาท</h2>

        <br/>

        <input
          placeholder="Enter coupon"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
        />
        <button onClick={applyCoupon}>
          Apply Coupon
        </button>

        <br/><br/>

        <h3>เลือกวิธีชำระเงิน</h3>
        <select onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="">-- เลือก --</option>
          <option value="kbank">K-Bank</option>
          <option value="qr">QR Code</option>
        </select>

        <br/><br/>

        {paymentMethod === "kbank" && (
          <div>
            <p>โอนมาที่:</p>
            <p>ธนาคารกสิกรไทย</p>
            <p>เลขบัญชี: 123-4-56789-0</p>
            <p>ชื่อ: Pink Shop</p>
          </div>
        )}

        {paymentMethod === "qr" && (
          <div>
            <p>สแกน QR ด้านล่าง</p>
            <img
              src={`https://promptpay.io/0812345678/${finalTotal}.png`}
              width="200"
              alt="qr"
            />
          </div>
        )}

        <br/>

        <input
          type="file"
          accept="image/*"
          onChange={(e)=>setSlip(e.target.files[0])}
        />

        <br/><br/>

        <button className="add-btn" onClick={createOrder}>
          Confirm Order
        </button>

      </div>
    </div>
  )
}

export default Checkout