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

    // var newRowHTML = `
    //   <tr>
    //     <td>${name}</td>
    //     <td>${description}</td>
    //     <td>${symbol}</td>
    //     <td>${price}</td>
    //     <td>${change}</td>
    //     <td>${volume}</td>
    //     <td></td>
    //     <td>
    //       <input type="number" id="add-quantity-${name}" min="1" value="1">
    //       <img src="/img/plus.png" id ="add" alt="" onclick="addToCart('${name}')">
    //       <a href="/product-info/${name}"><img src="/img/info.png" id= "info" alt=""></a>
    //       <img src="/img/trash-can.png" id ="delete" alt="" onclick="deleteItem('${name}')">
    //       <img src="/img/edit.png" id = "edit" alt="" onclick="editItem('${name}')">
    //     </td>
    //   </tr>
    // `;
    // document.getElementById("product-table").insertAdjacentHTML("beforeend", newRowHTML);
    document.getElementById("new-coin-row").style.display = "none";

    console.log('newProduct:', newProduct);
    
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
        } else {
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







