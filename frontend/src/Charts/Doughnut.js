import { Bar } from "react-chartjs-2";
import { Chart, registerables, defaults } from "chart.js";
Chart.register(...registerables);

function handleClick(evt)
{
    var activeElement = Chart.getElementAtEvent(evt);
    console.log(activeElement);
    console.log("Goop!");
  }

defaults.font.size = 12;
const DoughnutChart = (props) => {
  let { labels_in, data_in, title_in } = props;
  const data = {
    labels: labels_in,
    datasets: [
      {
        label: title_in,
        data: data_in,
        backgroundColor: [
          "rgba(255, 99, 132, 0.4)",
          "rgba(255, 159, 64, 0.4)",
          "rgba(255, 205, 86, 0.4)",
          "rgba(51, 191, 38, 0.4)",
          "rgba(75, 192, 192, 0.4)",
          "rgba(54, 162, 235, 0.4)",
          "rgba(156, 131, 204, 0.4)",
          "rgba(153, 102, 255, 0.4)",
          "rgba(201, 203, 207, 0.4)",
          "rgba(82, 75, 69, 0.4)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgba(51, 191, 38)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgba(156, 131, 204)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
          "rgba(82, 75, 69)",
        ],
        borderWidth: 1,
      },
    ],
  };
  const options = {
    plugins: {
      legend: {
        display: false
      }
    },
    onClick: handleClick
  };

  return (
    <div>
      <Bar data={data} options={options}/>
    </div>
  );
};

export default DoughnutChart;
