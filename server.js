const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const app = express();
app.use(express.json());


dotenv.config();
connectDB();



// Swagger (if added)
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


const authRoutes = require("./routes/authRoutes");
app.use("/api", authRoutes);

const transactionRoutes = require("./routes/transactionRoutes");
app.use("/api", transactionRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api", adminRoutes);


