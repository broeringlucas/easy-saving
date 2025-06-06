const db = require("../models/category.js");

const getCategories = async (req, res) => {
  try {
    const categories = await db.findAll();
    return res.status(200).send(categories);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const getCategoriesByUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const categories = await db.findAll({
      where: {
        user_id: user_id,
      },
    });
    return res.status(200).send(categories);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await db.findByPk(id);
    if (!category) {
      return res.status(404).send({ message: "Category not found" });
    }
    return res.status(200).send(category);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, color, user } = req.body;
    await db.create({
      name: name.toLowerCase(),
      color: color,
      user_id: user,
    });
    return res.status(201).send({ message: "Category created successfully" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;
    const category = await db.findByPk(id);
    if (!category) {
      return res.status(404).send({ message: "Category not found" });
    }
    await category.update({
      name: name,
      color: color,
    });
    return res.status(200).send({ message: "Category updated successfully" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  const sequelize = db.sequelize;

  try {
    const category = await db.findByPk(id);
    if (!category) {
      return res.status(404).send({ message: "Category not found" });
    }
    const t = await sequelize.transaction();

    try {
      await sequelize.query(
        `
        DELETE
          FROM transactions
        WHERE category_id = :categoryId
        `,
        {
          replacements: { categoryId: id },
          type: sequelize.QueryTypes.DELETE,
          transaction: t,
        }
      );
      await sequelize.query(
        `
        DELETE
          FROM categories
        WHERE category_id = :categoryId
        `,
        {
          replacements: { categoryId: id },
          type: sequelize.QueryTypes.DELETE,
          transaction: t,
        }
      );
      await t.commit();
      return res.status(200).send({
        message: "Category and its transactions deleted successfully",
      });
    } catch (innerErr) {
      await t.rollback();
      throw innerErr;
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const getCategoryName = async (req, res) => {
  const { user_id, name } = req.params;
  try {
    const categories = await db.findAll({
      where: {
        user_id: user_id,
        name: name.toLowerCase(),
      },
    });
    return res.status(200).send(categories);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const getTotalSpentByCategory = async (req, res) => {
  const { user_id } = req.params;
  const { period } = req.query;
  try {
    let whereClause = "";
    const replacements = { user_id };

    if (period && period !== "total") {
      const months = parseInt(period);
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);

      whereClause = "AND DATE(t.timestamp) >= DATE(:startDate)";
      replacements.startDate = startDate.toISOString().split("T")[0];
    }

    const result = await db.sequelize.query(
      `
      SELECT 
        c.category_id,
        c.name,
        c.color,
        COALESCE(SUM(CASE WHEN t.type = 0 THEN t.amount ELSE 0 END), 0) AS total_expense,
        COALESCE(SUM(CASE WHEN t.type = 1 THEN t.amount ELSE 0 END), 0) AS total_income
      FROM categories c
      LEFT JOIN transactions t 
        ON c.category_id = t.category_id
        ${whereClause}
      WHERE c.user_id = :user_id
      GROUP BY c.category_id, c.name, c.color
      ORDER BY total_expense DESC
      `,
      {
        replacements,
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  getCategoriesByUser,
  getCategoryName,
  createCategory,
  updateCategory,
  deleteCategory,
  getTotalSpentByCategory,
};
