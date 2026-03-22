import { useState } from "react"
import Register from "./Register"
import Login from "./Login"

function Auth(){

  const [mode,setMode] = useState("login")

  return(

    <div className="auth-box">

      <div className="auth-card">

        <div className="auth-tabs">

          <button
          className={mode==="login" ? "active" : ""}
          onClick={()=>setMode("login")}
          >
          Login
          </button>

          <button
          className={mode==="register" ? "active" : ""}
          onClick={()=>setMode("register")}
          >
          Register
          </button>

        </div>

        {mode==="login" ? <Login/> : <Register/>}

      </div>

    </div>

  )
}

export default Auth