const express = require("express");
const app = express();
const PORT = 5599

const allRoutes = require("./src/api/v1/routes/users");

app.use(express.json());

app.use("/api/v1", allRoutes);

app.use((req, res, next) => {
    res.status(404).json({ error: "Not Found" });
});
  
app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).json({ error: "Internal Server Error" });
});
  

app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
});
