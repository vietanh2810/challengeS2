<template>
    <div id="myChartContainer" :style="cssVars">
        <div style="color: black; text-align: center;">
            <label>{{ label }}</label>
        </div>
        <hr style="margin: 5px 0 !important;" />
        <Bar class="bar-chart" :data="data" :options="options" />
    </div>
</template>
  
<script>
import { Chart, BarController, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'vue-chartjs';

Chart.register(
    BarController,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
);

export default {
    name: 'BarChart',
    components: {
        Bar,
    },
    data() {
        return {
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    {
                        label: 'Page Views',
                        data: [120, 180, 150, 200, 250, 220, 180],
                        backgroundColor: 'rgba(54, 162, 235, 0.8)',
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 50,
                        },
                    },
                },
            },
            label: 'Bar Chart',
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
    },
    mounted() {
        this.chartWidth = this.width;
        this.chartHeight = this.height;
    },
    computed: {
        cssVars() {
            return {
                width: this.chartWidth,
                height: this.chartHeight,
                backgroundColor: '#f8fafb',
                padding: '0',
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

.bar-chart {
    width: 100%;
    height: 300px !important;
}
</style>
  