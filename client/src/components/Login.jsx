import { useNavigate, Link } from "react-router-dom";
import { UserService } from "../services/UserService";
import ErrorMessage from "./ErrorMessage";
import UseForm from "../hooks/UseForm";

const Login = () => {
  const initialFormState = { email: "", password: "" };

  const validators = {
    email: (value) => {
      if (!value.trim()) return "Email is required";
      if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email format";
      return "";
    },
    password: (value) => {
      if (!value.trim()) return "Password is required";
      if (value.length < 8) return "Password must be at least 8 characters";
      return "";
    },
  };

  const {
    formData: { email, password },
    errors,
    formError,
    setFormError,
    handleChange,
    validateForm,
    setErrors,
  } = UseForm(initialFormState, validators);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!(await validateForm())) {
      setFormError("Please fill all required fields correctly");
      return;
    }

    try {
      await UserService.login(email, password);
      navigate("/home");
    } catch (error) {
      console.error("Authentication failed:", error);
      if (error.response?.data?.code === "INVALID_CREDENTIALS") {
        setErrors({
          email: " ",
          password: " ",
        });
        setFormError(error.response?.data?.message || "Authentication failed");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  p-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full p-6 bg-white rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-1 text-center">
          Welcome Back
        </h2>
        <div className="min-h-[50px] mb-1">
          <ErrorMessage message={formError} />
        </div>
        <div className="space-y-4">
          <div className="relative pb-1">
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Email:
            </label>
            <input
              name="email"
              placeholder="Email"
              value={email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.email && (
              <p className="absolute text-red-500 text-xs">{errors.email}</p>
            )}
          </div>
          <div className="relative pb-1">
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Password:
            </label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.password && (
              <p className="absolute text-red-500 text-xs">{errors.password}</p>
            )}
          </div>
          <div className="pt-1">
            <button
              type="submit"
              className="w-full mt-2 bg-p-orange hover:bg-s-green text-white font-bold py-2 px-4 rounded-md transition duration-200 hover:bg-s-orange"
            >
              Login
            </button>
          </div>
          <div className="text-center pt-1">
            <p className="text-text-color text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-p-orange hover:text-s-orange font-bold"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
