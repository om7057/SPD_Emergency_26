import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/sign-in" element={<Login />} />
      <Route path="/sign-up" element={<Login />} />

      <Route path="/" element={<Home />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
