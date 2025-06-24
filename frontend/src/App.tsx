import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import FetchUser from "./components/FetchUser";
//@ts-ignore
import AddItem from "./pages/AddItem";
import MyItems from "./pages/MyItems";
import Item from "./pages/Item";
import ItemSwap from "./pages/ItemSwap";
import MySwaps from "./pages/MySwaps";
import CreateCircle from "./pages/CreateCircle";
import Circles from "./pages/Circles";
import CirclePage from "./pages/CirclePage";
import SwapPage from "./pages/SwapPage";
import ClientProtect from "./components/ClientProtect";
import Notifications from "./pages/Notifications";
import BrowseItems from "./pages/BrowseItems";
import BrowseCircles from "./pages/BrowseCircles";
import Profile from "./pages/Profile";
import Pricing from "./pages/Pricing";
import Home from "./pages/Home";

function App() {
  const location = useLocation();
  const isHome  = location.pathname === "/";
  return (
    <>
      <Navbar />
      <div className={`${isHome ? "" : "pt-20"}`}>
        <FetchUser />
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/item/add" element={<AddItem />} />
          <Route path="/browse/items" element={<BrowseItems />} />
          <Route path="/browse/circles" element={<BrowseCircles />} />
          
          <Route
            path="/my-items"
            element={
              <ClientProtect>
                <MyItems />
              </ClientProtect>
            }
          />
          <Route
            path="/my-swaps"
            element={
              <ClientProtect>
                <MySwaps />
              </ClientProtect>
            }
          />
          <Route path="/item/:id" element={<Item />} />
          <Route
            path="/item/:id/swap"
            element={
              <ClientProtect>
                <ItemSwap />
              </ClientProtect>
            }
          />
          <Route
            path="/circles"
            element={
              <ClientProtect>
                <Circles />
              </ClientProtect>
            }
          />
          <Route path="/circles/create" element={<ClientProtect><CreateCircle /></ClientProtect>} />
          <Route path="/circles/:id" element={<CirclePage />} />
          <Route
            path="/swap/:id"
            element={
              <ClientProtect>
                <SwapPage />
              </ClientProtect>
            }
          />

          <Route
            path="/notifications"
            element={
              <ClientProtect>
                <Notifications />
              </ClientProtect>
            }
          />
          <Route path="/profile/:id" element={<Profile />}/>
          <Route path="/pricing" element={<Pricing />}/>
        </Routes>
      </div>
      <Toaster position="top-center" />
    </>
  );
}

export default App;
