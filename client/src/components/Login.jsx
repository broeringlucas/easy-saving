import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { UserService } from "../services/UserService";
import ErrorMessage from "./ErrorMessage";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    if (!email.trim()) {
      newErrors.email = "O email é obrigatório";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email inválido";
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = "A senha é obrigatória";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setFormError("Preencha todos os campos corretamente.");
      return;
    }

    try {
      await UserService.login(email, password);
      navigate("/home");
    } catch (error) {
      console.error("Authentication failed:", error);
      setFormError(error.response?.data?.message || "Erro na autenticação");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);

    setErrors((prev) => ({ ...prev, [name]: "" }));
    if (formError) setFormError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full p-6 bg-white rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-1 text-center">
          Login
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
              onChange={handleInputChange}
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
              Senha:
            </label>
            <input
              type="password"
              name="password"
              placeholder="Senha"
              value={password}
              onChange={handleInputChange}
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
              className="w-full mt-2 bg-p-green hover:bg-s-green text-white font-bold py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Login
            </button>
          </div>
          <div className="text-center pt-1">
            <p className="text-gray-600 text-sm">
              Não tem uma conta?{" "}
              <Link
                to="/register"
                className="text-p-green hover:text-s-green font-bold"
              >
                Registre-se
              </Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
