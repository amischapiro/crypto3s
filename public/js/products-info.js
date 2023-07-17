function toProducts(){
  window.location.href = '/products'
}



document.addEventListener("DOMContentLoaded", function() {
  // Fetch product data
  fetch('/products/all')
    .then(response => response.json())
    .then(data => {
      const products = data.products;
      const currProductId = document.getElementById('product-info').dataset.id;

      // Find the current product in the products array
      let currIndex;
      products.forEach((product, i) => {
        if (product._id === currProductId) {
          currIndex = i;
        }
      });

      // Extract the price, change, and volume values for all products
      const productNames = products.map(product => product.name);
      const prices = products.map(product => product.price);
      const changes = products.map(product => product.change);
      const volumes = products.map(product => product.volume);

      // Create the price chart data
      const priceData = {
        labels: productNames,
        datasets: [
          {
            label: 'Prices',
            data: prices,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            fill: false,
            pointBackgroundColor: productNames.map((name, i) => (i === currIndex ? 'yellow' : 'rgba(255, 99, 132, 1)')),
            pointRadius: 4
          }
        ]
      };

      // Create the change chart data
      const changeData = {
        labels: productNames,
        datasets: [
          {
            label: 'Changes',
            data: changes,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            fill: false,
            pointBackgroundColor: productNames.map((name, i) => (i === currIndex ? 'yellow' : 'rgba(54, 162, 235, 0.5)')),
            pointRadius: 4
          }
        ]
      };

      // Create the volume chart data
      const volumeData = {
        labels: productNames,
        datasets: [
          {
            label: 'Volumes',
            data: volumes,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            fill: false,
            pointBackgroundColor: productNames.map((name, i) => (i === currIndex ? 'yellow' : 'rgba(75, 192, 192, 0.5)')),
            pointRadius: 4
          }
        ]
      };

      // Create the chart configuration for each chart
      const config1 = {
        type: 'line',
        data: priceData,
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      };
      const config2 = {
        type: 'line',
        data: changeData,
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      };
      const config3 = {
        type: 'line',
        data: volumeData,
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      };

      // Create the price chart
      const priceCtx = document.getElementById('priceChart').getContext('2d');
      const priceChart = new Chart(priceCtx, config1);

      // Update the chart configuration for the change chart

      // Create the change chart
      const changeCtx = document.getElementById('changeChart').getContext('2d');
      const changeChart = new Chart(changeCtx, config2);

      // Update the chart configuration for the volume chart

      // Create the volume chart
      const volumeCtx = document.getElementById('volumeChart').getContext('2d');
      const volumeChart = new Chart(volumeCtx, config3);
    })
    .catch(error => {
      console.error('Error fetching product data:', error);
    });
});














