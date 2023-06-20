
var newProduct = {
  name:"",
  description:"",
  symbol:"",
  price:null,
  change:"",
  volume:"",
};
var updatedData = {
  name:"",
  description:"",
  symbol:"",
  price:null,
  change:"",
  volume:"",
};

function addToCart(productId) {    
    const quantityInput = document.getElementById(`add-quantity-${productId}`)
    quantity = quantityInput.value;
    
    
    fetch(`/cart/add/${productId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity}),
    })
      .then(response => {
        if (response.ok) {
          console.log('Product added to cart');
          // Perform any necessary UI updates
        } else {
          throw new Error('Error adding product to cart');
        }
      })
      .catch(error => {
        console.error('Error adding product to cart:', error);
      });
  }

  function deleteItem(productId) {
    fetch(`/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (response.ok) {
          console.log('Item deleted successfully');
          // Perform any necessary UI updates
        } else {
          throw new Error('Error deleting item');
        }
      })
      .catch(error => {
        console.error('Error deleting item:', error);
      });
  }

  function addNewCoin() {
    // Show the new row
    document.getElementById("new-row").style.display = "table-row";
  }
  
  function saveNewItem() {
    // Get the values from the input fields
    var name = document.getElementById("new-name").value;
    var description = document.getElementById("new-description").value;
    var symbol = document.getElementById("new-symbol").value;
    var price = document.getElementById("new-price").value;
    var change = document.getElementById("new-change").value;
    var volume = document.getElementById("new-volume").value;
    newProduct.name = name
    newProduct.description = description
    newProduct.symbol = symbol
    newProduct.price = price
    newProduct.change = change
    newProduct.volume = volume

    var newRowHTML = `
      <tr>
        <td>${name}</td>
        <td>${description}</td>
        <td>${symbol}</td>
        <td>${price}</td>
        <td>${change}</td>
        <td>${volume}</td>
        <td></td>
        <td>
          <input type="number" id="add-quantity-${name}" min="1" value="1">
          <img src="/img/plus.png" id ="add" alt="" onclick="addToCart('${name}')">
          <a href="/product-info/${name}"><img src="/img/info.png" id= "info" alt=""></a>
          <img src="/img/trash-can.png" id ="delete" alt="" onclick="deleteItem('${name}')">
          <img src="/img/edit.png" id = "edit" alt="" onclick="editItem('${name}')">
        </td>
      </tr>
    `;
    document.getElementById("product-table").insertAdjacentHTML("beforeend", newRowHTML);
    document.getElementById("new-row").style.display = "none";


    fetch(`/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProduct),
    })
      .then(response => {
        if (response.ok) {
          console.log('Product created successfully');
          // Perform any necessary UI updates
        } else {
          throw new Error('Error creating product');
        }
      })
      .catch(error => {
        console.error('Error creating product:', error);
      });
  
  }
  /////////////need to be fixed////////////////
  function editItem(productId) {
    // Get the row elements to be edited
    var nameElement = document.getElementById("name-" + productId);
    var descriptionElement = document.getElementById("description-" + productId);
    var symbolElement = document.getElementById("symbol-" + productId);
    var priceElement = document.getElementById("price-" + productId);
    var changeElement = document.getElementById("change-" + productId);
    var volumeElement = document.getElementById("volume-" + productId);
  
    // Get the current values
    
    var name = nameElement.innerText;
    var description = descriptionElement.innerText;
    var symbol = symbolElement.innerText;
    var price = priceElement.innerText;
    var change = changeElement.innerText;
    var volume = volumeElement.innerText;
  
    // Replace the elements with input fields containing the current values
    nameElement.innerHTML = "<input type='text' id='edit-name-" + productId + "' value='" + name + "'>";
    descriptionElement.innerHTML = "<input type='text' id='edit-description-" + productId + "' value='" + description + "'>";
    symbolElement.innerHTML = "<input type='text' id='edit-symbol-" + productId + "' value='" + symbol + "'>";
    priceElement.innerHTML = "<input type='number' id='edit-price-" + productId + "' value='" + price + "'>";
    changeElement.innerHTML = "<input type='text' id='edit-change-" + productId + "' value='" + change + "'>";
    volumeElement.innerHTML = "<input type='text' id='edit-volume-" + productId + "' value='" + volume + "'>";
    
    
    var saveBtn = document.getElementById(`save-${productId}`)
    saveBtn.style.display = 'block'
  }
  
  function saveEditedItem(productId) {
    var saveBtn = document.getElementById(`save-${productId}`)
    saveBtn.style.display = 'none'
    // Get the edited values
    var newName = document.getElementById("edit-name-" + productId).value;
    var newDescription = document.getElementById("edit-description-" + productId).value;
    var newSymbol = document.getElementById("edit-symbol-" + productId).value;
    var newPrice = document.getElementById("edit-price-" + productId).value;
    var newChange = document.getElementById("edit-change-" + productId).value;
    var newVolume = document.getElementById("edit-volume-" + productId).value;
  
    // Update the row elements with the new values
    var nameElement = document.getElementById("name-" + productId);
    var descriptionElement = document.getElementById("description-" + productId);
    var symbolElement = document.getElementById("symbol-" + productId);
    var priceElement = document.getElementById("price-" + productId);
    var changeElement = document.getElementById("change-" + productId);
    var volumeElement = document.getElementById("volume-" + productId);
  
    nameElement.innerHTML = newName;
    descriptionElement.innerHTML = newDescription;
    symbolElement.innerHTML = newSymbol;
    priceElement.innerHTML = newPrice;
    changeElement.innerHTML = newChange;
    volumeElement.innerHTML = newVolume;
  
  
    // Send the updated data to the backend
     updatedData = {
      name: newName,
      description: newDescription,
      symbol: newSymbol,
      price: newPrice,
      change: newChange,
      volume: newVolume,
    };
  
    fetch(`/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedData)
    })
      .then(response => {
        if (response.ok) {
          console.log("Product updated successfully");
        } else {
          throw new Error("Error updating product");
        }
      })
      .catch(error => {
        console.error("Error updating product:", error);
      });
  }
  