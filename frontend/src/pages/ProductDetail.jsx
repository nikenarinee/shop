import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"

function ProductDetail() {

  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProduct = async () => {

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", Number(id)) // ✅ แปลง id เป็น number
      .single()

    if (error) {
      console.log("Error:", error)
    } else {
      setProduct(data)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchProduct()
  }, [id]) // ✅ เผื่อ id เปลี่ยน

  if (loading) return <p>Loading...</p>

  if (!product) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>❌ ไม่พบสินค้า</h2>
        <button onClick={() => navigate("/")}>⬅ กลับหน้าแรก</button>
      </div>
    )
  }

  return (
    <div style={{ padding: "20px" }}>

      <button onClick={() => navigate("/")}>
        ⬅ กลับ
      </button>

      <br /><br />

      <img src={product.image} width="300" alt={product.name} />

      <h1>{product.name}</h1>

      <h2>{product.price} บาท</h2>

      <p>{product.description}</p>

    </div>
  )
}

export default ProductDetail