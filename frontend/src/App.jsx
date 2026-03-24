import { useEffect, useState } from "react"
import { supabase } from "./lib/supabase"
import { Routes, Route, useNavigate, Navigate } from "react-router-dom"

// นำเข้าหน้าต่างๆ
import Products from "./pages/Products"
import Cart from "./pages/Cart"
import Orders from "./components/Orders"
import ProductDetail from "./pages/ProductDetail"
import ForgotPassword from "./pages/ForgotPassword"
import UpdatePassword from "./pages/UpdatePassword"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Profile from "./pages/Profile"
import OwnerOrders from "./pages/OwnerOrders"
import AddProduct from "./pages/AddProduct"
import Admin from "./pages/Admin"
import Checkout from "./pages/Checkout"
import AdminOrders from "./pages/AdminOrders"
import EditProduct from "./pages/EditProduct"
import OwnerDashboard from "./pages/OwnerDashboard" // ✅ เพิ่มหน้านี้

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

        setRole(roleData?.role || "user")
      }
      setLoading(false)
    }
    initUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        navigate("/update-password")
      }
      
      const currentUser = session?.user || null
      setUser(currentUser)
      
      if (currentUser) {
        const { data: roleData } = await supabase
          .from("users")
          .select("role")
          .eq("email", currentUser.email)
          .single()
        setRole(roleData?.role || "user")
      } else {
        setRole(null)
      }
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
        {/* 🔓 PUBLIC */}
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />

        {/* 🔒 PRIVATE (Requires Login) */}
        {user ? (
          <>
            {/* หน้าแรกแยกตามสิทธิ์ */}
            <Route
              path="/"
              element={
                role === "owner" ? (
                  <OwnerDashboard /> // ✅ เจ้าของร้านเจอหน้าสรุปยอดขาย
                ) : role === "admin" ? (
                  <Admin /> // ✅ แอดมินเจอหน้าจัดการร้าน
                ) : (
                  <div>
                    {/* ส่วนของลูกค้าทั่วไป */}
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
                    <div className="banner"><h1>PinkShop Sale</h1><p>ช้อปคุ้ม ลดแรง ทุกสินค้า PINK10 </p></div>
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

            {/* ✅ OWNER ONLY ROUTES */}
            <Route 
              path="/owner-dashboard" 
              element={role === "owner" ? <OwnerDashboard /> : <Navigate to="/" />} 
            />

            {/* ✅ ADMIN ONLY ROUTES */}
            <Route path="/admin" element={role === "admin" || role === "owner" ? <Admin /> : <Navigate to="/" />} />
            <Route path="/admin-orders" element={role === "admin" || role === "owner" ? <AdminOrders /> : <Navigate to="/" />} />
            <Route path="/add-product" element={role === "admin" || role === "owner" ? <AddProduct /> : <Navigate to="/" />} />
            <Route path="/edit-product/:id" element={role === "admin" || role === "owner" ? <EditProduct /> : <Navigate to="/" />} />

            {/* ✅ CUSTOMER & SHARED ROUTES */}
            <Route path="/profile" element={<Profile user={user} backToHome={()=>navigate("/")} />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout cart={cart} user={user} />} />
            <Route path="/owner-orders" element={<OwnerOrders backToHome={()=>navigate("/")} />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </div>
  )
}

export default App