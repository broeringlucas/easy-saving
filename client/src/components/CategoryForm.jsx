import { useState } from "react";
import api from "../api";

const CategoryForm = ({ onCategoryAdded }) => {
  const [category, setCategory] = useState({ name: "", color: "#000000" });

  const handleChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/categories", {
        name: category.name,
        color: category.color,
      });

      setCategory({ name: "", color: "#000000" });
      onCategoryAdded();
    } catch (error) {
      console.error(error);
      alert("Erro ao criar categoria");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Nova Categoria</h2>

      <label>
        Nome:
        <input
          type="text"
          name="name"
          value={category.name}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Cor:
        <input
          type="color"
          name="color"
          value={category.color}
          onChange={handleChange}
          required
        />
      </label>

      <button type="submit">Criar Categoria</button>
    </form>
  );
};

export default CategoryForm;
