import { useParams, useNavigate } from "react-router-dom";

const Login = () => {
  const { role } = useParams();
  const navigate = useNavigate();

  const handleLogin = () => {
    // ❗ Fake auth for now
    if (role === "hr") navigate("/hr");
    else navigate("/candidate");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold capitalize">{role} Login</h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 border rounded-lg"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-lg"
        />

        <button
          onClick={handleLogin}
          className="w-full p-3 bg-slate-900 text-white rounded-lg"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
