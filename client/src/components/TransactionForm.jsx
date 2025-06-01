import { useState, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import { CategoryService } from "../services/CategoryService";
import api from "../api";

const TransactionForm = ({ onTransactionAdded, user }) => {
  const [transaction, setTransaction] = useState({
    amount: 0,
    description: "",
    category: 0,
    user: user.user_id,
    type: 0,
  });
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({
    amount: "",
    description: "",
    category: "",
    type: "",
  });
  const [formError, setFormError] = useState("");

  const loadCategories = async () => {
    try {
      const data = await CategoryService.fetchAll(user.user_id);
      setCategories(data);
    } catch (error) {
      setFormError("Erro ao carregar categorias");
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransaction((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (formError) setFormError("");
  };

  const handleCategoryChange = (value) => {
    setTransaction((prev) => ({ ...prev, category: value }));
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      amount: "",
      description: "",
      category: "",
      type: "",
    };
    let isValid = true;

    if (transaction.amount <= 0) {
      newErrors.amount = "O valor deve ser maior que zero";
      isValid = false;
    }

    if (!transaction.description.trim()) {
      newErrors.description = "A descrição é obrigatória";
      isValid = false;
    }

    if (transaction.category === 0) {
      newErrors.category = "Selecione uma categoria";
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
      await api.post("/transactions", transaction);
      setTransaction({
        amount: 0,
        description: "",
        category: 0,
        type: 0,
        user: user.user_id,
      });
      setErrors({
        amount: "",
        description: "",
        category: "",
        type: "",
      });
      setFormError("");
      onTransactionAdded();
    } catch (error) {
      console.error(error);
      setFormError("Erro ao criar transação. Tente novamente.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-lg space-y-4"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
        Nova Transação
      </h2>

      {formError && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">
          {formError}
        </div>
      )}

      <div>
        <label className="block text-gray-700 text-sm font-bold mb-1">
          Valor:
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
          <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
        )}
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-bold mb-1">
          Descrição:
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
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description}</p>
        )}
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-bold mb-1">
          Tipo:
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
          <option value="0">Despesa</option>
          <option value="1">Receita</option>
        </select>
        {errors.type && (
          <p className="text-red-500 text-xs mt-1">{errors.type}</p>
        )}
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-bold mb-1">
          Categoria:
        </label>
        <Listbox value={transaction.category} onChange={handleCategoryChange}>
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
                "Selecione uma categoria"
              )}
            </Listbox.Button>
            <Listbox.Options className="absolute z-10 w-full mt-1 bg-white shadow-lg max-h-60 rounded-md py-1 ring-1 ring-black ring-opacity-5 overflow-auto">
              {categories.map((category) => (
                <Listbox.Option
                  key={category.category_id}
                  value={category.category_id}
                  className={({ active }) =>
                    `cursor-default select-none relative py-2 pl-3 pr-4 ${
                      active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                    }`
                  }
                >
                  <div className="flex items-center">
                    <span
                      className="inline-block w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: category.color }}
                    ></span>
                    <span className="block truncate">{category.name}</span>
                  </div>
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
        {errors.category && (
          <p className="text-red-500 text-xs mt-1">{errors.category}</p>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="flex-1 bg-[#2ecc71] hover:bg-[#27ae60] text-white font-medium py-2 px-4 rounded-md transition"
        >
          Criar
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
