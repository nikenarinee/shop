import { useEffect, useState } from "react"
import { supabase } from "./lib/supabase"
import { Routes, Route, useNavigate, Navigate } from "react-router-dom"

// pages
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
import OwnerDashboard from "./pages/OwnerDashboard"

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
      try {
        setLoading(true)

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
        } else {
          setRole(null)
        }
      } catch (err) {
        console.error(err)
        setUser(null)
        setRole(null)
      } finally {
        setLoading(false)
      }
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
    return (
      <h2 style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
        Loading...
      </h2>
    )
  }

  return (
    <div className="app">
      <Routes>

        {/* PUBLIC */}
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />

        {/* PRIVATE */}
        {user ? (
          <>
            {/* HOME */}
            <Route
              path="/"
              element={
                role === "owner" ? (
                  <Navigate to="/owner-dashboard" />
                ) : role === "admin" ? (
                  <Navigate to="/admin" />
                ) : (
                  <div>

                    {/* NAVBAR */}
                    <div className="navbar">
                      <div className="nav-left">
                        <h1 className="logo">PinkShop</h1>
                      </div>

                      <div className="nav-right">
                        <input
                          type="text"
                          placeholder="Search..."
                          className="search"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />

                        <button onClick={() => {
                          setShowCart(true)
                          setShowOrders(false)
                        }}>
                          🛒 Cart ({cart.length})
                        </button>

                        <button onClick={() => {
                          setShowOrders(true)
                          setShowCart(false)
                        }}>
                          📦 Orders
                        </button>

                        <button onClick={() => navigate("/profile")}>
                          👤 Profile
                        </button>

                        <button onClick={handleLogout}>
                          🚪 Logout
                        </button>
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="content">
                      {showOrders ? (
                        <Orders setShowOrders={setShowOrders} />
                      ) : showCart ? (
                        <Cart cart={cart} setCart={setCart} />
                      ) : (
                        <Products
                          cart={cart}
                          setCart={setCart}
                          search={search}
                        />
                      )}
                    </div>

                  </div>
                )
              }
            />

            {/* OWNER */}
            <Route
              path="/owner-dashboard"
              element={
                role === "owner"
                  ? <OwnerDashboard />
                  : <Navigate to="/" />
              }
            />

            {/* ADMIN */}
            <Route
              path="/admin"
              element={
                role === "admin" || role === "owner"
                  ? <Admin />
                  : <Navigate to="/" />
              }
            />

            <Route
              path="/admin-orders"
              element={
                role === "admin" || role === "owner"
                  ? <AdminOrders />
                  : <Navigate to="/" />
              }
            />

            <Route
              path="/add-product"
              element={
                role === "admin" || role === "owner"
                  ? <AddProduct />
                  : <Navigate to="/" />
              }
            />

            <Route
              path="/edit-product/:id"
              element={
                role === "admin" || role === "owner"
                  ? <EditProduct />
                  : <Navigate to="/" />
              }
            />

            {/* SHARED */}
            <Route path="/profile" element={<Profile user={user} />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout cart={cart} user={user} />} />
            <Route path="/owner-orders" element={<OwnerOrders />} />

          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}

      </Routes>
    </div>
  )
}

export default App