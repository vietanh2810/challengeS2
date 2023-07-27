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
          >Heatmaps</label
        >
        <!-- <button><i class="bi bi-2-square"></i>Nouveau Heatmap</button> -->
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
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in heatmapList">
                  <td>{{ item.id }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.page_url }}</td>
                </tr>
              </tbody>
            </table>
            <a href="#" class="btn btn-primary">Add a new heatmap</a>
          </div>
          <div
            class="card-footer border-light text-body-secondary bg-transparent"
          ></div>
        </div>

        <div class="card text-bg-dark text-center w-100">
          <div class="card-body">
            <Form @submit="createHeatmap" :validation-schema="schema">
              <div class="form-group">
                <div class="form-group">
                  <label for="name">Nom :</label>
                  <Field
                    name="name"
                    v-model="heatmapData.name"
                    type="text"
                    class="form-control"
                  />
                  <ErrorMessage name="name" class="error-feedback" />
                </div>
                <div class="form-group">
                  <label for="page_url">Lien de la page:</label>
                  <Field
                    name="page_url"
                    v-model="heatmapData.page_url"
                    type="text"
                    class="form-control"
                  />
                  <ErrorMessage name="page_url" class="error-feedback" />
                </div>
              </div>

              <button type="submit">submit Heatmap</button>
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
      page_url: yup
        .string()
        .required("Le lien de la page doit être renseigné")
        .min(2, "Le  doit avoir au moins 2 caractères"),
    });
    return {
      heatmapList: null,
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
      heatmapData: {
        name: "",
        page_url: "",
      },
    };
  },
  async mounted() {
    const response = await fetch("http://localhost:8080/api/heatmaps/", {
      method: "Get",
      headers: {
        "Content-type": "application/json",
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("user")).token,
      },
    })
      .then((response) => response.json())
      .then((responseJSON) => {
        this.heatmapList = responseJSON;
      });
    //this.$tracker.trackPageView('/example-page', 'Example Page');
  },
  methods: {
    createHeatmap() {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("user")).token,
        },
        body: JSON.stringify({
          page_url: this.heatmapData.page_url,
          name: this.heatmapData.name,
        }),
      };
      this.heatmapData.comment - "";
      fetch("http://localhost:8080/api/heatmaps/create", requestOptions)
        .then(async (response) => {
          const data = await response.json();

          // check for error response
          if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          }

          console.log(data);
          //this.postId = data.id;
        })
        .catch((error) => {
          this.errorMessage = error;
          console.error("There was an error!", error);
        });
    },

    getHeatmaps() {},
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
