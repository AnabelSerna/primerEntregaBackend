import { Router } from "express";
import Product from "../models/product.js";

const router = Router();

router.get("/", async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
  };

  const filter = query ? { $or: [{ category: query }, { available: query === 'true' }] } : {};

  try {
    const products = await Product.paginate(filter, options);
    res.json({
      status: 'success',
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null,
      nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null,
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.post("/", async (req, res) => {
  const { name, type, price, category, available } = req.body;
  const newProduct = new Product({ name, type, price, category, available });

  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Producto eliminado" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;