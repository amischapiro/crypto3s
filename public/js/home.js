$(document).ready(function () {
  fetchCoinData();
  setInterval(fetchCoinData,10000)
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

function updateTableData(coinData) {
    coinData.forEach(coin => { 
    let coinSymbol = coin.symbol;
    let coinPrice = coin.rate
    let imageUrl = coin.image;
    console.log('imageUrl:', imageUrl);
    
    if(coin.rate<1){
      coinPrice = parseFloat(coin.rate).toFixed(8)
    }else{
      coinPrice = parseInt(coin.rate).toLocaleString();
    }
    const coinChange = coin.change_24h.toFixed(2);
    const coinVolume = coin.volume_24h.toLocaleString();

    // Update table data for each coin
    $('#' + coinSymbol + '-img').html(`<img src="${imageUrl}" alt="${coinSymbol}">`);
    $('#' + coinSymbol + '-sym').text(coinSymbol);
    $('#' + coinSymbol + '-rate').text('$' + coinPrice);
    $('#' + coinSymbol + '-vol').text('$' + coinVolume);

    // Update change percentage and color
    const changeElement = $('#' + coinSymbol + '-change');
    if (coinChange > 0) {
      changeElement.css('color', 'greenyellow');
      changeElement.text('+' + coinChange + '%');
    } else {
      changeElement.css('color', 'red');
      changeElement.text(coinChange + '%');
    }
  });
}

function fetchCoinData() {  
  $.ajax({
    url: '/coin-rates',
    method: 'GET',
    success: function (response) {
      const coinData = Object.values(response);
      
      updateTableData(coinData);
    },
    error: function (error) {
      console.log('Error:', error);
    }
  });
}





function createTextPost() {
  const message = document.getElementById('fb-msg').value; 
  if(!message){
    return
  }
  fetch('/create-post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: message }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('Text post created successfully!');
        console.log('Post ID:', data.postId);
        fbModal(true)
      } else {
        console.log('Error creating text post:', data.error);
        fbModal(false)
      }
    })
    .catch(error => {
      console.log('An error occurred:', error.message);
      fbModal(false)
    });
}

function fbModal(success){
  const modal = document.getElementById('fb-modal-text')
  modal.innerText = success? 'Your post was created successfully':'Error: Something went wrong with your facebook post'
  modal.style.color = success?'black':'red'
  modal.style.display = 'block'
  setTimeout(() => {
    modal.style.display = 'none'
  }, 1500);
}