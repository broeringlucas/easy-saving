const express = require("express");
const cookieParser = require("cookie-parser");
const db = require("./config/db");

const users = require("./routes/users");
const transactions = require("./routes/transactions");
const categories = require("./routes/categories");

const app = express();
const cors = require("cors");

const corsOptions = {
  origin: [process.env.CLIENT_URL],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["set-cookie"],
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL);
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API is running!");
});

app.use("/users", users);
app.use("/transactions", transactions);
app.use("/categories", categories);

app.options("*", cors(corsOptions));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

// Se quiser que o banco de dados seja sincronizado automaticamente com os models, descomente a linha abaixo

db.sync({ force: true }).then(() => {
  console.log("Database synced");
});
