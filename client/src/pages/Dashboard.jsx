import { useState, useEffect } from "react";
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

import CategoryCard from "../components/CategoryCard";
import FormModal from "../components/FormModal";
import CategoryForm from "../components/CategoryForm";
import IntervalSelect from "../components/IntervalSelect";
import { UserService } from "../services/UserService";
import { CategoryService } from "../services/CategoryService";
import { TransactionService } from "../services/TransactionService";

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  const fetchUser = async () => {
    const response = await UserService.fetchUser();
    setUser(response);
  };

  const promptDeleteCategory = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleDeleteCategory = async (id) => {
    try {
      await await CategoryService.deleteCategory(id);
      loadCategoriesTotalSpent(selectedPeriod);
      loadMonthlySummary(selectedPeriod);
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    }
  };

  const promptEditCategory = (category) => {
    setCategoryToEdit(category);
    setShowEditModal(true);
  };

  const loadMonthlySummary = async (period) => {
    try {
      setLoadingMonthly(true);
      const response = await TransactionService.fetchMonthlyTransactionsByUser(
        user.user_id,
        period
      );
      setMonthlySummary(response);
    } catch (error) {
      console.error("Erro ao carregar resumo mensal:", error);
    } finally {
      setLoadingMonthly(false);
    }
  };

  const loadCategoriesTotalSpent = async (period) => {
    try {
      setLoadingCategories(true);
      const response = await CategoryService.fetchAllCategoriesTotalSpent(
        user.user_id,
        period
      );
      setCategories(response);
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
      <IntervalSelect value={selectedPeriod} onChange={setSelectedPeriod} />
      <div className="flex flex-col lg:flex-row gap-16">
        <div className="w-full lg:w-2/5 min-w-0">
          <div className="flex justify-between items-center gap-4 pb-4 border-b border-gray-300">
            <p className="flex items-center ml-2 text-lg font-semibold">
              Categorias
            </p>
            <button
              onClick={() => setShowCategoryForm(!showCategoryForm)}
              className="flex items-center px-4 py-2 rounded-lg shadow-lg bg-p-green text-white hover:bg-s-green transition-colors duration-300"
            >
              <span className="mr-2 text-xl">+</span>
              Nova Categoria
            </button>
            {showCategoryForm && (
              <FormModal onClose={() => setShowCategoryForm(false)}>
                <CategoryForm
                  onCategoryAdded={() => {
                    loadCategoriesTotalSpent(selectedPeriod);
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
                <p className="text-gray-600 font-semibold">Balanço</p>
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
                              const value = Number(context.raw).toFixed(2);
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
                              const value = Number(context.raw).toFixed(2);
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
                          ticks: {
                            callback: function (value) {
                              return Number(value).toFixed(2);
                            },
                          },
                        },
                      },
                      plugins: {
                        legend: {
                          position: "top",
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              const label = context.dataset.label || "";
                              const value = Number(context.raw).toFixed(2);
                              return `${label}: ${value}`;
                            },
                          },
                        },
                      },
                      barPercentage: 0.8,
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
            onCategoryUpdated={() => {
              loadCategoriesTotalSpent(selectedPeriod);
              loadMonthlySummary(selectedPeriod);
              setShowEditModal(false);
            }}
            onClose={() => setShowEditModal(false)}
          />
        </FormModal>
      )}
    </div>
  );
};

export default Dashboard;
