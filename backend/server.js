const express = require("express");
const cookieParser = require("cookie-parser")
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const endowmentPledgeRoutes = require("./routes/endowmentPledgeRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(express.json({ extended: false }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true, 
}));

app.use("/auth", authRoutes); //routes to register and log in
app.use("/endowment-pledges", endowmentPledgeRoutes);
app.use("/endowment-pledge", paymentRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));