import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Explore from "./pages/Explore";
import BusinessDetails from "./pages/BusinessDetails";
import Analytics from "./pages/Analytics";
import MapView from "./pages/MapView";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/business/:id" element={<BusinessDetails />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/map" element={<MapView />} />
    </Routes>
  );
}

export default App;