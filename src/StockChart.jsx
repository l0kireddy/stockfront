import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend, Filler);

function StockChart({ dates, prices, symbol }) {
  const data = {
    labels: dates,
    datasets: [
      {
        label: `${symbol} - 7 Day Price Trend`,
        data: prices,
        borderColor: (chart) => {
          const index = chart.data.datasets.findIndex(dataset => dataset.data === prices);
          if (index > -1) {
            const dataPoints = chart.data.datasets?.[index]?.data || [];
            if (dataPoints.length > 1) {
              const lastPrice = dataPoints.at(-1);
              const previousPrice = dataPoints.at(-2);
              return lastPrice > previousPrice ? 'green' : lastPrice < previousPrice ? 'red' : '#0070f3';
            }
          }
          return '#0070f3';
        },
        backgroundColor: (chart) => {
          const index = chart.data.datasets.findIndex(dataset => dataset.data === prices);
          if (index > -1) {
            const dataPoints = chart.data.datasets?.[index]?.data || [];
            if (dataPoints.length > 1) {
              const lastPrice = dataPoints.at(-1);
              const previousPrice = dataPoints.at(-2);
              return lastPrice > previousPrice
                ? 'rgba(0, 255, 0, 0.2)'
                : lastPrice < previousPrice
                ? 'rgba(255, 0, 0, 0.2)'
                : 'rgba(0, 112, 243, 0.1)';
            }
          }
          return 'rgba(0, 112, 243, 0.1)';
        },
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        beginAtZero: false,
        grid: { color: '#e0e0e0' },
        ticks: {
          callback: (val) => `$${val}`,
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context) => `$${context.raw}`,
        },
      },
    },
  };

  return <Line data={data} options={options} />;
}

export default StockChart;
