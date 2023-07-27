<template>
    <div id="myChartContainer" :style="cssVars">
        <div style="color: black; text-align: center;">
            <label>{{ label }}</label>
        </div>
        <hr style="margin: 5px 0 !important;" />
        <Line class="line-chart" :data="dataGraph" :options="options" />
    </div>
</template>
  
<script>
import { Chart, LineController, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { Line } from 'vue-chartjs';

Chart.register(
    LineController,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

export default {
    name: 'LineChart',
    components: {
        Line,
    },
    data() {
        return {
            dataGraph: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    {
                        label: 'Page Views',
                        data: [120, 180, 150, 200, 250, 220, 180],
                        borderColor: 'rgba(54, 162, 235, 1)',
                        fill: false,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            },
            label: 'Line Chart',
            chartWidth: '',
            chartHeight: '',
        };
    },
    props: {
        width: {
            type: String,
            default: '550px',
        },
        height: {
            type: String,
            default: '350px',
        },
        data: {
            type: Object,
            default: () => {},
        },
    },
    mounted() {
        this.chartWidth = this.width;
        this.chartHeight = this.height;
        this.dataGraph = this.data;
    },
    computed: {
        cssVars() {
            return {
                width: this.chartWidth,
                height: this.chartHeight,
                backgroundColor: '#f8fafb',
                padding: '0'
            };
        },
    },
};
</script>
  
<style scoped>
#myChartContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
}

.line-chart {
    width: 100%;
    height: 300px !important;
}
</style>
  