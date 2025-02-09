import { Router } from "express";
import Product from "../models/product.js";
import Cart from "../models/Cart.js"; 

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
    res.render("index", {
      products: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage ? `/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null,
      nextLink: products.hasNextPage ? `/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null,
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.get("/products/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid);
    res.render("product", { product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/carts/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.product');
    res.render("cart", { cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;