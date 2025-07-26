import { useEffect } from "react";
import ErrorMessage from "./ErrorMessage";
import { CategoryService } from "../services/CategoryService";
import UseForm from "../hooks/UseForm";

const CategoryForm = ({
  category = null,
  user,
  isEdit = false,
  onCategoryAdded,
  onCategoryUpdated,
  onClose,
}) => {
  const initialFormState = {
    name: "",
    color: "#3b82f6",
    user: user.user_id,
  };

  const validators = {
    name: async (value) => {
      if (!value.trim()) return "Name is required";

      try {
        const response = await CategoryService.fetchCategoryByName(
          user.user_id,
          value
        );
        const existing = response;

        if (!isEdit && existing.length > 0) {
          return "Category with this name already exists.";
        }
        if (
          isEdit &&
          existing.length > 0 &&
          existing.some((cat) => cat.category_id !== category.category_id)
        ) {
          return "Category with this name already exists.";
        }
      } catch (error) {
        console.error(error);
        return "Error checking category name availability";
      }

      return "";
    },
  };

  const {
    formData,
    setFormData,
    errors,
    formError,
    setFormError,
    handleChange,
    validateForm,
    isValidating,
  } = UseForm(initialFormState, validators);

  useEffect(() => {
    if (isEdit && category) {
      setFormData({
        name: category.name,
        color: category.color,
        user: category.user_id,
      });
    }
  }, [isEdit, category, setFormData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!(await validateForm())) {
      setFormError("Please complete all required fields");
      return;
    }

    try {
      if (isEdit) {
        const updatedCategory = await CategoryService.updateCategory(
          category.category_id,
          {
            name: formData.name,
            color: formData.color,
          }
        );

        if (onCategoryUpdated) onCategoryUpdated(updatedCategory);
      } else {
        const newCategory = await CategoryService.createCategory({
          name: formData.name,
          color: formData.color,
          user: formData.user,
        });

        setFormData(initialFormState);
        if (onCategoryAdded) onCategoryAdded(newCategory);
      }

      setFormError("");
      if (onClose) onClose();
    } catch (error) {
      console.error(error);
      setFormError(
        isEdit
          ? "Error updating category. Please try again."
          : "Error creating category. Please try again."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-lg space-y-4"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-1 text-center">
        {isEdit ? "Edit Category" : "New Category"}
      </h2>

      <div className="min-h-[50px] mb-1">
        <ErrorMessage message={formError} />
      </div>
      <div className="relative pb-1">
        <label className="block text-gray-700 text-sm font-bold mb-1">
          Name:
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
          placeholder="Ex: Food"
        />
        {errors.name && (
          <p className="absolute text-red-500 text-xs">{errors.name}</p>
        )}
      </div>
      <div className="space-y-3">
        <label className="block text-gray-700 text-sm font-bold mb-1">
          Color:
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
        disabled={isValidating}
        className={`w-full mt-4 text-white font-bold py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
          isEdit
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-p-orange hover:bg-s-orange"
        } ${isValidating ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isEdit ? "Save" : "Create"}
      </button>
    </form>
  );
};

export default CategoryForm;
