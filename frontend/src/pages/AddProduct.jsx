import { useState } from "react"
import { supabase } from "../lib/supabase"

function AddProduct() {

  const [name,setName] = useState("")
  const [price,setPrice] = useState("")
  const [imageUrl,setImageUrl] = useState("") // ✅ ใช้ URL แทนไฟล์

  const addProduct = async () => {
    if(!name || !price){
      alert("กรุณากรอกชื่อและราคา")
      return
    }

    const { error } = await supabase
      .from("products")
      .insert([
        {
          name,
          price,
          image: imageUrl // ✅ ใส่ URL ตรงนี้
        }
      ])

    if(error){
      alert(error.message)
      return
    }

    alert("Product added!")

    setName("")
    setPrice("")
    setImageUrl("")
  }

  return(
    <div className="checkout-container">
      <div className="box">

        <h2>Add Product</h2>

        <input
          placeholder="Product name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <input
          placeholder="Price"
          value={price}
          onChange={(e)=>setPrice(e.target.value)}
        />

        <input
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e)=>setImageUrl(e.target.value)}
        />

        {/* 🔥 preview รูป */}
        {imageUrl && (
          <div style={{ marginTop:"10px" }}>
            <p>Preview:</p>
            <img src={imageUrl} width="150" style={{ borderRadius:"8px" }} />
          </div>
        )}

        <br/><br/>

        <button onClick={addProduct}>
          Add Product
        </button>

      </div>
    </div>
  )
}

export default AddProduct