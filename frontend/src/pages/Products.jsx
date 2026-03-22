import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

function Products({ cart, setCart, search }) {

  const [products, setProducts] = useState([])

  useEffect(() => {
    getProducts()
  }, [])

  async function getProducts() {

    const { data, error } = await supabase
      .from("products")
      .select("*")

    if (!error) {
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

    // ✅ 🔥 เปลี่ยนตรงนี้ (ไม่ใช้ box แล้ว)
    <div className="products-page">

      <h2>Products</h2>

      <div className="product-grid">

        {filteredProducts.map((p) => (

          <div className="product-card" key={p.id}>

            <div className="image-box">
              <img src={p.image} className="product-image" alt={p.name} />
            </div>

            <h3 className="product-name">{p.name}</h3>
            <p className="product-price">{p.price} บาท</p>

            <button
              className="add-btn"
              onClick={() => addToCart(p)}
            >
              Add to Cart
            </button>

          </div>

        ))}

      </div>

    </div>

  )
}

export default Products