
function displayDate() {
    const el = document.getElementById('time');
    if (el) el.innerHTML = String(new Date());
}
setInterval(displayDate, 1000);

const fs = require('fs');
const path = require('path');
// Get the products for the store
const products = readJSON("./data/products.json")
const users = readJSON("./data/users.json")

// Helper functions
function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(path.join(__dirname, 'data', file), 'utf8'));
  } catch (err) {
    console.error(err);
    return [];
  }
}
function writeJSON(file, data) {
  try {
    fs.writeFileSync(path.join(__dirname, 'data', file), JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
}

export default function fillStore(products) {
    try {
    let productsDiv = document.getElementById('products');
    productsDiv.innerHTML = products.map(product => `
        <div class="store_examples">
                    <img src="/${product.image}" alt="${product.name}" class="img-size">
                    <h3><a href="../data/products.json" target="_blank">${product.name}</a></h3>
                    <p class="price">$${product.price}</p>
                    <p class="description">${product.description}</p>
                </div>
        `).join('');
    } catch {
        console.error("write failed")
    }
}
