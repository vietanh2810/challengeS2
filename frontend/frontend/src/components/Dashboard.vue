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
            <div class="d-block mt-4 justify-content-between py-3 px-4"
                style="margin-left: 2rem !important; background-color: #f8fafb; border-radius: 1rem;">
                <label style="margin: 0 0 0 2rem; font-weight: 500;">My graphs</label>
                <hr v-if="graphs.length === 0">
                <div  v-if="graphs.length === 0" class="d-flex" style="justify-content: space-evenly !important;">
                    No graph found
                    </div>              
                </div>
                <div class="d-flex" style="justify-content: space-evenly !important; margin-top: 1rem;">
                    <div v-if="graphs.length > 0" class="d-flex" style="justify-content: space-evenly !important;">
                        <div v-for="graph in graphs" :key="graph.id">
                            <LineChart :data="graph.data" :graphe="graph.graphe" :type="graph.graphe.graphe_type"/>
                        </div>
                    </div>
                </div>
        
                <div class="d-block mt-4 justify-content-between py-3 px-4"
                style="margin-left: 2rem !important; background-color: #f8fafb; border-radius: 1rem;">
                <label style="margin: 0 0 0 2rem; font-weight: 500;">My KPIs</label>
                <hr v-if="kpis.length === 0">
                <div  v-if="kpis.length === 0" class="d-flex" style="justify-content: space-evenly !important;">
                    No KPIs found
                    </div>              
                </div>
                <div class="d-flex" style="justify-content: space-evenly !important; margin-top: 1rem;">
                    <div v-if="kpis.length > 0" class="d-flex" style="justify-content: space-evenly !important;">
                        <div v-for="kpi in kpis" :key="kpi.id">
                            <KpiChart :name="kpi.kpi.name" :currentValue="kpi.data" :kpiValue="kpi.kpi.value" :start="kpi.kpi.start" :end="kpi.kpi.end"/>
                        </div>
                    </div>
                </div>

                <div class="d-block mt-4 justify-content-between py-3 px-4"
                style="margin-left: 2rem !important; background-color: #f8fafb; border-radius: 1rem;">
                <label style="margin: 0 0 0 2rem; font-weight: 500;">My heatmaps</label>
                <hr v-if="heatmaps.length === 0">
                <div  v-if="heatmaps.length === 0" class="d-flex" style="justify-content: space-evenly !important;">
                    No heatmap found
                    </div>              
                </div>
                <div class="d-flex" style="justify-content: space-evenly !important; margin-top: 1rem;">
                    <div v-if="heatmaps.length > 0" class="d-flex" style="justify-content: space-evenly !important;">
                        <div v-for="heatmap in heatmaps" :key="heatmap.heatmap.id">
                            <HeatMapChart :id="heatmap.heatmap.id" :screenResolution="heatmap.heatmap.resolution" :data="heatmap.data" />
                        </div>
                    </div>
                </div>
        </div>
    </div>
</template>
  
<script>
import Sidebar from './Sidebar.vue';
import LineChart from './CustomLineChart.vue';
import KpiChart from './KpiChart.vue';
import HeatMapChart from "./HeatMapChart.vue";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import DashboardService from '../services/dashboard.service';

export default {
    components: {
        Sidebar,
        LineChart,
        KpiChart,
        HeatMapChart,
    },
    data() {
        return {
            content: '',
            //set default value for date
            // J-7
            startDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().substr(0, 10),
            endDate: new Date().toISOString().substr(0, 10),
            step: 6,
            stepType: 'hour',
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
                this.heatmaps.forEach((heatmap) => {
                    heatmap.data.forEach((data) => {
                        if (data.location === "8x248.5") {
                            data.location = "708x248.5";
                        }
                    });
                });
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
    overflow: scroll;
    /* Add other styles for the content */
}
</style>
  
