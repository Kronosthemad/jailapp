// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    
    /**
     * Asynchronously fetches product data from the API and populates the product list on the page.
     */
    async function loadProducts() {
        try {
            // --- Fetch Product Data ---
            // Make an asynchronous call to the products API endpoint
            const response = await fetch('/api/products');
            // Parse the JSON response body
            const products = await response.json();

            // Get a reference to the container where products will be displayed
            const productsDiv = document.getElementById('products');
            
            // --- Render Products ---
            // Map each product object to an HTML string and join them together
            productsDiv.innerHTML = products.map(product => `
                <div class="store_examples">
                    <img src="/${product.image}" alt="${product.name}" class="img-size">
                    <h3><a href="./login.html" target="_blank">${product.name}</a></h3>
                    <p class="price">$${product.price}</p>
                    <p class="description">${product.description}</p>
                </div>
            `).join('');
        } catch (error) {
            // --- Error Handling ---
            // If the fetch call or parsing fails, display an error message
            const errorDiv = document.getElementById('error-message'); // Assuming an element with this ID exists for errors
            if(errorDiv) {
                errorDiv.innerHTML = 'Failed to load products. Please try refreshing the page.';
            }
        }
    }

    // Call the function to load products as soon as the page is ready
    loadProducts();
});