import { Router } from "express";

const viewsRoutes = (products) => {
  const router = Router();

  router.get("/", (req, res) => {
    res.render("home", { title: "Home", products });
  });

  router.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts", { title: "Real Time Products", products });
  });

  return router;
};

export default viewsRoutes;