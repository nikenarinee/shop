import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"

function Products({ cart, setCart, search }) {

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true) // ✅ เพิ่ม
  const navigate = useNavigate()

  useEffect(() => {
    getProducts()
  }, [])

  async function getProducts() {

    const { data, error } = await supabase
      .from("products")
      .select("*")

    if (error) {
      console.log("Error:", error.message) // ✅ แสดงชัดขึ้น
    } else {
      setProducts(data)
    }

    setLoading(false) // ✅ สำคัญมาก!!
  }

  // ⭐ เพิ่ม quantity ใน cart
  const addToCart = (product) => {

    const exist = cart.find((item) => item.id === product.id)

    if (exist) {
      const newCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, qty: item.qty + 1 }
          : item
      )
      setCart(newCart)
    } else {
      setCart([...cart, { ...product, qty: 1 }])
    }
  }

  // 🔍 ค้นหา (กัน error ถ้า search ว่าง)
  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(search?.toLowerCase() || "")
  )

  // ✅ ถ้ายังโหลดอยู่
  if (loading) {
    return <h1>Loading...</h1>
  }

  return (
    <div className="products-page">

      <h2>Products</h2>

      <div className="product-grid">

        {filteredProducts.map((p) => (

          <div 
            className="product-card" 
            key={p.id}
          >

            <div 
              className="image-box"
              onClick={() => navigate("/product/" + p.id)}
              style={{ cursor: "pointer" }}
            >
              <img src={p.image} className="product-image" alt={p.name} />
            </div>

            <h3 
              className="product-name"
              onClick={() => navigate("/product/" + p.id)}
              style={{ cursor: "pointer" }}
            >
              {p.name}
            </h3>

            <p className="product-price">{p.price} บาท</p>

            <button
              className="add-btn"
              onClick={() => addToCart(p)}
            >
              Add to Cart
            </button>

            <button
              className="add-btn"
              onClick={() => navigate("/product/" + p.id)}
            >
              ดูรายละเอียด
            </button>

          </div>

        ))}

      </div>

    </div>
  )
}

export default Products