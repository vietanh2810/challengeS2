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
        <label
          style="margin: 1.5rem 0 0 2rem; font-size: 21px; font-weight: 500"
          >Graphes</label
        >
        <!-- <button><i class="bi bi-2-square"></i>Nouveau Graphe</button> -->
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
                  <th>Type de graphe</th>
                  <th>Type d'évenement</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in grapheList">
                  <td>{{ item.id }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.graphe_type }}</td>
                  <td>{{ item.event_type }}</td>
                </tr>
              </tbody>
            </table>
            <a href="#" class="btn btn-primary">Add a new graphe</a>
          </div>
          <div
            class="card-footer border-light text-body-secondary bg-transparent"
          ></div>
        </div>

        <div class="card text-bg-dark text-center w-100">
          <div class="card-body">
            <Form @submit="createGraphe" :validation-schema="schema">
              <div class="form-group">
                <div class="form-group">
                  <label for="name">Nom :</label>
                  <Field
                    name="name"
                    v-model="grapheData.name"
                    type="text"
                    class="form-control"
                  />
                  <ErrorMessage name="name" class="error-feedback" />
                </div>
                <div class="form-group">
                  <label for="graphe_type">Type de graphe :</label>
                  <Field
                    name="graphe_type"
                    v-model="grapheData.graphe_type"
                    type="text"
                    class="form-control"
                  />
                  <ErrorMessage name="graphe_type" class="error-feedback" />
                </div>
                <div class="form-group">
                  <label for="event_type">Type d'évenement :</label>
                  <Field
                    name="event_type"
                    v-model="grapheData.event_type"
                    type="text"
                    class="form-control"
                  />
                  <ErrorMessage name="event_type" class="error-feedback" />
                </div>
              </div>

              <button type="submit">submit graphe</button>
            </Form>
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

export default {
  components: {
    Sidebar,
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const schema = yup.object().shape({
      name: yup
        .string()
        .required("Le nom doit être renseigné")
        .min(2, "Le nom doit avoir au moins 2 caractères"),
      graphe_type: yup
        .string()
        .required("Le type doit être renseigné")
        .min(2, "Le type doit avoir au moins 2 caractères"),
      event_type: yup
        .string()
        .required("Le event_type doit être renseigné")
        .min(2, "Le event_type doit avoir au moins 2 caractères"),
    });
    return {
      grapheList: null,
      piechartDate: null,
      components: {
        Form,
        Field,
        ErrorMessage,
      },
      data: {
        labels: ["Red", "Blue", "Yellow"],
        datasets: [
          {
            data: [300, 50, 100],
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          },
        ],
      },
      options: {
        responsive: true,
      },
      chartData: {
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
      },
      schema,
      grapheData: {
        graphe_type: "",
        name: "",
        event_type: "",
      },
    };
  },
  async mounted() {
    const response = await fetch("http://localhost:8080/api/graphes/", {
      method: "Get",
      headers: {
        "Content-type": "application/json",
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("user")).token,
      },
    })
      .then((response) => response.json())
      .then((responseJSON) => {
        this.grapheList = responseJSON;
      });
    //this.$tracker.trackPageView('/example-page', 'Example Page');
  },
  methods: {
    createGraphe() {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("user")).token,
        },
        body: JSON.stringify({
          graphe_type: this.grapheData.graphe_type,
          name: this.grapheData.name,
          event_type: this.grapheData.event_type,
        }),
      };
      this.grapheData.comment - "";
      fetch("http://localhost:8080/api/graphes/create", requestOptions)
        .then(async (response) => {
          const data = await response.json();

          // check for error response
          if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          }

          //console.log(data);
          //this.postId = data.id;
        })
        .catch((error) => {
          this.errorMessage = error;
          console.error("There was an error!", error);
        });
    },

    getGraphes() {},
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
</style>
