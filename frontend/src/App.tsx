import { Routes, Route } from "react-router-dom";
import Home from "./features/home/Home";
import Auth from "@shared/components/auth/Auth";
import { useAuth } from "@shared/context/AuthProvider";

function App() {
  const { authenticated } = useAuth();

  if (!authenticated) {
    return <Auth />;
  }

  return (
    <Routes>
      <Route path="/auth/*" element={<Auth />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
