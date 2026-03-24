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

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  return (
    <div style={{ padding: "40px", color: "white" }}>
      
      {/* ส่วนหัวที่มีปุ่ม Home และ Logout */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>Admin Dashboard</h1>

        <div style={{ display: "flex", gap: "10px" }}>
          {/* 🏠 ปุ่มกลับหน้า Owner Dashboard */}
          <button
            onClick={() => navigate("/admin")} // <-- เปลี่ยนเป็น Path ของหน้า Dashboard หลักของคุณ
            style={{
              background: "#444",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            🏠 Home
          </button>

          <button
            onClick={handleLogout}
            style={{
              background: "red",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      <p>จัดการสินค้าในระบบ</p>

      {/* โซนปุ่มจัดการหลัก */}
      <div style={{ marginBottom: "30px", display: "flex", gap: "10px" }}>
        <button
          onClick={() => navigate("/add-product")}
          style={{
            background: "#ff2e93",
            border: "none",
            padding: "12px 20px",
            borderRadius: "8px",
            color: "white",
            cursor: "pointer"
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

      <hr style={{ borderColor: "#444", marginBottom: "30px" }} />

      <h2>Product List</h2>

      {products.length === 0 && (
        <p style={{ color: "#aaa" }}>ยังไม่มีสินค้าในระบบ</p>
      )}

      {products.map(product => (
        <div
          key={product.id}
          style={{
            border: "1px solid #555",
            padding: "20px",
            marginTop: "15px",
            borderRadius: "12px",
            background: "#1a1a1a"
          }}
        >
          <div style={{ display: "flex", gap: "20px", alignItems: "start" }}>
            {product.image && (
              <img
                src={product.image}
                width="120"
                alt={product.name}
                style={{ borderRadius: "10px", objectFit: "cover" }}
              />
            )}
            
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: "0 0 10px 0" }}>{product.name}</h3>
              <p style={{ color: "#00ff88", fontWeight: "bold", fontSize: "1.2rem" }}>
                {product.price.toLocaleString()} บาท
              </p>
              
              <div style={{ marginTop: "15px" }}>
                <button
                  onClick={() => navigate(`/edit-product/${product.id}`)}
                  style={{
                    background: "orange",
                    border: "none",
                    padding: "8px 18px",
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
                    background: "#333",
                    border: "1px solid red",
                    padding: "8px 18px",
                    borderRadius: "6px",
                    color: "red",
                    cursor: "pointer"
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Admin