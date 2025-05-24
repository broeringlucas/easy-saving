const db = require("./db.js");
const express = require("express");
const users = require("./routes/users");
const transactions = require("./routes/transactions");
const categories = require("./routes/categories");
const cookieParser = require("cookie-parser");

const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT;
const app = express();

const corsOptions = {
  origin: "http://localhost:8080",
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

// routes
app.use("/users", users);
app.use("/transactions", transactions);
app.use("/categories", categories);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Se quiser que o banco de dados seja sincronizado automaticamente com os models, descomente a linha abaixo

// db.sync({ force: true }).then(() => {
//   console.log("Database synced");
// });
