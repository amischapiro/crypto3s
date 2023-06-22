document.addEventListener("DOMContentLoaded", function() {
    // Get the canvas element
    const canvas = document.getElementById("myChart");
  
    // Create the chart
    const ctx = canvas.getContext("2d");
    const myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday","Saturday"],
        datasets: [
          {
            label: "7D chart",
            data: [30, 20, 25, 15, 10, 12,2],
            borderColor: "red",
            borderWidth: 2,
            fill: false,
          },
        ],
      },
      options: {
        responsive: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  });
  