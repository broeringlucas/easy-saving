const express = require("express");
const router = express.Router();
const {
  getCategoriesByUser,
  createCategory,
  updateCategory,
  deleteCategory,
  getTotalSpentByCategory,
  getCategoryByName,
} = require("../controllers/categories");

const authMiddleware = require("../middlewares/AuthMiddleware");

router.get("/user/:user_id", authMiddleware, getCategoriesByUser);
router.get("/user/:user_id/total", authMiddleware, getTotalSpentByCategory);
router.get("/user/:user_id/name/:name", authMiddleware, getCategoryByName);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
