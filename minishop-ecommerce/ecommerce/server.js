const express = require("express");
const jsonServer = require("json-server");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// API (JSON Server) 

const apiRouter = jsonServer.router(path.join(__dirname, "db", "db.json"));
const middlewares = jsonServer.defaults();

app.use("/api", middlewares, apiRouter);

// Frontend (arquivos estáticos)
app.use(express.static(path.join(__dirname, "public")));

// Qualquer rota não-API cai na index.html (SPA-like fallback simples)
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`API disponível em http://localhost:${PORT}/api/produtos`);
});
