import express from "express";
import fs from "fs";
import path from "path";
import { __dirname } from "../dirname.js";

const router = express.Router();
const productsFilePath = path.join(__dirname, "../data/productos.json");

const readProducts = () => {
  const data = fs.readFileSync(productsFilePath, "utf-8");
  return JSON.parse(data);
};

const writeProducts = (products) => {
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};

router.get("/", (req, res) => {
  const products = readProducts();
  res.status(200).json(products);
});

router.get("/:pid", (req, res) => {
  const { pid } = req.params;
  const products = readProducts();
  const product = products.find((product) => product.id === pid);

  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.status(200).json(product);
});

router.post("/", (req, res) => {
  const newProduct = req.body;
  newProduct.id = Date.now().toString(); 

  let products = readProducts();
  products.push(newProduct);
  writeProducts(products);

  res.status(201).json({ message: "Producto agregado exitosamente", product: newProduct });
});

router.put("/:pid", (req, res) => {
  const { pid } = req.params;
  const updatedProduct = req.body;

  let products = readProducts();
  const productIndex = products.findIndex((product) => product.id === pid);

  if (productIndex === -1) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  delete updatedProduct.id;

  products[productIndex] = { ...products[productIndex], ...updatedProduct };
  writeProducts(products);

  res.status(200).json({ message: "Producto actualizado exitosamente", product: products[productIndex] });
});

router.delete("/:pid", (req, res) => {
  const { pid } = req.params;

  let products = readProducts();
  const productIndex = products.findIndex((product) => product.id === pid);

  if (productIndex === -1) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  products.splice(productIndex, 1);
  writeProducts(products);

  res.status(200).json({ message: "Producto eliminado exitosamente" });
});

export default router;