const express = require("express");
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  getCategoriesByUser,
  createCategory,
  updateCategory,
  deleteCategory,
  getTotalSpentByCategory,
  getCategoryName,
} = require("../controllers/categories");

const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, getCategories);
router.get("/user/:user_id", authMiddleware, getCategoriesByUser);
router.get("/user/:user_id/total", authMiddleware, getTotalSpentByCategory);
router.get("/user/:user_id/name/:name", authMiddleware, getCategoryName);
router.get("/:id", getCategoryById);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
