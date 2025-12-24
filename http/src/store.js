addEventListener('DOMContentLoaded', () => {    
    async function loadProducts() {
            try {
                const response = await fetch('/api/products');
                const products = await response.json();
                const productsDiv = document.getElementById('products');
                productsDiv.innerHTML = products.map(product => `
                    <span class="store_examples">
                        <img src="../${product.image}" alt="${product.name}" class="img-size">
                        <a href="./login.html" target="_blank">${product.name}</a>
                        <p>$${product.price} - ${product.description}</p>
                    </span>
                `).join('');
            } catch (error) {
                document.getElementById('error').innerHTML = 'Failed to load products';
            }
        }
        loadProducts();
});