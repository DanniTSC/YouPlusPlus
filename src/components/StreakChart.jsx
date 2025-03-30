import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Title,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Title);

const StreakChart = ({ data }) => {
  const labels = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Obiceiuri completate',
        data: data, // [3, 5, 7, 2, 6, 4, 0] – exemplu
        backgroundColor: '#56C0BC',
        borderRadius: 6,
        barThickness: 30,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 2,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4 text-[#8E1C3B]">Progresul săptămânal</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default StreakChart;
