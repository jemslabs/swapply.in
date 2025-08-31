import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import FetchUser from "./components/FetchUser";
import MyListings from "./pages/MyListings";
import ClientProtect from "./components/ClientProtect";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import AddNew from "./pages/AddNew";
import Browse from "./pages/Browse";
import SwapRequests from "./pages/SwapRequests";
import SwapPage from "./pages/SwapPage";
import ItemPage from "./pages/ItemPage";
import SkillPage from "./pages/SkillPage";

function App() {
  const location = useLocation();
  const isHome  = location.pathname === "/";
  return (
    <div>
      <Navbar />
      <div className={`${isHome ? "pt-0" : "pt-20"}`}>
        <FetchUser />
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/new" element={<ClientProtect><AddNew /></ClientProtect>}/>
          <Route
            path="/my-listings"
            element={
              <ClientProtect>
                <MyListings />
              </ClientProtect>
            }
          />
          <Route path="/item/:id" element={<ItemPage />} />
          <Route path="/skill/:id" element={<SkillPage />}/>  
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
          <Route path="/swap/requests" element={<ClientProtect><SwapRequests /></ClientProtect>}/>
          <Route path="/swap/:id" element={<ClientProtect><SwapPage /></ClientProtect>}/>
        </Routes>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
