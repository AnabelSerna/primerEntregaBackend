import { Router } from "express";
import Cart from "../models/Cart.js"; 
import Product from "../models/product.js";

const router = Router();

router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    const product = await Product.findById(pid);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const existingProductIndex = cart.products.findIndex(p => p.product.toString() === pid);
    if (existingProductIndex > -1) {
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;