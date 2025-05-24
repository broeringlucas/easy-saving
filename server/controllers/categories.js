const db = require("../models/category.js");

// Get all categories
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

// Get category by id
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

// Create new category
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

// Update category
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

// Delete category
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

const getCategoriesByUserAndName = async (req, res) => {
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

module.exports = {
  getCategories,
  getCategoryById,
  getCategoriesByUser,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoriesByUserAndName,
};
