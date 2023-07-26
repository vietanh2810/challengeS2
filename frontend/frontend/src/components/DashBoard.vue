<template>
    <div class="dashboard">
        <Sidebar />
        <div class="content">
            <div class="mt-4"
                style="background-color: #f8fafb; height: 80px !important; width: 100%; margin-left: 2rem !important; border-radius: 1rem;">
                <label style="margin: 1.5rem 0 0 2rem; font-size: 21px; font-weight: 500;">DASHBOARD</label>
            </div>
            <!-- Dashboard content goes here -->
            <div class="mt-4 col-3"
                style="background-color: #f8fafb; height: 140px !important; width: 100%; margin-left: 2rem !important; border-radius: 1rem;">
                <label style="margin: 1rem 0 0 2rem; font-weight: 500;">Filtres de la page</label>
                <div class="d-flex" style="margin: 0.5rem 0 0 2rem !important;">
                    <div class="d-block col-2">
                        <label style="margin: 0.5rem 0 0 0; width: 70% !important;">Date de début</label>
                        <input type="date"
                            style="width: 100% !important; height: 40px !important; border-radius: 0.5rem; border: 1px solid #d2d6dc;" />
                    </div>
                    <div class="d-block col-2" style="margin-left: 2rem !important;">
                        <label style="margin: 0.5rem 0 0 0; width: 70%;">Date de fin</label>
                        <input type="date"
                            style="width: 100% !important; height: 40px !important; border-radius: 0.5rem; border: 1px solid #d2d6dc;" />
                    </div>
                    <!-- <div class="d-block col-2" style="margin-left: 2rem !important;">
                        <label style="margin: 0.5rem 0 0 0;">Type de graphique</label>
                        <select
                            style="width: 100% !important; height: 40px !important; border-radius: 0.5rem; border: 1px solid #d2d6dc;">
                            <option value="pie">Camembert</option>
                            <option value="line">Ligne</option>
                        </select>
                    </div>
                    <div class="d-block col-2" style="margin-left: 2rem !important;">
                        <label style="margin: 0.5rem 0 0 0;">Type de données</label>
                        <select
                            style="width: 100% !important; height: 40px !important; border-radius: 0.5rem; border: 1px solid #d2d6dc;">
                            <option value="pie">Camembert</option>
                            <option value="line">Ligne</option>
                        </select>
                    </div> -->
                    <div>
                        <button v-tracker="{ tag: 'applyButton'}" class="btn btn-primary"
                            style="margin: 1.5rem 0 0 2rem; width: 100px; height: 40px; border-radius: 0.5rem;">Apply</button>
                    </div>
                    <div>
                        <button v-tracker="{ tag: 'resetButton'}" class="btn btn-primary"
                            style="margin: 1.5rem 0 0 2rem; width: 100px; height: 40px; border-radius: 0.5rem;">Reset</button>
                    </div>
                </div>
            </div>
            <div class="d-flex mt-4 justify-content-between py-3 px-4"
                style="margin-left: 2rem !important; background-color: #f8fafb; border-radius: 1rem;">
                <PieChart :chartData="data" :chartOptions="options" />
                <LineChart style="margin-left: 2rem;" :chart-data="chartData" :chart-options="chartOptions"></LineChart>
                <BarChart style="margin-left: 2rem;" :chart-data="chartData" :chart-options="chartOptions"></BarChart>
            </div>

            <div class="d-flex mt-4 justify-content-between py-3 px-4"
                style="margin-left: 2rem !important; background-color: #f8fafb; border-radius: 1rem;">
                <li v-for="item in tagList">
                    {{ item.comment }}
                </li>
            </div>

        </div>
    </div>
</template>
  
<script>
import Sidebar from './Sidebar.vue';
import PieChart from './CustomPieChart.vue';
import LineChart from './CustomLineChart.vue';
import BarChart from './CustomBarChart.vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';

export default {
    components: {
        Sidebar,
        PieChart,
        LineChart,
        BarChart
    },
    data() {
        return {
            tagList: null,
            piechartDate: null,
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
            },
            chartData: {
                labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                datasets: [
                    {
                        label: 'Page Views',
                        data: [120, 180, 150, 200, 250, 220, 180],
                        backgroundColor: 'rgba(54, 162, 235, 0.2)', // Background color of the line chart
                        borderColor: 'rgba(54, 162, 235, 1)', // Border color of the line
                        borderWidth: 2 // Border width of the line
                    }
                ]
            },
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 300 // Maximum value on the y-axis
                    }
                }
            }
        };
    },
    mounted() {
        fetch('http://localhost:8080/api/tags/');
        this.tagList  = this.data.tagList;
        this.$tracker.trackPageView('/example-page', 'Example Page');
    },
    async onMounted() {
        const response = await fetch('http://localhost:8080/api/tags/', {
            headers: {
                "Content-type": 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjkwMzYwNzE0LCJleHAiOjE3NzY3NjA3MTR9.u53jYBfU7uVtF3Qgax1_GPoJlmqhQn_rj1dJbTBAsHo'
            }
        });
        console.log("response: "+response);
        const data = await response.json();
        tags.push(...data);
        
    }
};
</script>

<style scoped>
.dashboard {
    display: flex;
}

.content {
    position: fixed;
    top: 0;
    left: 78px;
    /* Adjust the value as needed */
    right: 0;
    bottom: 0;
    background-color: #e6e8ea;
    /* Add other styles for the content */
}
</style>
  