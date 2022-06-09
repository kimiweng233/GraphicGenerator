import { Bar } from "react-chartjs-2";
import {Chart, registerables} from 'chart.js'
Chart.register(...registerables);

const DoughnutChart = props => {
    let { labels_in, data_in } = props;
    const data = {
        labels: labels_in,
        datasets: [{
            data: data_in,
            backgroundColor: [
            'red',
            'orange',
            'yellow',
            'green',
            'skyblue',
            'blue',
            'purple',
            'grey'
            ],
            borderColor: [
            'red',
            'orange',
            'yellow',
            'green',
            'skyblue',
            'blue',
            'purple',
            'grey'
            ],
            borderWidth: 1
        }]
    };

    return (
        <div>
            <Bar data={data} />
        </div>
    )
}

export default DoughnutChart;