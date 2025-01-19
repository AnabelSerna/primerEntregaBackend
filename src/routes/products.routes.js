import { Router } from "express";
import { io } from "../server.js";

const productRoutes = (products) => {
  const router = Router();

  router.get("/", (req, res) => {
    res.json(products);
  });

  router.post("/", (req, res) => {
    const newProduct = req.body;
    products.push(newProduct);
    io.emit("updateProducts", { products });
    res.status(201).json(newProduct);
  });

  router.delete("/:id", (req, res) => {
    const { id } = req.params;
    products = products.filter((product) => product.id !== id);
    io.emit("updateProducts", { products });
    res.status(200).json({ message: "Producto eliminado" });
  });

  return router;
};

export default productRoutes;