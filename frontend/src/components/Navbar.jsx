import { useState } from "react"

function Navbar({ cart }) {

  const [search,setSearch] = useState("")

  return (

    <div className="navbar">

      <div className="logo">
        PinkShop
      </div>

      <input
        className="search"
        placeholder="ค้นหาสินค้า..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
      />

      <div className="nav-right">

        <button className="nav-btn">
          Cart ({cart.length})
        </button>

      </div>

    </div>

  )
}

export default Navbar