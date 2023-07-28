<template>
    <div class="dashboard">
        <Sidebar />
        <div class="content">
            <div class="mt-4"
                style="background-color: #f8fafb; height: 80px !important; width: 100%; margin-left: 2rem !important; border-radius: 1rem;">
                <label style="margin: 1.5rem 0 0 2rem; font-size: 21px; font-weight: 500;">DASHBOARD</label>
            </div>
            <!-- Dashboard content goes here -->
            <div class="mt-4 col-12"
                style="background-color: #f8fafb; height: 140px !important; width: 100%; margin-left: 2rem !important; border-radius: 1rem;">
                <label style="margin: 1rem 0 0 2rem; font-weight: 500;">Filtres de la page</label>
                <div class="d-flex" style="margin: 0.5rem 0 0 1rem !important;">
                    <div class="d-block col-2">
                        <label style="margin: 0.5rem 0 0 0; width: 70% !important;">Start date</label>
                        <input type="date" v-model="startDate" class="form-control"
                            style="width: 100% !important; height: 40px !important; border-radius: 0.5rem; border: 1px solid #d2d6dc;" />
                    </div>
                    <div class="d-block col-2">
                        <label style="margin: 0.5rem 0 0 0; width: 70% !important;">End date</label>
                        <input type="date" v-model="endDate" class="form-control"
                            style="width: 100% !important; height: 40px !important; border-radius: 0.5rem; border: 1px solid #d2d6dc;" />
                    </div>
                    <div class="d-block col-1">
                        <label style="margin: 0.5rem 0 0 0; width: 70% !important;">Step</label>
                        <input type="number" v-model="step" class="form-control"
                            style="width: 100% !important; height: 40px !important; border-radius: 0.5rem; border: 1px solid #d2d6dc;"
                            min="1" max="24" />
                    </div>
                    <div class="d-block col-1">
                        <label style="margin: 0.5rem 0 0 0; width: 70% !important;">Step</label>
                        <select v-model="stepType" class="form-select"
                            style="width: 100% !important; height: 40px !important; border-radius: 0.5rem; border: 1px solid #d2d6dc;">
                            <option value="hour">Hour</option>
                            <option value="day">Day</option>
                            <option value="week">Week</option>
                            <option value="month">Month</option>
                        </select>
                    </div>
                    <div>
                        <button class="btn btn-primary" style="margin: 2rem 0 0 0; width: 100px !important;"
                            @click="getDashBoard()">Apply</button>
                    </div>
                </div>
            </div>
            <div class="d-flex mt-4 justify-content-between py-3 px-4"
                style="margin-left: 2rem !important; background-color: #f8fafb; border-radius: 1rem;">
                <label style="margin: 1rem 0 0 2rem; font-weight: 500;">My KPIs</label>
            </div>
            <div class="d-flex mt-4 justify-content-between py-3 px-4"
                style="margin-left: 2rem !important; background-color: #f8fafb; border-radius: 1rem;">
                <label style="margin: 1rem 0 0 2rem; font-weight: 500;">My Graphs</label>
            </div>
            <div class="d-flex mt-4 justify-content-between py-3 px-4"
                style="margin-left: 2rem !important; background-color: #f8fafb; border-radius: 1rem;">
                <label style="margin: 1rem 0 0 2rem; font-weight: 500;">My Headtmaps</label>
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
import DashboardService from '../services/dashboard.service';

export default {
    components: {
        Sidebar,
        PieChart,
        LineChart,
        BarChart
    },
    data() {
        return {
            content: '',
            //set default value for date
            // J-7
            startDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().substr(0, 10),
            endDate: new Date().toISOString().substr(0, 10),
            step: 1,
            stepType: 'day',
            kpis: {},
            heatmaps: {},
            graphs: {},
        };
    },
    mounted() {
        // this.$tracker.trackPageView('/example-page', 'Example Page');
        this.getDashBoard();
    },
    methods: {
        getDashBoard() {
            const req = {
                start: this.startDate,
                end: this.endDate,
                step: this.step,
                step_type: this.stepType,
            }

            DashboardService.getDashBoard(req).then(
            (response) => {
                const { kpis, heatmaps, graphes} = response.data;
                this.kpis = kpis;
                this.heatmaps = heatmaps;
                this.graphs = graphes;
            },
            (error) => {
                this.datas =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
            });
        }
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
  
