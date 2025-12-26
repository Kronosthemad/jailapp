
function displayDate() {
    const el = document.getElementById('time');
    if (el) el.innerHTML = String(new Date());
}
setInterval(displayDate, 1000);

const fs = require('fs');
const path = require('path');
// Get the products for the store
let products = readJSON("./data/products.json");

// Get the user information 
let users = readJSON("./data/users.json");
let usrInput = document.getElementById('usernm');
let pwInput = document.getElementById('paswd');

//Get the respomce of the login
let accept = document.querySelector('input[type="submit"');
let errEl =document.getElementById('err');

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

 function fillStore(products) {
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

try {  
  accept.addEventListener('click', async (e) => {
    //Prevent the default
    e.preventDefault();

    //trim whitespace
    let username = (useInput.value || '').trim();
    let password = (pwInput.value || '' ).trim();

    //--the magic--
    if (!username) {
      errEl.innerHTML ='Username Required';
      return;
    }
    if (username.length < 8) {
      errEl.innerHTML = "Username needs to be over 8 characters";
      return;
    }
    if (!password) {
      errEl.innerHTML = 'Password required';
      return;
    }
    let responce = {
      Headers: {'Constant-Type': 'application/json' },
      body: JSON.stringify({username: password})
    }
   
  })} catch { console.log(errEl)}