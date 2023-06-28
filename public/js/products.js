
let selectedImg = false;
let isNewImg =0;

var newProduct = {
  img:"",
  name:"",
  description:"",
  symbol:"",
  price:null,
  change:"",
  volume:"",
};
var updatedData = {
  img:"",
  name:"",
  description:"",
  symbol:"",
  price:null,
  change:"",
  volume:"",
};
  
function addToCart(productId,name) {    
    const quantityInput = document.getElementById(`add-quantity-${productId}`)
    quantity = quantityInput.value;
    if(quantity<=0){
      return;
    }
    
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
    // modal.style.display = 'block'
    modalCoin.innerText = 'Coin '+name;
    modal.classList.add('show');
    setTimeout(() => {
      // modal.style.display = 'none'
      modal.classList.remove('show');
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
          window.location.href = '/products';
        } else {
          throw new Error('Error deleting item');
        }
      })
      .catch(error => {
        console.error('Error deleting item:', error);
      });
  }

  function addNewCoin() {
    document.getElementById("new-coin-row").style.display = "table-row";
  }
  
  function saveNewItem() {
    isNewImg = 0;
    var img = selectedImg;
    var name = document.getElementById("new-name").value;
    var description = document.getElementById("new-description").value;
    var symbol = document.getElementById("new-symbol").value;
    var price = document.getElementById("new-price").value;
    var change = document.getElementById("new-change").value;
    var volume = document.getElementById("new-volume").value;
    
    const errorModal = document.getElementById('error-modal')
    const errorMsg = document.getElementById('error-msg')
    
    if (!name ||!description ||!symbol|| !price || !change || !volume) {
      errorMsg.innerText = "Error: Some fields are missing."
      errorModal.style.display = 'block'
      console.error("Error: Some fields are missing.");
      return;
    }
    
    if (symbol.length > 4) {
      errorMsg.innerText = "Error: Symbol must be up to 4 letters."
      errorModal.style.display = 'block'
      console.error("Error: Symbol must be under 4 letters.");
      return;
    }
    
    if (isNaN(change)) {
      errorMsg.innerText = "Error: Change must be a number."
      errorModal.style.display = 'block'
      console.error("Error: Change must be a number.");
      return;
    }
    
    if (price <= 0 || volume <= 0) {
      errorMsg.innerText = "Error: Price and volume must be positive numbers."
      errorModal.style.display = 'block'
      console.error("Error: Price and volume must be positive numbers.");
      return;
    }
    if(!img ||img==-1){
      img = 'dollar.png'
    }

    newProduct.img = img
    newProduct.name = name
    newProduct.description = description
    newProduct.symbol = symbol
    newProduct.price = price 
    newProduct.change = change
    newProduct.volume = volume

    document.getElementById("new-coin-row").style.display = "none";

    
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
        window.location.href = '/products';
      }else if(response.status === 409){
      errorMsg.innerText = "Error: A coin with that name already exists."
      errorModal.style.display = 'block'
      console.error("Error: A coin with that name already exists.");
      } else{
        throw new Error('Error creating product');
        }
      })
      .catch(error => {
        console.error('Error creating product:', error);
      });
  
  }

  function searchProducts() {
    const searchInput = document.getElementById('search-input');
    const searchQuery = searchInput.value.toLowerCase();
    const filterSelect = document.getElementById('filter-select');
    const filterOption = filterSelect.value;
    const tableRows = document.querySelectorAll('#product-table tbody tr');
  
    tableRows.forEach(row => {
      const name = row.querySelector('td:first-child').innerText.toLowerCase();
      const description = row.querySelector('td:nth-child(2)').innerText.toLowerCase();
      const symbol = row.querySelector('td:nth-child(3)').innerText.toLowerCase();
  
      let filterValue = '';
      if (filterOption === 'name') {
        filterValue = name;
      } else if (filterOption === 'description') {
        filterValue = description;
      } else if (filterOption === 'symbol') {
        filterValue = symbol;
      }
  
      if (filterValue.includes(searchQuery)) {
        row.style.display = 'table-row';
      } else {
        row.style.display = 'none';
      }
    });
  }

  const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', searchProducts);

function sortProducts() {
  const sortSelect = document.getElementById('sort-select');
  const sortOption = sortSelect.value;
  const tableBody = document.querySelector('#product-table tbody');  
  const tableRows = Array.from(tableBody.querySelectorAll('tr'));

  tableRows.sort((rowA, rowB) => {
    const valueA = rowA.querySelector(`td[data-${sortOption}]`).dataset[sortOption];
    const valueB = rowB.querySelector(`td[data-${sortOption}]`).dataset[sortOption];

    if (sortOption === 'price' || sortOption === 'volume' || sortOption === 'change') {
      return parseFloat(valueB) - parseFloat(valueA);
    } else {
      return valueA.localeCompare(valueB);
    }
  });

  tableRows.forEach(row => {
    row.remove();
  });

  tableRows.forEach(row => {
    tableBody.appendChild(row);
  });
}

  function editItem(productId) {
    isNewImg = 1
    // Get the row elements to be edited
    var imgElement = document.getElementById("img-"+productId);
    var nameElement = document.getElementById("name-" + productId);
    var descriptionElement = document.getElementById("description-" + productId);
    var symbolElement = document.getElementById("symbol-" + productId);
    var priceElement = document.getElementById("price-" + productId);
    var changeElement = document.getElementById("change-" + productId);
    var volumeElement = document.getElementById("volume-" + productId);
  
    // Get the current values
    
    var img = imgElement.dataset.img
    var name = nameElement.innerText;
    var description = descriptionElement.innerText;
    var symbol = symbolElement.innerText;
    var price = priceElement.dataset.price;
    var change = changeElement.dataset.change;
    var volume = volumeElement.dataset.volume;
  
    // Replace the elements with input fields containing the current values

    imgElement.innerHTML = `<button onclick='showImages()'>Choose Image</button><span class='chosen-img'><img src="/coin-img/${img}" alt=""></img></span>`
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
    var newImg =  selectedImg
    var newName = document.getElementById("edit-name-" + productId).value;
    var newDescription = document.getElementById("edit-description-" + productId).value;
    var newSymbol = document.getElementById("edit-symbol-" + productId).value;
    var newPrice = document.getElementById("edit-price-" + productId).value;
    var newChange = document.getElementById("edit-change-" + productId).value;
    var newVolume = document.getElementById("edit-volume-" + productId).value;


    const errorModal = document.getElementById('error-modal')
    const errorMsg = document.getElementById('error-msg')

    if (!newName ||!newDescription ||!newSymbol|| !newPrice || !newChange || !newVolume) {
      errorMsg.innerText = "Error: Some fields are missing."
      errorModal.style.display = 'block'
      console.error("Error: Some fields are missing.");
      saveBtn.style.display = 'block'
      return;
    }
    
    if (newSymbol.length > 4) {
      errorMsg.innerText = "Error: Symbol must be up to 4 letters."
      errorModal.style.display = 'block'
      console.error("Error: Symbol must be under 4 letters.");
      saveBtn.style.display = 'block'
      return;
    }
    
    if (isNaN(newChange)) {
      errorMsg.innerText = "Error: Change must be a number."
      errorModal.style.display = 'block'
      console.error("Error: Change must be a number.");
      saveBtn.style.display = 'block'
      return;
    }
    
    if (newPrice <= 0 || newVolume <= 0) {
      errorMsg.innerText = "Error: Price and volume must be positive numbers."
      errorModal.style.display = 'block'
      console.error("Error: Price and volume must be positive numbers.");
      saveBtn.style.display = 'block'
      return;
    }
  
    if(!newImg){
      newImg = 'dollar.png'
    }
  
  
      updatedData = {
      img:newImg,
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
          window.location.href = '/products';
        }else if(response.status === 409){
          errorMsg.innerText = "Error: A coin with that name already exists."
          errorModal.style.display = 'block'
          console.error("Error: A coin with that name already exists.");
          saveBtn.style.display = 'block'
          } else {
          throw new Error("Error updating product");
        }
      })
      .catch(error => {
        console.error("Error updating product:", error);
      });
  }
  

  function exitModal(){
    const errorModal = document.getElementById('error-modal')
    const errorMsg = document.getElementById('error-msg')
    errorMsg.innerText = ""
    errorModal.style.display = 'none'
  }


  function showImages(){
    const images = document.getElementById('images-container')
    images.style.display ='grid'

  }

  function selectImage(img,num){
    const images = document.getElementById('images-container')
    images.style.display ='none'
    selectedImg = img;    
    const chosen = document.querySelectorAll('.chosen-img')
    console.log('isNewImg:', isNewImg);
    chosen[isNewImg].innerHTML = `<img src="/coin-img/${selectedImg}" alt=""></img>`
  }