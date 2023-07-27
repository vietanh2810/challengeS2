<template>
  <div class="dashboard">
    <Sidebar />
    <div class="content">
      <div
        class="mt-4"
        style="
          background-color: #f8fafb;
          height: 80px !important;
          width: 100%;
          margin-left: 2rem !important;
          border-radius: 1rem;
        "
      >
        <label style="margin: 1.5rem 0 0 2rem; font-size: 21px; font-weight: 500">Kpis</label>
        <!-- <button><i class="bi bi-2-square"></i>Nouveau Kpi</button> -->
        <Modal>
          <template #activator="{ openModal }">
              <button class="btn btn-info btn-newKpi" @click="openModal">Ajouter un tunnel de conversion</button>
          </template>
          <template v-slot:actions="{ closeModal }">
              
              <button class="btn btn-danger" title="Fermer" @click="closeModal">Fermer</button>
          </template>
          <Form @submit="createKpi" :validation-schema="schema" style="padding: 1.5em;">
            <div class="form-group">
              <div class="form-group">
                <label for="name">Nom :</label>
                <Field
                  name="name"
                  v-model="kpiData.name"
                  type="text"
                  class="form-control"
                />
                <ErrorMessage name="name" class="error-feedback" />
              </div>
              <div class="form-group">
                <label for="description">Description :</label>
                <Field
                  name="description"
                  v-model="kpiData.description"
                  type="text"
                  class="form-control"
                />
                <ErrorMessage name="description" class="error-feedback" />
              </div>
              <div class="form-group">
                <label for="event_type">Type d'évenement :</label>
                <Field
                  name="event_type"
                  v-model="kpiData.event_type"
                  type="text"
                  class="form-control"
                />
                <ErrorMessage name="event_type" class="error-feedback" />
              </div>
              <div class="form-group">
                <label for="page_url">Valeur:</label>
                <Field
                  name="page_url"
                  v-model="kpiData.page_url"
                  type="text"
                  class="form-control"
                />
                <ErrorMessage name="page_url" class="error-feedback" />
              </div>
            </div>

            <button type="submit">Valider</button>
          </Form>
              
          <template #close-icon="{ closeModal }">
              <button class="btn btn-default" title="Fermer" @click="closeModal">x</button>
          </template>
      </Modal>
      </div>

      <div
        class="d-flex mt-4 justify-content-between py-3 px-4"
        style="
          margin-left: 2rem !important;
          background-color: #f8fafb;
          border-radius: 1rem;
        "
      >
        <div class="card text-bg-dark text-center w-100">
          <div class="card-header border-light bg-transparent"></div>
          <div class="card-body">
            <table class="table table-borderless">
              <thead>
                <tr>
                  <th>id</th>
                  <th>Nom</th>
                  <th>Description</th>
                  <th>Type d'évenement</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in kpiList">
                  <td>{{ item.id }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.description }}</td>
                  <td>{{ item.event_type }}</td>
                </tr>
              </tbody>
            </table>
            <a href="#" class="btn btn-primary">Add a new kpi</a>
          </div>
          <div
            class="card-footer border-light text-body-secondary bg-transparent"
          ></div>
        </div>


      </div>

      <div class="d-flex mt-4 justify-content-between py-3 px-4"
      style="margin-left: 32px !important; padding-left:38px !important; background-color: #f8fafb; border-radius: 1rem; width: 95%; height: 60px;">
        <div class="row col-12">
          <div style="width: 25%;" class="d-flex justify-content-center border-right">
            <span class="cursor-pointer" @click="orderListBy('id', 'String')">
              <b class="mr-2">Id</b>
            </span>
          </div>
          <div style="width: 25%;" class="d-flex justify-content-center border-right">
            <span class="cursor-pointer" @click="orderListBy('name', 'String')">
              <b class="mr-2">Nom</b>
            </span>
          </div>
          <div style="width: 25%;" class="d-flex justify-content-center border-right">
            <span class="cursor-pointer" @click="orderListBy('comment', 'String')">
              <b class="mr-2">Description</b>
            </span>
          </div>
          <div style="width:25%;" class="d-flex justify-content-center">
            <span class="cursor-pointer" @click="orderListBy('tags', 'String')">
              <b class="mr-2">Type d'évenement</b>
            </span>
          </div>
        </div>
      </div>

      <div v-for="(kpi, index) in filteredKpi" :key="index"
          class="d-flex mt-4 justify-content-between py-3 px-4"
          style="margin:0.5rem 0 0 2rem !important; background-color: #f8fafb; border-radius: 1rem; width: 95%; height: 80px;">
        <div class="row px-3 col-12" :id="'dupli-row-' + kpi.id">
          <div style="width: 25%;" class="d-flex justify-content-center border-right">
              <span class="cursor-pointer">
                  {{ kpi.id?? 'Not available' }}
              </span>
          </div>
          <div style="width: 25%;" class="d-flex justify-content-center border-right">
              <span class="cursor-pointer">
                  {{ kpi.id?? 'Not available' }}
              </span>
          </div>
          <div style="width: 25%;" class="d-flex justify-content-center border-right">
              <span class="cursor-pointer">
                  {{ kpi.id?? 'Not available' }}
              </span>
          </div>
          <div style="width: 25%;" class="d-flex justify-content-center ">
              <span class="cursor-pointer">
                  {{ kpi.id?? 'Not available' }}
              </span>
          </div>
          
        </div>
      </div>


    </div>
  </div>
</template>

<script>
import Sidebar from "./Sidebar.vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import Modal from './Modal.vue';

export default {
  components: {
    Sidebar,
    Form,
    Field,
    ErrorMessage,
    Modal
  },
  data() {
    const schema = yup.object().shape({
      name: yup
        .string()
        .required("Le nom doit être renseigné")
        .min(2, "Le nom doit avoir au moins 2 caractères"),
      description: yup
        .string()
        .required("La description doit être renseigné")
        .min(2, "Le description doit avoir au moins 2 caractères"),
      event_type: yup
        .string()
        .required("Le type d'évenement doit être renseigné")
        .min(2, "Le type d'évenement doit avoir au moins 2 caractères"),
      page_url: yup
        .number()
        .required("La valeur doit être renseigné"),
    });
    return {
      kpiList: null,
      //piechartDate: null,
      components: {
        Form,
        Field,
        ErrorMessage,
      },
      /*data: {
        labels: ["Red", "Blue", "Yellow"],
        datasets: [
          {
            data: [300, 50, 100],
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          },
        ],
      },*/
      options: {
        responsive: true,
      },
      /*chartData: {
        labels: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        datasets: [
          {
            label: "Page Views",
            data: [120, 180, 150, 200, 250, 220, 180],
            backgroundColor: "rgba(54, 162, 235, 0.2)", // Background color of the line chart
            borderColor: "rgba(54, 162, 235, 1)", // Border color of the line
            borderWidth: 2, // Border width of the line
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 300, // Maximum value on the y-axis
          },
        },
      },*/
      schema,
      kpiData: {
        name: "",
        page_url: "",
        description: "",
        event_type:""
      },
    };
  },
  async mounted() {
    this.getKpis();
    //this.$tracker.trackPageView('/example-page', 'Example Page');
  },
  methods: {
    createKpi() {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("user")).token,
        },
        body: JSON.stringify({
          description: this.kpiData.description,
          name: this.kpiData.name,
          event_type: this.kpiData.event_type,
          value: this.kpiData.page_url
        }),
      };
      this.kpiData.name - "";
      this.kpiData.description - "";
      this.kpiData.event_type - "";
      this.kpiData.page_url- "";
      fetch("http://localhost:8080/api/kpis/create", requestOptions)
        .then(async (response) => {
          const data = await response.json();

          // check for error response
          if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          }

          this.getKpis();
        })
        .catch((error) => {
          this.errorMessage = error;
          console.error("There was an error!", error);
        });
    },

    async getKpis() {
      const response = await fetch("http://localhost:8080/api/kpis/", {
      method: "Get",
      headers: {
        "Content-type": "application/json",
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("user")).token,
      },
    })
      .then((response) => response.json())
      .then((responseJSON) => {
        this.kpiList = responseJSON;
      });
    },
  },
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

.btn-newKpi {
    background-color: #84a3b3 !important;
    border-color: #f8fafb !important;
    border-radius: 2rem;
    color: black;
    position: absolute;
    top: 5%;
	right: 5%;
}

.btn-newKpi:hover {
    background-color: #6f8d9d !important;
    border-color: #e6e8ea !important;
    border-radius: 2rem;
    color: black;
}

.btn-newKpi:disabled {
    background-color: #9ec1d4 !important;
    border-color: #f8fafb !important;
    border-radius: 2rem;
    color: rgb(61, 61, 61);
}
</style>
