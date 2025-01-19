import path from "path";
import morgan from "morgan";
import express from "express";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import { v4 as uuidv4 } from "uuid";

import { __dirname } from "./dirname.js";
import viewsRoutes from "./routes/views.routes.js";
import productRoutes from "./routes/products.routes.js";
import appleRoutes, { apple } from "./routes/apple.routes.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "../public")));


app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    defaultLayout: "main",
  })
);
app.set("view engine", "hbs");
app.set("views", path.resolve(__dirname, "./views"));

let products = apple.map(product => ({ ...product, id: uuidv4() })); 


app.use("/", viewsRoutes(products));
app.use("/api/products", productRoutes(products));
app.use("/api/apple", appleRoutes);


const server = app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

const io = new Server(server);

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.emit("init", { products });

  socket.on("newProduct", (product) => {
    product.id = uuidv4(); 
    products.push(product);
    io.emit("updateProducts", { products });
  });

  socket.on("deleteProduct", (productId) => {
    products = products.filter((product) => product.id !== productId);
    io.emit("updateProducts", { products });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

export { io };