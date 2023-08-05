<template>
    <div v-if="type === 'time_span'" id="myChartContainer">
        <div style="color: black; text-align: center;">
            <label>{{ graphe.name }}</label>
        </div>
        <hr style="margin: 5px 0 !important;" />
        <Line class="line-chart" :data="filteredData" :options="options" />
    </div>
    <div v-else class="custom-box">
        <div class="header">
            <div class="graph-name">{{ graphe.name }}</div>
            <div class="chip">All Time</div>
        </div>
        <hr>
        <div class="data-value">{{ data }}</div>
        <hr>
        
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
            options: {
                responsive: true,
                maintainAspectRatio: false,
            },
        };
    },
    props: {
        data: {
            type: [Object, Number],
            default: () => {},
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        graphe: {
            type: Object,
            default: () => {},
            required: true,
        }
    },
    computed: {
        filteredData() {
            if (this.type === 'all_time') {
                return this.data; 
            }
            else if (this.type === 'time_span') {
                let label = this.data.map((item) => {
                    // const tdate = new Date(item.tdate);
                    // const label = tdate.toLocaleDateString(); // Adjust the date format if needed
                    return item.tdate;
                });
                let datasets = [
                    {
                        label: this.graphe.name,
                        data: this.data.map((item) => item.count),
                        borderColor: 'rgba(54, 162, 235, 1)',
                        fill: false,
                    }
                ];
                return {
                    labels: label,
                    datasets: datasets,
                };
            }
        }
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
    height: 200px !important;
}

.custom-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid #ccc;
    border-radius: 10px;
    width: 200px;
    height: 200px;
    padding: 10px;
    margin-top: 30px;
    box-sizing: border-box;
    background-color: #f8fafb;
    color: #333; /* Text color for custom-box content */
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    width: 100%;
}

.graph-name {
    font-size: 14px;
    font-weight: bold;
}

.chip {
    padding: 5px 10px;
    border-radius: 15px;
    background-color: #00cc66; /* Green chip background color */
    color: #fff; /* White text color for the chip */
    font-weight: bold;
}

.data-value {
    font-size: 2rem;
    font-weight: bold;
    color: #00cc66; /* Green color for data value */
}
</style>