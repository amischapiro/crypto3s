var newProduct = {
  name:"",
  description:"",
  symbol:"",
  price:null,
  change:"",
  volume:""
};
function addToCart(productId,name) {    
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
          addModal(name)
          console.log('Product added to cart');
        } else {
          throw new Error('Error adding product to cart');
        }
      })
      .catch(error => {
        console.error('Error adding product to cart:', error);
      });
  }

  function addModal(name){
    const modal = document.getElementById('addModal')
    const modalCoin = document.getElementById('addModal-coin')
    modal.style.display = 'block'
    modalCoin.innerText = 'Coin '+name;
    setTimeout(() => {
      modal.style.display = 'none'
    }, 2000);
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


    fetch('/products', {
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