import { useState, useEffect } from "react";
import api from "../api";
import { CategoryService } from "../services/CategoryService";
import CategoryCard from "../components/CategoryCard";
import FormModal from "../components/FormModal";
import CategoryForm from "../components/CategoryForm";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
);

const Dashboard = () => {
  const [categories, setCategories] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState([]);
  const [user, setUser] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [chartData, setChartData] = useState({
    expenseData: null,
    incomeData: null,
    monthlyBarData: null,
  });
  const [selectedPeriod, setSelectedPeriod] = useState("total");
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingMonthly, setLoadingMonthly] = useState(false);

  // Excluir
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Editar
  const [showEditModal, setShowEditModal] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  const fetchUser = async () => {
    const response = await api.get("/users/user", { withCredentials: true });
    setUser(response.data);
  };

  // ----------------------------
  // Funções de Delete / Prompt
  // ----------------------------
  const promptDeleteCategory = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleDeleteCategory = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      // recarrega após delete
      loadCategoriesTotalSpent(selectedPeriod);
      loadMonthlySummary(selectedPeriod);
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    }
  };

  // ----------------------------
  // Funções de Edit / Prompt
  // ----------------------------
  const promptEditCategory = (category) => {
    // abre o modal de edição, preenchendo com os dados atuais
    setCategoryToEdit(category);
    setShowEditModal(true);
  };

  const handleEditCategorySubmit = async (updatedCategory) => {
    // updatedCategory aqui já vem com { category_id, name, color, user_id } ou semelhante
    try {
      await api.put(`/categories/${updatedCategory.category_id}`, {
        name: updatedCategory.name,
        color: updatedCategory.color,
      });
      // depois de editar, recarrega a lista
      loadCategoriesTotalSpent(selectedPeriod);
      loadMonthlySummary(selectedPeriod);
    } catch (error) {
      console.error("Error updating category:", error);
    } finally {
      setShowEditModal(false);
      setCategoryToEdit(null);
    }
  };

  // ----------------------------
  // Carregamento de dados
  // ----------------------------
  const loadMonthlySummary = async (period) => {
    try {
      setLoadingMonthly(true);
      const response = await api.get(
        `/transactions/summary/monthly/${user.user_id}?period=${period}`,
        { withCredentials: true }
      );
      setMonthlySummary(response.data);
    } catch (error) {
      console.error("Erro ao carregar resumo mensal:", error);
    } finally {
      setLoadingMonthly(false);
    }
  };

  const loadCategoriesTotalSpent = async (period) => {
    try {
      setLoadingCategories(true);
      const data = await CategoryService.fetchAllTotalSpent(
        user.user_id,
        period
      );
      setCategories(data);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const prepareChartData = (categories, monthlyData) => {
    const expenseData = {
      labels: categories.map((cat) => cat.name),
      datasets: [
        {
          label: "Gastos por Categoria",
          data: categories.map((cat) => cat.total_expense),
          backgroundColor: categories.map((cat) => cat.color),
          borderColor: "#fff",
          borderWidth: 1,
        },
      ],
    };

    const incomeData = {
      labels: categories.map((cat) => cat.name),
      datasets: [
        {
          label: "Receita por Categoria",
          data: categories.map((cat) => cat.total_income),
          backgroundColor: categories.map((cat) => cat.color),
          borderColor: "#fff",
          borderWidth: 1,
        },
      ],
    };

    const monthlyBarData = {
      labels: monthlyData.map((item) => item.month),
      datasets: [
        {
          label: "Receitas",
          data: monthlyData.map((item) => item.total_income),
          backgroundColor: "#2ecc71",
          borderRadius: 4,
        },
        {
          label: "Despesas",
          data: monthlyData.map((item) => item.total_expense),
          backgroundColor: "#e74c3c",
          borderRadius: 4,
        },
      ],
    };

    setChartData({
      expenseData,
      incomeData,
      monthlyBarData,
    });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadCategoriesTotalSpent(selectedPeriod);
      loadMonthlySummary(selectedPeriod);
    }
  }, [user, selectedPeriod]);

  useEffect(() => {
    prepareChartData(categories, monthlySummary);
  }, [categories, monthlySummary]);

  return (
    <div className="mt-10 px-6 lg:px-12">
      <div className="flex justify-end mb-3">
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 border rounded-lg shadow-sm"
        >
          <option value="1">Último mês</option>
          <option value="3">Últimos 3 meses</option>
          <option value="6">Últimos 6 meses</option>
          <option value="12">Último ano</option>
          <option value="total">Total</option>
        </select>
      </div>
      <div className="flex flex-col lg:flex-row gap-16">
        <div className="w-full lg:w-2/5 min-w-0">
          <div className="flex justify-between items-center gap-4 pb-4 border-b border-gray-300">
            <p className="flex items-center ml-2 text-lg font-semibold">
              Categorias
            </p>
            <button
              onClick={() => setShowCategoryForm(!showCategoryForm)}
              className="flex items-center px-4 py-2 rounded-lg shadow-lg bg-[#2ecc71] text-white hover:bg-[#27ae60] transition-colors duration-300"
            >
              <span className="mr-2 text-xl">+</span>
              Nova Categoria
            </button>
            {showCategoryForm && (
              <FormModal onClose={() => setShowCategoryForm(false)}>
                <CategoryForm
                  onCategoryAdded={() => {
                    loadCategoriesTotalSpent("total");
                    setShowCategoryForm(false);
                  }}
                  user={user}
                />
              </FormModal>
            )}
          </div>

          <div className="max-h-[650px] overflow-y-auto overflow-x-hidden pr-10">
            {categories.length > 0 && (
              <div className="hidden md:flex mb-4 p-4 bg-gray-100 rounded-lg justify-between items-center">
                <p className="text-gray-600 font-semibold">Nome</p>
                <p className="text-gray-600 font-semibold">Receita</p>
                <p className="text-gray-600 font-semibold">Despesa</p>
                <p className="text-gray-600 font-semibold">Saldo</p>
                <p className="text-gray-600 font-semibold">Ações</p>
              </div>
            )}
            {categories.map((category) => (
              <CategoryCard
                key={category.category_id}
                category={category}
                onDelete={() => promptDeleteCategory(category)}
                onEdit={() => promptEditCategory(category)}
              />
            ))}
          </div>
        </div>
        <div className="w-full lg:w-3/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
              <h3 className="text-md font-semibold mb-3 text-gray-700">
                Distribuição de Gastos
              </h3>
              <div className="flex-1" style={{ minHeight: "250px" }}>
                {loadingCategories ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : chartData.expenseData &&
                  chartData.expenseData.labels.length > 0 ? (
                  <Pie
                    data={chartData.expenseData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "right",
                          labels: {
                            padding: 15,
                            font: {
                              size: 12,
                            },
                          },
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              const label = context.label || "";
                              const value = Number(context.raw);
                              const dataset = context.dataset;
                              const total = dataset.data.reduce(
                                (a, b) => Number(a) + Number(b),
                                0
                              );
                              if (total === 0) return `${label}: ${value}`;
                              const percentage = Math.round(
                                (value / total) * 100
                              );
                              return `${label}: ${value} (${percentage}%)`;
                            },
                          },
                        },
                      },
                      cutout: "60%",
                      borderRadius: 4,
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">
                      Nenhum dado disponível para gastos
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
              <h3 className="text-md font-semibold mb-3 text-gray-700">
                Distribuição de Receita
              </h3>
              <div className="flex-1" style={{ minHeight: "250px" }}>
                {loadingCategories ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : chartData.incomeData &&
                  chartData.incomeData.labels.length > 0 ? (
                  <Pie
                    data={chartData.incomeData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "right",
                          labels: {
                            padding: 15,
                          },
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              const label = context.label || "";
                              const value = Number(context.raw);
                              const dataset = context.dataset;
                              const total = dataset.data.reduce(
                                (a, b) => Number(a) + Number(b),
                                0
                              );
                              if (total === 0) return `${label}: ${value}`;
                              const percentage = Math.round(
                                (value / total) * 100
                              );
                              return `${label}: ${value} (${percentage}%)`;
                            },
                          },
                        },
                      },
                      cutout: "60%",
                      borderRadius: 4,
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">
                      Nenhum dado disponível para receitas
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:col-span-2">
              <h3 className="text-md font-semibold mb-3 text-gray-700">
                Receitas e Despesas Mensais
              </h3>
              <div className="flex-1" style={{ minHeight: "250px" }}>
                {loadingMonthly ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : chartData.monthlyBarData &&
                  chartData.monthlyBarData.labels.length > 0 ? (
                  <Bar
                    data={chartData.monthlyBarData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          grid: {
                            display: false,
                          },
                        },
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: "#f0f0f0",
                          },
                        },
                      },
                      plugins: {
                        legend: {
                          position: "top",
                        },
                      },
                      barPercentage: 0.5,
                      borderRadius: 5,
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">
                      Nenhum dado mensal disponível
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showDeleteModal && categoryToDelete && (
        <FormModal onClose={() => setShowDeleteModal(false)}>
          <div className="p-6 bg-white rounded-lg max-w-md mx-auto">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Confirmar exclusão
            </h2>
            <p className="text-gray-700 mb-6">
              Tem certeza que deseja excluir a categoria{" "}
              <span className="font-medium">{categoryToDelete.name}</span>?
              <br />
              Todas as transações associadas a esta categoria serão removidas.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setCategoryToDelete(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() =>
                  handleDeleteCategory(categoryToDelete.category_id)
                }
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </FormModal>
      )}
      {showEditModal && categoryToEdit && (
        <FormModal onClose={() => setShowEditModal(false)}>
          <CategoryForm
            category={categoryToEdit}
            user={user}
            isEdit={true}
            onCategoryUpdated={(updatedCategory) =>
              handleEditCategorySubmit(updatedCategory)
            }
          />
        </FormModal>
      )}
    </div>
  );
};

export default Dashboard;
