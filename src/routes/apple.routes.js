import { Router } from "express";
import { io } from "../server.js";

const appleRoutes = Router();

export const apple = [
  { name: "Iphone", type: "13" },
  { name: "Iphone", type: "14" },
  { name: "Iphone", type: "15" },
  { name: "Iphone", type: "16" },
];

appleRoutes.get("/", (req, res) => {
  res.json(apple);
});

appleRoutes.post("/", (req, res) => {
  const { name, type } = req.body;
  apple.push({ name, type });

  io.emit("updateProducts", { products: apple });

  res.json({ name, type });
});

export default appleRoutes;