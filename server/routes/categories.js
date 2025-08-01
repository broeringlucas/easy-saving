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

const AuthMiddleware = require("../middlewares/AuthMiddleware");

router.get("/user/:user_id", AuthMiddleware, getCategoriesByUser);
router.get("/user/:user_id/total", AuthMiddleware, getTotalSpentByCategory);
router.get("/user/:user_id/name/:name", AuthMiddleware, getCategoryByName);
router.post("/", AuthMiddleware, createCategory);
router.put("/:id", AuthMiddleware, updateCategory);
router.delete("/:id", AuthMiddleware, deleteCategory);

module.exports = router;
