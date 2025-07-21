import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import FetchUser from "./components/FetchUser";
import MyItems from "./pages/MyItems";
import Item from "./pages/Item";
import ClientProtect from "./components/ClientProtect";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import AddNew from "./pages/AddNew";
import Browse from "./pages/Browse";
import SwapRequests from "./pages/SwapRequests";

function App() {
  const location = useLocation();
  const isHome  = location.pathname === "/";
  return (
    <>
      <Navbar />
      <div className={`${isHome ? "pt-0" : "pt-20"}`}>
        <FetchUser />
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/new" element={<ClientProtect><AddNew /></ClientProtect>}/>
          <Route
            path="/my-items"
            element={
              <ClientProtect>
                <MyItems />
              </ClientProtect>
            }
          />
          <Route path="/item/:id" element={<Item />} />

          <Route
            path="/notifications"
            element={
              <ClientProtect>
                <Notifications />
              </ClientProtect>
            }
          />
          <Route path="/profile/:id" element={<Profile />}/>
          <Route path="/browse" element={<Browse />}/>
          <Route path="/swap/requests" element={<SwapRequests />}/>
        </Routes>
      </div>
      <Toaster position="top-center" />
    </>
  );
}

export default App;
