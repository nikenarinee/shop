import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom" // ✅ เพิ่ม Link
import { supabase } from "../lib/supabase"

function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [image, setImage] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [])

  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      console.log(error)
      alert("ไม่พบข้อมูลสินค้านี้")
      navigate("/admin")
      return
    }

    setName(data.name)
    setPrice(data.price)
    setImage(data.image)
  }

  const updateProduct = async () => {
    if (!name || !price) {
      alert("กรุณากรอกชื่อและราคา")
      return
    }

    setLoading(true)
    const { error } = await supabase
      .from("products")
      .update({
        name,
        price: parseFloat(price), // ✅ แปลงเป็นตัวเลข
        image
      })
      .eq("id", id)

    setLoading(false)

    if (error) {
      alert("Update failed: " + error.message)
      return
    }

    alert("Product updated! ✨")
    navigate("/admin")
  }

  return (
    <div className="checkout-container"> {/* ✅ ใช้ Container เดียวกับหน้าอื่นเพื่อความกลางจอ */}
      <div className="box"> {/* ✅ ใช้กล่องสไตล์เดิมที่คุณมีใน CSS */}
        
        {/* ✅ ปุ่มย้อนกลับไปหน้า Admin */}
        <div style={{ textAlign: "left", marginBottom: "15px" }}>
          <Link to="/admin" style={{ color: "#ff2e93", textDecoration: "none", fontSize: "14px", fontWeight: "bold" }}>
            ← Back to Admin Dashboard
          </Link>
        </div>

        <h2 style={{ color: "white", marginBottom: "20px" }}>Edit Product</h2>

        <div style={{ textAlign: "left", fontSize: "14px", marginBottom: "5px" }}>Product Name:</div>
        <input
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div style={{ textAlign: "left", fontSize: "14px", marginBottom: "5px", marginTop: "15px" }}>Price (Baht):</div>
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <div style={{ textAlign: "left", fontSize: "14px", marginBottom: "5px", marginTop: "15px" }}>Image URL:</div>
        <input
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        {/* 🔥 Preview รูปเดิม/รูปใหม่ */}
        {image && (
          <div style={{ marginTop: "20px", padding: "10px", background: "#111", borderRadius: "10px" }}>
            <p style={{ fontSize: "12px", color: "#aaa", marginBottom: "10px" }}>Current Preview:</p>
            <img src={image} alt="Preview" style={{ width: "100%", maxHeight: "150px", objectFit: "contain", borderRadius: "8px" }} />
          </div>
        )}

        <br />

        <button 
          onClick={updateProduct} 
          disabled={loading}
          style={{ width: "100%", marginTop: "10px" }}
        >
          {loading ? "Updating..." : "Update Product"}
        </button>

      </div>
    </div>
  )
}

export default EditProduct