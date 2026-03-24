import { useState } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate } from "react-router-dom"

function Checkout({ cart, user }) {
  const navigate = useNavigate()
  const [coupon, setCoupon] = useState("")
  const [discount, setDiscount] = useState(0)
  const [slip, setSlip] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState("")

  // ✅ แก้ไขการคำนวณ Total ให้คูณจำนวนสินค้า (qty) ด้วย
  const total = cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0)
  const finalTotal = Math.max(total - discount, 0)

  const applyCoupon = () => {
    let applied = false
    if(coupon === "PINK10") {
      setDiscount(Math.floor(total * 0.10))
      applied = true
    } else if(coupon === "SALE50") {
      setDiscount(50)
      applied = true
    }

    if(applied){
      alert(`✅ Coupon applied! ลดเรียบร้อยครับ`)
    } else {
      alert("❌ Invalid coupon")
      setDiscount(0)
    }
  }

  const createOrder = async () => {
    if (!user) return alert("Please login first")
    if (cart.length === 0) return alert("Cart is empty")
    if (!paymentMethod || !slip) return alert("กรุณาเลือกวิธีชำระเงินและอัปโหลดสลิป")

    const fileName = `${Date.now()}-${slip.name}`

    // 1. อัปโหลดสลิปไปที่ Storage
    const { error: uploadError } = await supabase.storage
      .from("slips")
      .upload(fileName, slip, { contentType: slip.type })

    if (uploadError) return alert(uploadError.message)

    const { data: urlData } = supabase.storage.from("slips").getPublicUrl(fileName)
    const slipUrl = urlData.publicUrl

    // 2. ✅ เตรียมข้อมูลสินค้า "แบบละเอียด" เพื่อให้หน้า Orders แสดงรูปภาพได้
    const itemsToSave = cart.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      qty: item.qty || 1,
      image: item.image // 🔥 ต้องเซฟ URL รูปเก็บไว้ในออเดอร์ด้วย
    }))

    // 3. บันทึกลง Database (Items ส่งเป็น Array ได้เลย ไม่ต้อง stringify)
    const { error } = await supabase.from("orders").insert([
      {
        user_id: user.id,
        user_email: user.email,
        items: itemsToSave, // ✅ เซฟเป็น JSONB Array
        total: finalTotal,
        payment_status: "pending",
        slip_url: slipUrl,
        payment_method: paymentMethod,
        created_at: new Date()
      }
    ])

    if (error) {
      alert("Order failed: " + error.message)
      return
    }

    alert("🎉 Order placed successfully!")
    window.location.href = "/" // กลับหน้าแรกเพื่อรีเซ็ต State
  }

  return (
    <div className="checkout-container" style={{ padding: "40px", color: "white" }}>
      <div className="box" style={{ backgroundColor: "#1a1a1a", padding: "30px", borderRadius: "20px", border: "1px solid #333" }}>
        <h2 style={{ color: "#ff2e93" }}>Checkout</h2>

        {/* รายการสรุปสินค้าแบบสั้นๆ */}
        <div style={{ marginBottom: "20px" }}>
          {cart.map((item, index) => (
            <div key={index} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", borderBottom: "1px solid #222", paddingBottom: "5px" }}>
              <span>{item.name} x {item.qty || 1}</span>
              <span>{item.price * (item.qty || 1)} บาท</span>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "right", marginBottom: "20px" }}>
          <p>Total: {total} บาท</p>
          <p style={{ color: "#2ecc71" }}>Discount: -{discount} บาท</p>
          <h2 style={{ color: "#ff2e93" }}>Final Total: {finalTotal} บาท</h2>
        </div>

        <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
          <input
            className="search"
            placeholder="Enter coupon"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            style={{ flex: 1 }}
          />
          <button className="add-btn" onClick={applyCoupon}>Apply</button>
        </div>

        <h3>เลือกวิธีชำระเงิน</h3>
        <select 
          className="search" 
          style={{ width: "100%", marginBottom: "20px" }}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="">-- เลือกช่องทางชำระเงิน --</option>
          <option value="kbank">K-Bank (โอนเงิน)</option>
          <option value="qr">PromptPay QR Code</option>
        </select>

        {paymentMethod === "kbank" && (
          <div style={{ padding: "15px", backgroundColor: "#111", borderRadius: "10px", marginBottom: "20px", border: "1px solid #ff2e93" }}>
            <p>ธนาคารกสิกรไทย | เลขบัญชี: 123-4-56789-0</p>
            <p>ชื่อบัญชี: Pink Shop</p>
          </div>
        )}

        {paymentMethod === "qr" && (
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <img src={`https://promptpay.io/0812345678/${finalTotal}.png`} width="180" alt="qr" style={{ borderRadius: "10px" }} />
          </div>
        )}

        <p>อัปโหลดหลักฐานการโอน (Slip):</p>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSlip(e.target.files[0])}
          style={{ marginBottom: "20px" }}
        />

        <button 
          className="add-btn" 
          style={{ width: "100%", padding: "15px", fontSize: "18px" }}
          onClick={createOrder}
        >
          Confirm Order
        </button>
      </div>
    </div>
  )
}

export default Checkout