<template>
  <div class="dashboard">
    <Sidebar />
    <div class="content">
      <div
        class="mt-4"
        style="
          background-color: #f8fafb;
          height: 80px !important;
          width: 95%;
          margin-left: 2rem !important;
          border-radius: 1rem;
        "
      >
        <label
          style="margin: 1.5rem 0 0 2rem; font-size: 21px; font-weight: 500"
          >Heatmaps</label
        >
        <Modal>
          <template #activator="{ openModal }">
              <button class="btn btn-info btn-newKpi" @click="openModal">Ajouter heatmap</button>
          </template>
          <template v-slot:actions="{ closeModal }">
              
              <button class="btn btn-danger" title="Fermer" @click="closeModal">Fermer</button>
          </template>
          <Form @submit="createHeatmap" :validation-schema="schema" style="padding: 1.5em;">
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
                <label for="page_url">Page URL:</label>
                <Field name="page_url" v-model="heatmapData.page_url" as="select" class="form-control">
                  <option :value="null">Aucun</option>
                  <option v-for="url in urls" :key="url" :value="url">{{ url }}</option>
                </Field>
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

      <div class="mt-4 col-12"
                style="background-color: #f8fafb; height: 50px !important; width: 95%; margin-left: 2rem !important; border-radius: 1rem;">
                <div class="d-flex">
                    <div class="pagination pr-4 py-auto my-auto align-items-center d-flex justify-content-between">
                        <div class="d-flex">
                            <span style="width: 100px; padding-top: 14px;">Page <b>
                                    {{ currentPage }}
                                </b> of {{ nbPageMax }}
                            </span>
                            <div class="pl-4 d-flex" style="width: 250px;">
                                <button class="btn btn-primary" @click="navigatePage('backward')"
                                    :disabled="currentPage === 1">
                                    <font-awesome-icon icon="step-backward" />
                                </button>
                                <button class="btn ml-1 mr-2 btn-primary" @click="navigatePage('prev')"
                                    :disabled="currentPage === 1">
                                    <font-awesome-icon icon="chevron-left" />
                                </button>
                                <b style="padding-top: 14px;">{{ currentPage }}</b>
                                <button class="btn ml-2 mr-1 btn-primary" @click="navigatePage('next')"
                                    :disabled="currentPage === nbPageMax">
                                    <font-awesome-icon icon="chevron-right" />
                                </button>
                                <button class="btn ml-1 btn-primary" @click="navigatePage('forward')"
                                    :disabled="currentPage === nbPageMax">
                                    <font-awesome-icon icon="step-forward" />
                                </button>
                            </div>
                            <div style="width: 250px;">
                                <p style="padding-top: 10px;">
                                    Total heatmaps:
                                    <span class="chips chips_purple py-2">
                                        {{ totalHeatmaps }}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div>
                            <input type="text" class="form-control" placeholder="Recherche" aria-label="Search"
                                aria-describedby="basic-addon1" v-model="search"
                                style="border-radius: 1rem; width: 300px !important;" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="d-flex mt-4 justify-content-between py-3 px-4"
                style="margin-left: 32px !important; padding-left:38px !important; background-color: #f8fafb; border-radius: 1rem; width: 95%; height: 60px;">
                <div class="row">
                    <div style="width: 450px;" class="d-flex justify-content-center border-right">
                        <span class="cursor-pointer" @click="orderListBy('name', 'String')">
                            <b class="mr-2">Nom</b>
                        </span>
                    </div>
                    <div style="width: 750px;" class="d-flex justify-content-center">
                        <span class="cursor-pointer" @click="orderListBy('page_url', 'String')">
                            <b class="mr-2">Page url</b>
                        </span>
                    </div>
                </div>
            </div>

            <div v-for="(hm, index) in filteredHeatmap" :key="index"
                class="d-flex mt-4 justify-content-between py-3 px-4"
                style="margin:0.5rem 0 0 2rem !important; background-color: #f8fafb; border-radius: 1rem; width: 95%; height: 60px;">
                <div class="row px-3" :id="'dupli-row-' + hm.id">
                    <div style="width: 450px;" class="d-flex justify-content-center border-right">
                        <span class="cursor-pointer">
                            <span class="badge rounded-pill badge-info">
                                {{ hm.name ?? 'Not available' }}
                            </span>
                        </span>
                    </div>
                    <div style="width: 750px;" class="d-flex justify-content-center">
                        <span class="cursor-pointer">
                            {{ hm.page_url ?? 'Not available' }}
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
const API_URL = import.meta.env.VITE_API_ENDPOINT;

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
      page_url: yup
        .string()
        .required("Le lien de la page doit être renseigné")
        .min(2, "Le  doit avoir au moins 2 caractères"),
    });
    return {
      urls: [],
      heatmapList: [],
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
      currentPage: 1,
     pageLimit: 10,
    };
  },
  computed: {
        nbPageMax() {
            return Math.ceil(this.heatmapList.length / this.pageLimit);
        },
        totalHeatmaps() {
            return this.filteredHeatmap.length
        },
        filteredHeatmap() {
            return this.search
                ? this.heatmapList.filter(el => {
                    return el.name?.toString().toLowerCase().includes(this.search.toString().toLowerCase())
                }).slice((this.currentPage - 1) * this.pageLimit, this.currentPage * this.pageLimit)
                : this.heatmapList.slice((this.currentPage - 1) * this.pageLimit, this.currentPage * this.pageLimit)

            // return this.webMasterList.slice((this.currentPage - 1) * this.pageLimit, this.currentPage * this.pageLimit)
        }
    },
  async mounted() {
    this.getHeatmaps();
    this.getUrls();
    
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
      fetch(API_URL + "/api/heatmaps/create", requestOptions)
        .then(async (response) => {
          const data = await response.json();

          // check for error response
          if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          }

          this.getHeatmaps();
          //this.postId = data.id;
          this.closeModal();
        })
        .catch((error) => {
          this.errorMessage = error;
          console.error("There was an error!", error);
        });
    },
    getUrls() {
      EventService.getUrls().then(
        (response) => {
          this.urls = response.data;
        },
        (error) => {
          this.content =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
    },
    async getHeatmaps() {
      const response = await fetch(API_URL + "/api/heatmaps/", {
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

.btn-primary {
    background-color: #f8fafb !important;
    border-color: #f8fafb !important;
    border-radius: 2rem;
    color: black;
}

.btn-primary:hover {
    background-color: #e6e8ea !important;
    border-color: #e6e8ea !important;
    border-radius: 2rem;
    color: black;
}

.btn-primary:disabled {
    background-color: #f8fafb !important;
    border-color: #f8fafb !important;
    border-radius: 2rem;
    color: rgb(61, 61, 61);
}
</style>
