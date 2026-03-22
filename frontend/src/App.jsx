import { useEffect, useState } from "react"
import { supabase } from "./lib/supabase"
import { Routes, Route, useNavigate, Navigate } from "react-router-dom"

// นำเข้าหน้าต่างๆ (เช็คชื่อไฟล์ให้ตรงกับเครื่องคุณด้วยนะครับ)
import Products from "./pages/Products"
import Cart from "./pages/Cart"
import Orders from "./components/Orders"
import ProductDetail from "./pages/ProductDetail"
import ForgotPassword from "./pages/ForgotPassword"
import UpdatePassword from "./pages/UpdatePassword" // อย่าลืมสร้างไฟล์นี้!
import Login from "./pages/Login"
import Register from "./pages/Register"
import Profile from "./pages/Profile"
import OwnerOrders from "./pages/OwnerOrders"
import AddProduct from "./pages/AddProduct"
import Admin from "./pages/Admin"
import Checkout from "./pages/Checkout"
import AdminOrders from "./pages/AdminOrders"
import EditProduct from "./pages/EditProduct"

function App() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [showOrders, setShowOrders] = useState(false)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const initUser = async () => {
      const { data } = await supabase.auth.getSession()
      const currentUser = data?.session?.user || null
      setUser(currentUser)

      if (currentUser) {
        const { data: roleData } = await supabase
          .from("users")
          .select("role")
          .eq("email", currentUser.email)
          .single()

        const userRole = roleData?.role
        setRole(userRole)
      }
      setLoading(false)
    }
    initUser()

    // ดักฟังการเปลี่ยนสถานะ Auth (เช่น พอกดลิงก์รีเซ็ตรหัสผ่าน)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        navigate("/update-password")
      }
      setUser(session?.user || null)
    })

    return () => authListener.subscription.unsubscribe()
  }, [navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setRole(null)
    navigate("/login")
  }

  if (loading) return <h2 style={{ color: "white", textAlign: "center", marginTop: "50px" }}>Loading...</h2>

  return (
    <div className="app">
      <Routes>
        {/* 🔓 PUBLIC: หน้าที่เข้าได้เลยโดยไม่ต้อง Login */}
        <Route path="/login" element={<Login setUser={setUser} setRole={setRole} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />

        {/* 🔒 PRIVATE: หน้าที่ต้อง Login เท่านั้น */}
        {user ? (
          <>
            <Route
              path="/"
              element={
                role === "admin" ? (
                  <Admin />
                ) : (
                  <div>
                    {/* NAVBAR */}
                    <div className="navbar">
                      <div className="nav-left"><h1 className="logo">PinkShop</h1></div>
                      <div className="nav-right">
                        <input type="text" placeholder="Search..." className="search" value={search} onChange={(e)=>setSearch(e.target.value)} />
                        <button className="add-btn" onClick={()=>{ setShowCart(true); setShowOrders(false) }}>🛒 Cart ({cart.length})</button>
                        <button className="add-btn" onClick={()=>{ setShowOrders(true); setShowCart(false) }}>📦 Orders</button>
                        <button className="add-btn" onClick={()=>navigate("/profile")}>👤 Profile</button>
                        <button className="add-btn" onClick={handleLogout}>🚪 Logout</button>
                      </div>
                    </div>

                    {/* BANNER & CONTENT */}
                    <div className="banner"><h1>PinkShop Sale</h1><p>ช้อปคุ้ม ลดแรง ทุกสินค้า</p></div>
                    <div className="content">
                      {showOrders ? (
                        <Orders setShowOrders={setShowOrders} backToHome={() => setShowOrders(false)} />
                      ) : showCart ? (
                        <Cart cart={cart} setCart={setCart} setShowCart={setShowCart} />
                      ) : (
                        <Products cart={cart} setCart={setCart} setShowCart={setShowCart} search={search} />
                      )}
                    </div>
                  </div>
                )
              }
            />
            <Route path="/profile" element={<Profile user={user} backToHome={()=>navigate("/")} />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/owner-orders" element={<OwnerOrders backToHome={()=>navigate("/")} />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/edit-product/:id" element={<EditProduct />} />
            <Route path="/admin" element={role === "admin" ? <Admin /> : <Navigate to="/" />} />
            <Route path="/admin-orders" element={role === "admin" ? <AdminOrders /> : <Navigate to="/" />} />
            <Route path="/checkout" element={<Checkout cart={cart} user={user} />} />
          </>
        ) : (
          /* 🚫 ถ้าพยายามเข้าหน้า Private โดยไม่ Login ให้เด้งไปหน้า Login */
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </div>
  )
}

export default App