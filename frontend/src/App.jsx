import { useEffect, useState } from "react"
import { supabase } from "./lib/supabase"

import Products from "./pages/Products"
import Cart from "./pages/Cart"
import Orders from "./components/Orders"
import ProductDetail from "./pages/ProductDetail"
import ForgotPassword from "./pages/ForgotPassword"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Profile from "./pages/Profile"

import { Routes, Route, useNavigate } from "react-router-dom"
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

  // 🔥 เช็ค session และ role
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

        // navigate ตาม role
        if (userRole === "admin") {
          navigate("/admin")
        } else {
          navigate("/") // user ทั่วไปไปหน้า / ของ user
        }
      }

      setLoading(false)
    }

    initUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setRole(null)
    navigate("/login")
  }

  if (loading) {
    return <h2 style={{ color: "white" }}>Loading...</h2>
  }

  return (
    <div className="app">
      <Routes>

        {/* 🔓 PUBLIC */}
        {!user && (
          <>
            <Route path="/login" element={<Login setUser={setUser} setRole={setRole} />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Login setUser={setUser} setRole={setRole} />} />
          </>
        )}

        {/* 🔒 PRIVATE */}
        {user && (
          <>
            <Route
              path="/"
              element={
                role === "admin"
                  ? <Admin />
                  : (
                    <div>
                      {/* 🔥 NAVBAR */}
                      <div className="navbar">
                        <div className="nav-left">
                          <h1 className="logo">PinkShop</h1>
                        </div>
                        <div className="nav-right">
                          <input
                            type="text"
                            placeholder="Search products..."
                            className="search"
                            value={search}
                            onChange={(e)=>setSearch(e.target.value)}
                          />
                          <button
                            className="add-btn"
                            onClick={()=>{ setShowCart(true); setShowOrders(false) }}
                          >
                            🛒 Cart ({cart.length})
                          </button>
                          <button
                            className="add-btn"
                            onClick={()=>{ setShowOrders(true); setShowCart(false) }}
                          >
                            📦 Orders
                          </button>
                          <button
                            className="add-btn"
                            onClick={()=>navigate("/profile")}
                          >
                            👤 Profile
                          </button>
                          <button
                            className="add-btn"
                            onClick={handleLogout}
                          >
                            🚪 Logout
                          </button>
                        </div>
                      </div>

                      {/* 🔥 BANNER */}
                      <div className="banner">
                        <h1>PinkShop Sale</h1>
                        <p>ช้อปคุ้ม ลดแรง ทุกสินค้า</p>
                      </div>
                      <div className="coupon-banner">
  <h2>🎉 ใช้โค้ดส่วนลด PINK10 ลด 10% สำหรับทุกสินค้า!</h2>
  <p>ใช้ได้เฉพาะวันนี้เท่านั้น</p>
</div>

                      {/* 🔥 CONTENT */}
                      <div className="content">
                        {showOrders ? (
                          <Orders setShowOrders={setShowOrders} backToHome={() => setShowOrders(false)} />
                        ) : showCart ? (
                          <Cart
                            cart={cart}
                            setCart={setCart}
                            setShowCart={setShowCart}
                          />
                        ) : (
                          <Products
                            cart={cart}
                            setCart={setCart}
                            setShowCart={setShowCart}
                            search={search}
                          />
                        )}
                      </div>
                    </div>
                  )
              }
            />

            <Route path="/profile" element={<Profile user={user} backToHome={()=>navigate("/")} />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/owner-orders" element={<OwnerOrders backToHome={()=>navigate("/")} />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/edit-product/:id" element={<EditProduct />} />
            <Route
              path="/admin"
              element={
                role === "admin"
                  ? <Admin />
                  : <h2 style={{color:"white"}}>Access Denied ❌</h2>
              }
            />
            <Route path="/admin-orders" element={<AdminOrders />} />
            <Route
              path="/checkout"
              element={<Checkout cart={cart} user={user} />}
            />
          </>
        )}

      </Routes>
      
    </div>
  )
}

export default App