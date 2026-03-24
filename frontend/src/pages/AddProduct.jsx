import { useState } from "react"
import { supabase } from "../lib/supabase"
import { Link } from "react-router-dom" // ✅ เพิ่ม Link สำหรับการนำทาง

function AddProduct() {

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [imageUrl, setImageUrl] = useState("") 

  const addProduct = async () => {
    if (!name || !price) {
      alert("กรุณากรอกชื่อและราคา")
      return
    }

    const { error } = await supabase
      .from("products")
      .insert([
        {
          name,
          price: parseFloat(price), // แปลงเป็นตัวเลขเพื่อความถูกต้องในฐานข้อมูล
          image: imageUrl 
        }
      ])

    if (error) {
      alert(error.message)
      return
    }

    alert("Product added! 🎉")

    setName("")
    setPrice("")
    setImageUrl("")
  }

  return (
    <div className="checkout-container">
      <div className="box">
        {/* ✅ ปุ่มย้อนกลับไปหน้า Admin (จัดไว้มุมซ้ายบนของกล่อง) */}
        <div style={{ textAlign: "left", marginBottom: "10px" }}>
          <Link to="/admin" style={{ color: "#ff2e93", textDecoration: "none", fontSize: "14px" }}>
            ← Back to Admin
          </Link>
        </div>

        <h2>Add Product</h2>

        <input
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number" // เปลี่ยนเป็น number เพื่อให้กรอกง่ายขึ้น
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          placeholder="Image URL (ลิงก์รูปภาพ)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        {/* 🔥 preview รูป */}
        {imageUrl && (
          <div style={{ marginTop: "15px", border: "1px solid #333", padding: "10px", borderRadius: "8px" }}>
            <p style={{ fontSize: "12px", color: "#aaa", marginBottom: "5px" }}>Image Preview:</p>
            <img 
              src={imageUrl} 
              alt="Preview"
              style={{ width: "100%", maxHeight: "150px", objectFit: "contain", borderRadius: "8px" }} 
            />
          </div>
        )}

        <br />

        <button onClick={addProduct} style={{ width: "100%" }}>
          Add Product
        </button>
        
      </div>
    </div>
  )
}

export default AddProduct