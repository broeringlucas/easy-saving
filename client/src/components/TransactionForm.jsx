import { useState, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import { CategoryService } from "../services/CategoryService";
import { TransactionService } from "../services/TransactionService";
import ErrorMessage from "./ErrorMessage";
import UseForm from "../hooks/UseForm";

const TransactionForm = ({ onTransactionAdded, user }) => {
  const initialFormState = {
    amount: 0,
    description: "",
    category: 0,
    user: user.user_id,
    type: 0,
  };

  const validators = {
    amount: (value) => {
      if (!value) return "Amount is required";
      if (value <= 0) return "Value must be greater than zero";
      return "";
    },
    description: (value) => {
      if (!value.trim()) return "Description is required";
      return "";
    },
    category: (value) => {
      if (!value || value === 0) return "Category is required";
      return "";
    },
  };

  const {
    formData: transaction,
    errors,
    formError,
    setFormError,
    handleChange,
    validateForm,
    setFormData,
  } = UseForm(initialFormState, validators);

  const [categories, setCategories] = useState([]);

  const loadCategories = async () => {
    try {
      const categories = await CategoryService.fetchAllCategoriesByUser(
        user.user_id
      );
      setCategories(categories);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
      setFormError("Erro ao carregar categorias. Tente novamente.");
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCategoryChange = (value) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!(await validateForm())) {
      setFormError("Please complete all required fields");
      return;
    }

    try {
      await TransactionService.createTransaction(transaction);
      setFormData(initialFormState);
      setFormError("");
      onTransactionAdded();
    } catch (error) {
      setFormError("Error creating transaction. Try again.");
    }
  };
  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto p-6 bg-white rounded-lg"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-1 text-center">
          New Transaction
        </h2>
        <div className="min-h-[50px] mb-1">
          <ErrorMessage message={formError} />
        </div>
        <div className="space-y-4">
          <div className="relative pb-1">
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Value:
            </label>
            <input
              type="number"
              name="amount"
              value={transaction.amount}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 border ${
                errors.amount ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              step="0.01"
              min="0"
            />
            {errors.amount && (
              <p className="absolute text-red-500 text-xs">{errors.amount}</p>
            )}
          </div>
          <div className="relative pb-1">
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Description:
            </label>
            <input
              type="text"
              name="description"
              value={transaction.description}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.description ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              maxLength={100}
              placeholder="Description"
            />
            {errors.description && (
              <p className="absolute text-red-500 text-xs">
                {errors.description}
              </p>
            )}
          </div>
          <div className="relative pb-1">
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Type:
            </label>
            <select
              name="type"
              value={transaction.type}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 border ${
                errors.type ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="0">Expense</option>
              <option value="1">Income</option>
            </select>
            {errors.type && (
              <p className="absolute text-red-500 text-xs">{errors.type}</p>
            )}
          </div>
          <div className="relative pb-1">
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Category:
            </label>
            {categories.length === 0 ? (
              <div className="w-full px-3 py-2 border border-red-300 bg-red-50 rounded-md text-center">
                <p className="text-red-600 text-sm">
                  No categories created yet.
                </p>
              </div>
            ) : (
              <Listbox
                value={transaction.category}
                onChange={handleCategoryChange}
              >
                <div className="relative">
                  <Listbox.Button
                    className={`w-full px-3 py-2 border ${
                      errors.category ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-left`}
                  >
                    {transaction.category ? (
                      <div className="flex items-center">
                        <span
                          className="inline-block w-3 h-3 rounded-full mr-2"
                          style={{
                            backgroundColor: categories.find(
                              (c) => c.category_id === transaction.category
                            )?.color,
                          }}
                        ></span>
                        {
                          categories.find(
                            (c) => c.category_id === transaction.category
                          )?.name
                        }
                      </div>
                    ) : (
                      "Select a category"
                    )}
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-20 w-full mt-1 bg-white shadow-lg max-h-60 rounded-md py-1 ring-1 ring-black ring-opacity-5 overflow-auto">
                    {categories.map((category) => (
                      <Listbox.Option
                        key={category.category_id}
                        value={category.category_id}
                        className={({ active }) =>
                          `cursor-default select-none relative py-2 pl-3 pr-4 ${
                            active
                              ? "bg-blue-100 text-blue-900"
                              : "text-gray-900"
                          }`
                        }
                      >
                        <div className="flex items-center">
                          <span
                            className="inline-block w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: category.color }}
                          ></span>
                          <span className="block truncate">
                            {category.name}
                          </span>
                        </div>
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            )}
            {errors.category && categories.length > 0 && (
              <p className="absolute text-red-500 text-xs">{errors.category}</p>
            )}
          </div>
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              disabled={categories.length === 0}
              className={`flex-1 ${
                categories.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-p-orange hover:bg-s-orange"
              } text-white font-medium py-2 px-4 rounded-md transition`}
            >
              Create
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
