import { useNavigate, Link } from "react-router-dom";
import { UserService } from "../services/UserService";
import ErrorMessage from "./ErrorMessage";
import UseForm from "../hooks/UseForm";

const Register = () => {
  const initialFormState = {
    name: "",
    birthday: "",
    phone: "",
    email: "",
    password: "",
  };

  const formatters = {
    birthday: (value) => {
      const cleaned = value.replace(/\D/g, "");
      if (cleaned.length > 8) return value.substring(0, 10);

      if (cleaned.length > 4) {
        return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(
          4,
          8
        )}`;
      } else if (cleaned.length > 2) {
        return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
      }
      return cleaned;
    },
    phone: (value) => {
      const cleaned = value.replace(/\D/g, "");
      const match = cleaned.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
      if (!match) return value;

      let formatted = "";
      if (match[1]) formatted = `(${match[1]}`;
      if (match[2]) formatted += `) ${match[2]}`;
      if (match[3]) formatted += `-${match[3]}`;

      return formatted;
    },
  };

  const validators = {
    name: (value) => {
      if (!value.trim()) return "Full name is required";
      const nameParts = value.trim().split(" ");
      if (nameParts.length < 2) return "Please enter your full name";
      return "";
    },
    birthday: (value) => {
      if (!value.trim()) return "Birth date is required";
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value))
        return "Invalid format (dd/mm/yyyy)";

      const [day, month, year] = value.split("/").map(Number);
      const birthDate = new Date(year, month - 1, day);
      const currentDate = new Date();

      if (
        birthDate.getDate() !== day ||
        birthDate.getMonth() !== month - 1 ||
        birthDate.getFullYear() !== year
      )
        return "Invalid date";

      if (birthDate > currentDate) return "Birth date cannot be in the future";

      let age = currentDate.getFullYear() - birthDate.getFullYear();
      const monthDiff = currentDate.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())
      )
        age--;

      if (age < 13) return "You must be at least 13 years old";
      if (age > 115) return "Invalid age (maximum 115 years)";

      return "";
    },
    phone: (value) => {
      if (!value.trim()) return "Phone number is required";
      const phoneDigits = value.replace(/\D/g, "");
      if (phoneDigits.length < 10 || phoneDigits.length > 11) {
        return "Invalid phone (format: (99) 99999-9999)";
      }
      return "";
    },
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
    formData,
    errors,
    formError,
    setFormError,
    handleChange,
    validateForm,
    setErrors,
  } = UseForm(initialFormState, validators, formatters);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!(await validateForm())) {
      setFormError("Please complete all required fields correctly");
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
      setFormError("Registration successful! Please login to continue.");
    } catch (error) {
      console.error("Registration failed:", error);

      if (error.response?.data?.code === "EMAIL_ALREADY_EXISTS") {
        setErrors((prev) => ({
          ...prev,
          email: "Please use a different email.",
        }));
      }
      setFormError(
        error.response?.data?.message ||
          "Registration failed. Please try again later."
      );
    }
  };

  return (
    <div className="w-full md:w-1/2 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg p-6 space-y-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Create Account
        </h2>

        <div className="min-h-[50px]">
          <ErrorMessage message={formError} />
        </div>
        <div className="relative pb-1">
          <label className="block text-gray-700 text-base font-bold mb-2">
            Full Name:
          </label>
          <input
            type="text"
            name="name"
            placeholder="First and Last Name"
            value={formData.name}
            onChange={handleChange}
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
            Birth Date:
          </label>
          <input
            type="text"
            name="birthday"
            placeholder="dd/mm/yyyy"
            value={formData.birthday}
            onChange={handleChange}
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
            Phone:
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="(99) 99999-9999"
            value={formData.phone}
            onChange={handleChange}
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
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={handleChange}
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
            Password:
          </label>
          <input
            type="password"
            name="password"
            placeholder="Password (min 8 characters)"
            value={formData.password}
            onChange={handleChange}
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
            className="w-full mt-4 bg-p-orange hover:bg-s-orange text-white font-bold py-3 px-4 rounded-lg text-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Register
          </button>
        </div>
        <div className="text-center pt-1">
          <p className="text-text-color text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-p-orange hover:text-s-orange font-bold"
            >
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
