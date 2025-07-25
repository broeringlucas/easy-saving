import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { UserService } from "../services/UserService";
import ErrorMessage from "./ErrorMessage";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    birthday: "",
    phone: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    birthday: "",
    phone: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [formError, setFormError] = useState("");

  const validateAndFormatDate = (value) => {
    const cleaned = value.replace(/\D/g, "");

    if (cleaned.length > 4) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(
        4,
        8
      )}`;
    } else if (cleaned.length > 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    return cleaned;
  };

  const formatPhone = (value) => {
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);

    if (!match) return value;

    let formatted = "";
    if (match[1]) formatted = `(${match[1]}`;
    if (match[2]) formatted += `) ${match[2]}`;
    if (match[3]) formatted += `-${match[3]}`;

    return formatted;
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      birthday: "",
      phone: "",
      email: "",
      password: "",
    };

    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "O nome completo é obrigatório";
      isValid = false;
    } else {
      const nameParts = formData.name.trim().split(" ");
      if (nameParts.length < 2) {
        newErrors.name = "Por favor, informe seu nome completo";
        isValid = false;
      }
    }

    if (!formData.birthday.trim()) {
      newErrors.birthday = "A data de nascimento é obrigatória";
      isValid = false;
    } else {
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(formData.birthday)) {
        newErrors.birthday = "Formato inválido (dd/mm/yyyy)";
        isValid = false;
      } else {
        const [day, month, year] = formData.birthday.split("/").map(Number);
        const birthDate = new Date(year, month - 1, day);
        const currentDate = new Date();

        if (
          birthDate.getDate() !== day ||
          birthDate.getMonth() !== month - 1 ||
          birthDate.getFullYear() !== year
        ) {
          newErrors.birthday = "Data inválida";
          isValid = false;
        } else {
          if (birthDate > currentDate) {
            newErrors.birthday = "A data de nascimento não pode ser futura";
            isValid = false;
          } else {
            let age = currentDate.getFullYear() - birthDate.getFullYear();
            const monthDiff = currentDate.getMonth() - birthDate.getMonth();

            if (
              monthDiff < 0 ||
              (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())
            ) {
              age--;
            }

            if (age < 13) {
              newErrors.birthday = "Você deve ter pelo menos 13 anos";
              isValid = false;
            } else if (age > 115) {
              newErrors.birthday = "Idade inválida (máximo 115 anos)";
              isValid = false;
            }
          }
        }
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "O telefone é obrigatório";
      isValid = false;
    } else {
      const phoneDigits = formData.phone.replace(/\D/g, "");
      if (phoneDigits.length < 10 || phoneDigits.length > 11) {
        newErrors.phone = "Telefone inválido (formato: (99) 99999-9999)";
        isValid = false;
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = "O email é obrigatório";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = "A senha é obrigatória";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "A senha deve ter pelo menos 8 caracteres";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === "birthday") {
      if (value.replace(/\D/g, "").length > 8) return;
      processedValue = validateAndFormatDate(value);
    } else if (name === "phone") {
      const cleaned = value.replace(/\D/g, "").slice(0, 11);
      processedValue = formatPhone(cleaned);
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (formError) setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setFormError("Preencha todos os campos corretamente.");
      return;
    }

    try {
      const [day, month, year] = formData.birthday.split("/");
      const isoDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0"
      )}`;

      await UserService.register(
        formData.name,
        isoDate,
        formData.phone,
        formData.email,
        formData.password
      );

      navigate("/login");
      setFormError(
        "Cadastro realizado com sucesso! Faça login para continuar."
      );
    } catch (error) {
      console.error(error.response?.message || "Erro no cadastro");
      setFormError(
        error.response?.data?.message ||
          "Erro ao realizar cadastro. Tente novamente."
      );
    }
  };

  return (
    <div className="w-full md:w-1/2 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg p-6 space-y-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Criar Conta
        </h2>

        <div className="min-h-[50px]">
          <ErrorMessage message={formError} />
        </div>
        <div className="relative pb-1">
          <label className="block text-gray-700 text-base font-bold mb-2">
            Nome Completo:
          </label>
          <input
            type="text"
            name="name"
            placeholder="Nome Completo"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 text-lg border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.name && (
            <p className="absolute text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>
        <div className="relative pb-1">
          <label className="block text-gray-700 text-base font-bold mb-2">
            Data de Nascimento:
          </label>
          <input
            type="text"
            name="birthday"
            placeholder="dd/mm/aaaa"
            value={formData.birthday}
            onChange={handleInputChange}
            maxLength={10}
            className={`w-full px-4 py-3 text-lg border ${
              errors.birthday ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.birthday && (
            <p className="absolute text-red-500 text-xs mt-1">
              {errors.birthday}
            </p>
          )}
        </div>
        <div className="relative pb-1">
          <label className="block text-gray-700 text-base font-bold mb-2">
            Telefone:
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="(99) 99999-9999"
            value={formData.phone}
            onChange={handleInputChange}
            maxLength={15}
            className={`w-full px-4 py-3 text-lg border ${
              errors.phone ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.phone && (
            <p className="absolute text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>
        <div className="relative pb-1">
          <label className="block text-gray-700 text-base font-bold mb-2">
            Email:
          </label>
          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 text-lg border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.email && (
            <p className="absolute text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>
        <div className="relative pb-1">
          <label className="block text-gray-700 text-base font-bold mb-2">
            Senha:
          </label>
          <input
            type="password"
            name="password"
            placeholder="Senha (mínimo 8 caracteres)"
            value={formData.password}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 text-lg border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.password && (
            <p className="absolute text-red-500 text-xs mt-1">
              {errors.password}
            </p>
          )}
        </div>
        <div className="pt-1">
          <button
            type="submit"
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Criar Conta
          </button>
        </div>
        <div className="text-center pt-1">
          <p className="text-gray-600 text-sm">
            Já tem conta?{" "}
            <Link
              to="/login"
              className="text-green-600 hover:text-green-800 font-bold"
            >
              Faça login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
