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
  