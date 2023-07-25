<template>
    <div id="myChartContainer" style="width: 300px; height: 350px; background-color: #f8fafb
;">
        <div style="color: black; text-align: center;">
            <label>{{ this.label }}</label>
        </div>
        <hr style="margin: 5px 0 !important;" />
        <Pie class="pie-chart" :data="data" :options="options" />
    </div>
</template>

<script>
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'vue-chartjs';

Chart.register(ArcElement, Tooltip, Legend);

export default {
    name: 'App',
    components: {
        Pie,
    },
    data() {
        return {
            data: {
                labels: ['Red', 'Blue', 'Yellow'],
                datasets: [
                    {
                        data: [300, 50, 100],
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
            },
            label: 'Pie Chart',
            chartWidth: '400', // Default width
            chartHeight: '400', // Default height
        };
    },
    props: {
        width: {
            type: String,
            default: '40',
        },
        height: {
            type: String,
            default: '40',
        },
    },
    mounted() {
        this.chartWidth = this.width;
        this.chartHeight = this.height;
        this.data = this.$props.chartData;
        this.options = this.$props.chartOptions;
    },
    computed: {
        cssVars() {
            return {
                '--width': this.chartWidth,
                '--height': this.chartHeight,
            }
        },
    },
};
</script>


