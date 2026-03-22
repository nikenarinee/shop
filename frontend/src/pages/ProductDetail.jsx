import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "../lib/supabase"

function ProductDetail() {

  const { id } = useParams()
  const [product, setProduct] = useState(null)

  const fetchProduct = async () => {

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single()

    if (!error) {
      setProduct(data)
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [])

  if (!product) return <p>Loading...</p>

  return (

    <div style={{ padding: "20px" }}>

      <img src={product.image} width="300" />

      <h1>{product.name}</h1>

      <h2>{product.price} บาท</h2>

      <p>{product.description}</p>

    </div>

  )
}

export default ProductDetail