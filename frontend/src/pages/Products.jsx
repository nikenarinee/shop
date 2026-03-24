import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"

function Products({ cart, setCart, search }) {

  const [products, setProducts] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    getProducts()
  }, [])

  async function getProducts() {

    const { data, error } = await supabase
      .from("products")
      .select("*")

    if (error) {
      console.log("Error:", error)
    } else {
      setProducts(data)
    }
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

  // 🔍 ค้นหาสินค้า
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="products-page">

      <h2>Products</h2>

      <div className="product-grid">

        {filteredProducts.map((p) => (

          <div 
            className="product-card" 
            key={p.id}
          >

            {/* ✅ กดรูป = ไปหน้า detail */}
            <div 
              className="image-box"
              onClick={() => navigate("/product/" + p.id)}
              style={{ cursor: "pointer" }}
            >
              <img src={p.image} className="product-image" alt={p.name} />
            </div>

            {/* ✅ กดชื่อ = ไปหน้า detail */}
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

            {/* ✅ ปุ่มดูรายละเอียด */}
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