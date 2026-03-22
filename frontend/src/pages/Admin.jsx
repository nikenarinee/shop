import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate } from "react-router-dom"

function Admin() {

  const [products, setProducts] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false })

    if (error) {
      console.log("Fetch error:", error)
      return
    }

    setProducts(data || [])
  }

  const deleteProduct = async (id) => {

    const confirmDelete = window.confirm("Delete this product?")
    if (!confirmDelete) return

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id)

    if (error) {
      console.log("Delete error:", error)
      alert("Delete failed")
      return
    }

    alert("Product deleted")
    fetchProducts()
  }

  // ✅ เพิ่ม Logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  return (

    <div style={{ padding: "40px", color: "white" }}>

      {/* ✅ แก้ตรงนี้นิดเดียว */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Admin Dashboard</h1>

        <button
          onClick={handleLogout}
          style={{
            background: "red",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            color: "white",
            cursor: "pointer"
          }}
        >
          🚪 Logout
        </button>
      </div>

      <p>จัดการสินค้า</p>

      {/* 🔥 ปุ่มด้านบน */}
      <div style={{ marginBottom: "20px" }}>

        <button
          onClick={() => navigate("/add-product")}
          style={{
            background: "#ff2e93",
            border: "none",
            padding: "12px 20px",
            borderRadius: "8px",
            color: "white",
            cursor: "pointer",
            marginRight: "10px"
          }}
        >
          ➕ Add Product
        </button>

        <button
          onClick={() => navigate("/admin-orders")}
          style={{
            background: "#4CAF50",
            border: "none",
            padding: "12px 20px",
            borderRadius: "8px",
            color: "white",
            cursor: "pointer"
          }}
        >
          📦 View Orders
        </button>

      </div>

      <h2>Product List</h2>

      {products.length === 0 && (
        <p>ยังไม่มีสินค้า</p>
      )}

      {products.map(product => (

        <div
          key={product.id}
          style={{
            border: "1px solid #555",
            padding: "15px",
            marginTop: "15px",
            borderRadius: "10px"
          }}
        >

          <h3>{product.name}</h3>
          <p>{product.price} บาท</p>

          {product.image && (
            <img
              src={product.image}
              width="120"
              style={{ borderRadius: "10px" }}
            />
          )}

          <br /><br />

          <button
            onClick={() => navigate(`/edit-product/${product.id}`)}
            style={{
              background: "orange",
              border: "none",
              padding: "8px 15px",
              borderRadius: "6px",
              color: "white",
              cursor: "pointer",
              marginRight: "10px"
            }}
          >
            Edit
          </button>

          <button
            onClick={() => deleteProduct(product.id)}
            style={{
              background: "red",
              border: "none",
              padding: "8px 15px",
              borderRadius: "6px",
              color: "white",
              cursor: "pointer"
            }}
          >
            Delete
          </button>

        </div>

      ))}

    </div>

  )
}

export default Admin