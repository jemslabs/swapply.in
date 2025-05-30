import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
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
          <Route path="/circles/create" element={<CreateCircle />} />
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

        </Routes>
      </div>
      <Toaster position="top-center" />
    </>
  );
}

export default App;
