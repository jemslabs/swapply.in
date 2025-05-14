
import Navbar from "./components/Navbar"
import { Route, Routes } from 'react-router-dom'
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import { Toaster } from "@/components/ui/sonner"
import FetchUser from "./components/FetchUser"
import AddItem from "./pages/AddItem"

function App() {

  return (
    <>
      <Navbar />
      <FetchUser />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/item/add" element={<AddItem />}/>
      </Routes>
      <Toaster position="top-center" />
    </>
  )
}

export default App
