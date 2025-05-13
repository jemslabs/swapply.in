import { Toaster } from "sonner"
import Navbar from "./components/Navbar"
import {Route, Routes} from 'react-router-dom'
import Login from "./pages/Login"
import Signup from "./pages/Signup"

function App() {


  return (
    <>
      <Navbar />
      <Routes>
        <Route  path="/login" element={<Login />}/>
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <Toaster position="top-center"/>
    </>
  )
}

export default App
