import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"

function EditProduct() {

  const { id } = useParams()
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [image, setImage] = useState("")

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
      return
    }

    setName(data.name)
    setPrice(data.price)
    setImage(data.image)
  }

  const updateProduct = async () => {

    const { error } = await supabase
      .from("products")
      .update({
        name,
        price,
        image
      })
      .eq("id", id)

    if (error) {
      alert("Update failed")
      return
    }

    alert("Product updated")
    navigate("/admin")
  }

  return (

    <div style={{ padding: "40px", color: "white" }}>

      <h1>Edit Product</h1>

      <input
        placeholder="Product name"
        value={name}
        onChange={(e)=>setName(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Price"
        value={price}
        onChange={(e)=>setPrice(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Image URL"
        value={image}
        onChange={(e)=>setImage(e.target.value)}
      />

      <br /><br />

      <button onClick={updateProduct}>
        Update Product
      </button>

    </div>
  )
}

export default EditProduct