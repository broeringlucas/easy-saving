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
  try {
    const { id } = req.params;
    const category = await db.findByPk(id);
    if (!category) {
      return res.status(404).send({ message: "Category not found" });
    }
    await category.destroy();
    return res.status(200).send({ message: "Category deleted successfully" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const getTotalSpentByCategory = async (req, res) => {
  const { user_id } = req.params;
  try {
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
      WHERE c.user_id = :user_id
      GROUP BY c.category_id, c.name, c.color
      ORDER BY total_expense DESC
      `,
      {
        replacements: { user_id },
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
  createCategory,
  updateCategory,
  deleteCategory,
  getTotalSpentByCategory,
};
