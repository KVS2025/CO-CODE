import { useNavigate } from "react-router-dom";
import { Users, Briefcase } from "lucide-react";

const RoleSelect = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center">Login As</h1>

        <button
          onClick={() => navigate("/login/hr")}
          className="w-full flex items-center justify-center gap-2 p-4 bg-slate-900 text-white rounded-lg"
        >
          <Users /> HR
        </button>

        <button
          onClick={() => navigate("/login/candidate")}
          className="w-full flex items-center justify-center gap-2 p-4 border border-slate-300 rounded-lg"
        >
          <Briefcase /> Candidate
        </button>
      </div>
    </div>
  );
};

export default RoleSelect;
