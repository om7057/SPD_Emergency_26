import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
} from "chart.js";

ChartJS.register(
  TimeScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale
);

const EmotionChart = ({ emotionTimeline = [] }) => {
  const emotionCount = {};

  emotionTimeline.forEach(({ emotion }) => {
    emotionCount[emotion] = (emotionCount[emotion] || 0) + 1;
  });

  const chartData = {
    labels: Object.keys(emotionCount),
    datasets: [
      {
        label: "Emotion Frequency",
        data: Object.values(emotionCount),
        backgroundColor: "rgba(75,192,192,0.6)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="w-full md:w-2/3 mx-auto mt-8">
      <h3 className="text-lg font-semibold mb-4 text-center">
        📊 Emotion Analysis Summary
      </h3>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Frequency",
              },
            },
            x: {
              title: {
                display: true,
                text: "Emotion",
              },
            },
          },
        }}
      />
    </div>
  );
};

export default EmotionChart;
