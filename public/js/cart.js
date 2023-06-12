
function updateQuantity(inputElement) {
    const quantity = inputElement.value;
    const itemId = inputElement.dataset.itemId;
    
    
    fetch(`/cart/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity }),
    })
      .then(response => {
        if (response.ok) {
          console.log('Quantity updated successfully');
        } else {
          throw new Error('Error updating quantity');
        }
      })
      .catch(error => {
        console.error('Error updating quantity:', error);
      });
  }


//   function deleteItem(element){
//     const itemId = element.dataset.itemId
//     fetch(`/cart/${itemId}`, {
//         method: 'DELETE',
//       })
//         .then(response => {
//           if (response.ok) {
//             console.log('Item deleted successfully');
//             // Optionally, you can update the UI here to remove the deleted item from the cart
//           } else {
//             throw new Error('Error deleting item');
//           }
//         })
//         .catch(error => {
//           console.error('Error deleting item:', error);
//         });
//   }
 
function deleteItem(element,index) {
    const itemId = element.dataset.itemId;
// console.log('index:', index);

    fetch(`/cart/${itemId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          // Remove the item element from the DOM
          const itemElement = document.getElementById(`cart-item-${index}`);
          itemElement.remove();
          
          // Update the item count and total price
          updateItemCount();
          calculateTotalPrice();
  
          console.log('Item deleted successfully');
        } else {
          throw new Error('Error deleting item');
        }
      })
      .catch(error => {
        console.error('Error deleting item:', error);
      });
  }

  function updateItemCount() {
    const itemCountElement = document.getElementById('item-count');
    const cartItems = document.querySelectorAll('.cart-item');
    const itemCount = cartItems.length;
  
    itemCountElement.textContent = itemCount;
  }
  
  
  
  function calculateTotalPrice() {
    const totalPriceElement = document.getElementById('total-price');
    const cartItems = document.querySelectorAll('.cart-item');
    let totalPrice = 0;
  
    cartItems.forEach(item => {
      const priceElement = item.querySelector('.item-subtotal p');
      const priceText = priceElement.textContent.substring(10);
      const price = parseInt(priceText.replace('$', ''));
  
      if (!isNaN(price)) {
        totalPrice += price;
      }
    });
  
    totalPriceElement.textContent = totalPrice;
  }
  
  
  