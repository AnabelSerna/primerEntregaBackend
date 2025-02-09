const socket = io();

socket.on("updateProducts", (data) => {
  updateProductList(data.products);
});

function updateProductList(products) {
  const productList = document.getElementById("product-list");
  if (!productList) {
    console.error("Element with id 'product-list' not found");
    return;
  }

  productList.innerHTML = "";
  products.forEach((product) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <a href="/products/${product._id}">${product.name} - ${product.type}</a>
      <button onclick="addToCart('${product._id}')">Agregar al carrito</button>
    `;
    productList.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const addProductForm = document.getElementById("add-product-form");
  if (addProductForm) {
    addProductForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(addProductForm);
      const product = {
        name: formData.get("name"),
        type: formData.get("type"),
        price: parseFloat(formData.get("price")),
        category: formData.get("category"),
        available: formData.get("available") === "true",
      };
      socket.emit("newProduct", product);
    });
  } else {
    console.error("Element with id 'add-product-form' not found");
  }
});