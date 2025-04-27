import { useState, useEffect } from "react";
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Erro ao carregar categorias", error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setTransaction({ ...transaction, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(transaction);

    try {
      await api.post("/transactions", transaction);
      setTransaction({
        amount: 0,
        description: "",
        category: 0,
        user: 0,
        type: 0,
      });

      onTransactionAdded();
    } catch (error) {
      console.error(error);
      alert("Erro ao criar transação");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      <h2>Nova Transação</h2>
      <div className="form-group">
        <label>Valor:</label>
        <input
          type="number"
          name="amount"
          value={transaction.amount}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Descrição:</label>
        <input
          type="text"
          name="description"
          value={transaction.description}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Tipo:</label>
        <select
          name="type"
          value={transaction.type}
          onChange={handleChange}
          required
        >
          <option value="0">Despesa</option>
          <option value="1">Receita</option>
        </select>
      </div>
      <div className="form-group">
        <label>Categoria:</label>
        <select
          name="category"
          value={transaction.category}
          onChange={handleChange}
          required
        >
          <option value="">Selecione uma categoria</option>
          {categories.map((category) => (
            <option key={category.category_id} value={category.category_id}>
              <span
                style={{
                  display: "inline-block",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: category.color,
                  marginRight: "10px",
                }}
              ></span>
              {category.name} - {category.color}
            </option>
          ))}
        </select>
      </div>
      <button type="submit">Criar Transação</button>
    </form>
  );
};

export default TransactionForm;
