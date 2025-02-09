import path from "path";
import morgan from "morgan";
import express from "express";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import connectDB from "./config.js";
import { __dirname } from "./dirname.js";
import viewsRoutes from "./routes/views.routes.js";
import productRoutes from "./routes/products.routes.js";
import cartRoutes from "./routes/carts.routes.js";
import appleRoutes, { apple } from "./routes/apple.routes.js";
import Product from "./models/product.js";

const app = express();
const PORT = process.env.PORT || 3001;

connectDB();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "../public")));

app.engine(
  "handlebars",
  handlebars.engine({
    extname: ".handlebars",
    defaultLayout: "main",
    layoutsDir: path.resolve(__dirname, "./views/layouts"),
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));

app.use("/", viewsRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/apple", appleRoutes);

const server = app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

const io = new Server(server);

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.emit("init", { products: [] });

  socket.on("newProduct", async (product) => {
    try {
      const newProduct = new Product(product);
      await newProduct.save();
      const products = await Product.find();
      io.emit("updateProducts", { products });
    } catch (err) {
      console.error("Error adding product:", err);
    }
  });

  socket.on("deleteProduct", async (productId) => {
    try {
      await Product.findByIdAndDelete(productId);
      const products = await Product.find();
      io.emit("updateProducts", { products });
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

export { io };