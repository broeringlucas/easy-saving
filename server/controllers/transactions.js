const db = require("../models/transaction.js");

const createTransaction = async (req, res) => {
  try {
    const { amount, description, category, user, type, date } = req.body;

    await db.create({
      amount: amount,
      description: description,
      category_id: category,
      user_id: user,
      type: type,
      date: date || new Date(),
    });
    return res
      .status(201)
      .send({ message: "Transaction created successfully" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await db.findByPk(id);
    if (!transaction) {
      return res.status(404).send({ message: "Transaction not found" });
    }
    await transaction.destroy();
    return res
      .status(200)
      .send({ message: "Transaction deleted successfully" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const getTransactionsByUser = async (req, res) => {
  const { user_id } = req.params;
  let { period } = req.query;

  try {
    let whereClause = "WHERE t.user_id = :user_id ";
    const replacements = { user_id };

    if (period && period !== "total") {
      const months = parseInt(period);
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);

      whereClause += "AND DATE(t.date) >= DATE(:startDate)";
      replacements.startDate = startDate.toISOString().split("T")[0];
    }
    const result = await db.sequelize.query(
      `
      SELECT 
        t.*,
        c.category_id as category_id,
        c.name as category_name,
        c.color as category_color
      FROM tb_transactions t
      LEFT JOIN categories c ON t.category_id = c.category_id
      ${whereClause}
      ORDER BY t.date DESC
      `,
      {
        replacements,
        type: db.sequelize.QueryTypes.SELECT,
      }
    );
    return res.status(200).send(result);
  } catch (error) {
    console.error("Erro detalhado:", error);
    return res.status(500).send({ message: error.message });
  }
};

const getMonthlySummary = async (req, res) => {
  const { user_id } = req.params;
  const { period } = req.query;

  try {
    let whereClause = "WHERE t.user_id = :user_id ";
    const replacements = { user_id };

    if (period && period !== "total") {
      const months = parseInt(period);
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);

      whereClause += "AND DATE(t.date) >= DATE(:startDate)";
      replacements.startDate = startDate.toISOString().split("T")[0];
    }

    const result = await db.sequelize.query(
      `
      SELECT 
        to_char(t.date, 'YYYY-MM') AS month,
        COALESCE(SUM(CASE WHEN t.type = 0 THEN t.amount ELSE 0 END), 0) AS total_expense,
        COALESCE(SUM(CASE WHEN t.type = 1 THEN t.amount ELSE 0 END), 0) AS total_income
      FROM tb_transactions t
      ${whereClause}
      GROUP BY to_char(t.date, 'YYYY-MM')
      ORDER BY month DESC
      `,
      {
        replacements,
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    return res.status(200).send(result);
  } catch (error) {
    console.error("Erro detalhado:", error);
    return res.status(500).send({ message: error.message });
  }
};

module.exports = {
  getTransactionsByUser,
  createTransaction,
  deleteTransaction,
  getMonthlySummary,
};
