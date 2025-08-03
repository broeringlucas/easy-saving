require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const users = require("./routes/users");
const transactions = require("./routes/transactions");
const categories = require("./routes/categories");

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3030",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API is running!");
});

app.use("/users", users);
app.use("/transactions", transactions);
app.use("/categories", categories);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

// Se quiser que o banco de dados seja sincronizado automaticamente com os models, descomente a linha abaixo

// db.sync({ force: true }).then(() => {
//   console.log("Database synced");
// });
