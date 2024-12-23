import express from "express";
import fs from "fs";
import path from "path";
import { __dirname } from "../dirname.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();
const cartsFilePath = path.join(__dirname, "../data/carrito.json");

const readCarts = () => {
  const data = fs.readFileSync(cartsFilePath, "utf-8");
  return JSON.parse(data);
};

const writeCarts = (carts) => {
  fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
};

router.post("/", (req, res) => {
  const newCart = {
    id: uuidv4(),
    products: []
  };

  let carts = readCarts();
  carts.push(newCart);
  writeCarts(carts);

  res.status(201).json({ message: "Carrito creado exitosamente", cart: newCart });
});

router.get("/:cid", (req, res) => {
  const { cid } = req.params;

  let carts = readCarts();
  const cart = carts.find((cart) => cart.id === cid);

  if (!cart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  res.status(200).json({ products: cart.products });
});

router.post("/:cid/product/:pid", (req, res) => {
  const { cid, pid } = req.params;

  let carts = readCarts();
  const cart = carts.find((cart) => cart.id === cid);

  if (!cart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  const productIndex = cart.products.findIndex((product) => product.product === pid);

  if (productIndex === -1) {
    cart.products.push({ product: pid, quantity: 1 });
  } else {
    cart.products[productIndex].quantity += 1;
  }
  writeCarts(carts);

  res.status(200).json({ message: "Producto agregado al carrito exitosamente", cart });
});

export default router;