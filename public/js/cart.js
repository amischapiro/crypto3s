$(document).ready(function () {
  const currUserName = getCookie('currUserName');
  $('#curr-user-name').text(currUserName);  
});

function getCookie(name) {
  const cookies = document.cookie
  let k;
  for(let i =0;i<cookies.length;i++){
    if(cookies[i]=='='){
      k=i;
    }
  }
  let curr = cookies.slice(k+1,cookies.length)
  return curr;
}


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
          window.location.href = '/cart';
        } else {
          throw new Error('Error updating quantity');
        }
      })
      .catch(error => {
        console.error('Error updating quantity:', error);
      });
  }



 
function deleteItem(element,index) {
    const itemId = element.dataset.itemId;

    fetch(`/cart/${itemId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          const itemElement = document.getElementById(`cart-item-${index}`);
          itemElement.remove();
          
          window.location.href = '/cart';
  
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
  
  
  
  function checkout() {
    const currUserName = getCookie('currUserName');
  
    fetch('/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: currUserName }),
    })
      .then(response => {
        if (response.ok) {
          console.log('Order created successfully');
          checkoutModal()
          setTimeout(() => {
            const modal = document.getElementById('checkoutModal')
            modal.style.display = 'none'
            window.location.href = '/order-history';
          }, 2000);
        } else {
          throw new Error('Error creating order');
        }
      })
      .catch(error => {
        console.error('Error creating order:', error);
      });
  }
  

  function checkoutModal(){
    const modal = document.getElementById('checkoutModal')
    modal.style.display = 'block'
  }