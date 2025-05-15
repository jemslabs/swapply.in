import Navbar from "./components/Navbar"
import { Route, Routes } from 'react-router-dom'
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import { Toaster } from "@/components/ui/sonner"
import FetchUser from "./components/FetchUser"
//@ts-ignore
import AddItem from "./pages/AddItem"
import Browse from "./pages/Browse"
import MyItems from "./pages/MyItems"

function App() {
  return (
    <>
      <Navbar />
      <div className="pt-20">
        <FetchUser />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/item/add" element={<AddItem />} />
          <Route path="/browse" element={<Browse />}/>
          <Route path="/my-items" element={<MyItems />} />
        </Routes>
      </div>
      <Toaster position="top-center" />
    </>
  )
}

export default App
