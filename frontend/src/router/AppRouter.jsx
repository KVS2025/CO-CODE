import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoleSelect from "../pages/RoleSelect";
import Login from "../pages/Login";
import HRDashboard from "../pages/HRDashboard";
import CandidateDashboard from "../pages/CandidateDashboard.jsx";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleSelect />} />
        <Route path="/login/:role" element={<Login />} />
        <Route path="/hr" element={<HRDashboard />} />
        <Route path="/candidate" element={<CandidateDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
