import { useState, useEffect } from "react";
import ErrorMessage from "./ErrorMessage";

import { CategoryService } from "../services/CategoryService";

const CategoryForm = ({
  category = null,
  user,
  isEdit = false,
  onCategoryAdded,
  onCategoryUpdated,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    color: "#3b82f6",
    user: user.user_id,
  });
  const [errors, setErrors] = useState({ name: "" });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (isEdit && category) {
      setFormData({
        name: category.name,
        color: category.color,
        user: category.user_id,
      });
    }
  }, [isEdit, category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (formError) setFormError("");
  };

  const validateForm = () => {
    const newErrors = { name: "" };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "O nome da categoria é obrigatório";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setFormError("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const response = await CategoryService.fetchCategoryByName(
        user.user_id,
        formData.name
      );
      const existing = response;

      if (!isEdit && existing.length > 0) {
        setErrors((prev) => ({
          ...prev,
          name: "Já existe uma categoria com este nome.",
        }));
        return;
      }
      if (
        isEdit &&
        existing.length > 0 &&
        existing.some((cat) => cat.category_id !== category.category_id)
      ) {
        setErrors((prev) => ({
          ...prev,
          name: "Já existe uma categoria com este nome.",
        }));
        return;
      }

      if (isEdit) {
        const updatedCategory = await CategoryService.updateCategory(
          category.category_id,
          {
            name: formData.name,
            color: formData.color,
          }
        );

        if (onCategoryUpdated) {
          onCategoryUpdated(updatedCategory);
        }
      } else {
        const newCategory = await CategoryService.createCategory({
          name: formData.name,
          color: formData.color,
          user: formData.user,
        });

        setFormData({ name: "", color: "#3b82f6", user: user.user_id });
        if (onCategoryAdded) onCategoryAdded(newCategory);
      }

      setErrors({ name: "" });
      setFormError("");
      if (onClose) onClose();
    } catch (error) {
      console.error(error);
      setFormError(
        isEdit
          ? "Erro ao atualizar categoria. Tente novamente."
          : "Erro ao criar categoria. Tente novamente."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-lg space-y-4"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-1 text-center">
        {isEdit ? "Editar Categoria" : "Nova Categoria"}
      </h2>

      <div className="min-h-[50px] mb-1">
        <ErrorMessage message={formError} />
      </div>
      <div className="relative pb-1">
        <label className="block text-gray-700 text-sm font-bold mb-1">
          Nome:
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${
            errors.name ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          maxLength={50}
          placeholder="Ex: Alimentação"
        />
        {errors.name && (
          <p className="absolute text-red-500 text-xs">{errors.name}</p>
        )}
      </div>
      <div className="space-y-3">
        <label className="block text-gray-700 text-sm font-bold mb-1">
          Cor:
        </label>
        <div className="flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-md border border-gray-300 shadow-sm"
            style={{ backgroundColor: formData.color }}
          />
          <div className="relative flex-1">
            <input
              type="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              required
            />
            <div className="px-3 py-2 border border-gray-300 rounded-md bg-white flex items-center justify-between hover:border-gray-400">
              <span className="text-sm font-mono">
                {formData.color.toUpperCase()}
              </span>
              <svg
                className="h-4 w-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <button
        type="submit"
        className={`w-full mt-4 text-white font-bold py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
          isEdit
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-p-green hover:bg-s-green"
        }`}
      >
        {isEdit ? "Salvar Alterações" : "Criar Categoria"}
      </button>
    </form>
  );
};

export default CategoryForm;
