// Register only the components used by SEEDS; keep this behind a dynamic import.
import {
  Chart, LineController, BarController, DoughnutController, RadarController,
  LineElement, BarElement, ArcElement, PointElement,
  CategoryScale, LinearScale, RadialLinearScale, Filler, Legend, Tooltip,
} from 'chart.js';

Chart.register(
  LineController, BarController, DoughnutController, RadarController,
  LineElement, BarElement, ArcElement, PointElement,
  CategoryScale, LinearScale, RadialLinearScale, Filler, Legend, Tooltip
);

export default Chart;
