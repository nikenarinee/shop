import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";

function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false); // เพิ่มสถานะ Loading

  const addProduct = async () => {
    // 1. ตรวจสอบข้อมูลก่อนส่ง
    if (!name || !price) {
      alert("กรุณากรอกชื่อและราคาให้ครบถ้วน");
      return;
    }

    setLoading(true); // เริ่มโหลด (กันผู้ใช้กดซ้ำ)
    console.log("กำลังส่งข้อมูลไปยัง Supabase...");

    try {
      // 2. ส่งข้อมูลไปยัง Supabase
      // ตรวจสอบชื่อ Table และ Column ให้ตรงกับใน Database (เช่น "image" หรือ "image_url")
      const { data, error } = await supabase
        .from("products") 
        .insert([
          {
            name: name,
            price: parseFloat(price),
            image: imageUrl, // <-- ตรวจสอบชื่อคอลัมน์ใน Supabase ว่าชื่อ image หรือไม่
          },
        ])
        .select();

      // 3. ถ้ามี Error จาก Supabase
      if (error) {
        console.error("Supabase Error:", error);
        throw error; // ส่ง Error ไปที่ catch
      }

      // 4. ถ้าสำเร็จ
      console.log("บันทึกสำเร็จ:", data);
      alert("Product added! 🎉");

      // ล้างค่าใน Form
      setName("");
      setPrice("");
      setImageUrl("");

    } catch (error) {
      // 5. ดักจับข้อผิดพลาดอื่นๆ (เช่น Network หรือ RLS Policy)
      console.error("Error adding product:", error.message);
      alert("เกิดข้อผิดพลาด: " + (error.message || "ไม่สามารถเชื่อมต่อฐานข้อมูลได้"));
    } finally {
      setLoading(false); // เลิกโหลด
    }
  };

  return (
    <div className="checkout-container">
      <div className="box">
        <div style={{ textAlign: "left", marginBottom: "10px" }}>
          <Link to="/admin" style={{ color: "#ff2e93", textDecoration: "none", fontSize: "14px" }}>
            ← Back to Admin
          </Link>
        </div>

        <h2>Add Product</h2>

        <input
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          placeholder="Image URL (ลิงก์รูปภาพ)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        {imageUrl && (
          <div style={{ marginTop: "15px", border: "1px solid #333", padding: "10px", borderRadius: "8px" }}>
            <p style={{ fontSize: "12px", color: "#aaa", marginBottom: "5px" }}>Image Preview:</p>
            <img 
              src={imageUrl} 
              alt="Preview"
              style={{ width: "100%", maxHeight: "150px", objectFit: "contain", borderRadius: "8px" }} 
            />
          </div>
        )}

        <br />

        {/* ปรับปรุงปุ่มให้แสดงสถานะ Loading */}
        <button 
          onClick={addProduct} 
          disabled={loading}
          style={{ 
            width: "100%", 
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </div>
    </div>
  );
}

export default AddProduct;