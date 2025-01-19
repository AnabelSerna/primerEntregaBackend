const socket = io();

socket.on("init", (data) => {
  updateProductList(data.products);
});

socket.on("updateProducts", (data) => {
  updateProductList(data.products);
});

document.getElementById("product-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("product-name").value;
  const type = document.getElementById("product-type").value;
  socket.emit("newProduct", { name, type });
});

document.getElementById("delete-product-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const productId = document.getElementById("product-id").value;
  socket.emit("deleteProduct", productId);
});

function updateProductList(products) {
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";
  products.forEach((product) => {
    const li = document.createElement("li");
    li.textContent = `${product.name} - ${product.type} (ID: ${product.id})`;
    productList.appendChild(li);
  });
}