<template>
  <div class="dashboard">
    <Sidebar />
    <div class="content">
      <div class="mt-4" style="
          background-color: #f8fafb;
          height: 80px !important;
          width: 100%;
          margin-left: 2rem !important;
          border-radius: 1rem;
        ">
        <label style="margin: 1.5rem 0 0 2rem; font-size: 21px; font-weight: 500">Kpis</label>
        <!-- <button><i class="bi bi-2-square"></i>Nouveau Kpi</button> -->
        <Modal>
          <template #activator="{ openModal }">
            <button class="btn btn-info btn-newKpi" @click="openModal">Ajouter un kpi</button>
          </template>
          <template v-slot:actions="{ closeModal }">

            <button class="btn btn-danger" title="Fermer" @click="closeModal">Fermer</button>
          </template>
          <Form @submit="createKpi" :validation-schema="schema" style="padding: 1.5em;">
            <div class="form-group">
              <div class="form-group">
                <label for="name">Nom :</label>
                <Field name="name" v-model="kpiData.name" type="text" class="form-control" />
                <ErrorMessage name="name" class="error-feedback" />
              </div>
              <div class="form-group">
                <label for="description">Description :</label>
                <Field name="description" v-model="kpiData.description" type="text" class="form-control" />
                <ErrorMessage name="description" class="error-feedback" />
              </div>
              <div class="form-group">
                <label for="event_type">Type d'événement :</label>
                <Field name="event_type" v-model="kpiData.event_type" as="select" class="form-control">
                  <option v-for="eventType in eventTypes" :key="eventType" :value="eventType">{{ eventType }}</option>
                </Field>
                <ErrorMessage name="event_type" class="error-feedback" />
              </div>
              <div class="form-group" v-if="kpiData.event_type !== 'new_visitor' && kpiData.event_type !== ''">
                <label for="tag_id">Tag :</label>
                <Field name="tag_id" v-model="kpiData.tag_id" as="select" class="form-control">
                  <option :value="null">Aucun</option>
                  <option v-for="tag in tags" :key="tag" :value="tag">{{ tag }}</option>
                </Field>
                <ErrorMessage name="tag_id" class="error-feedback" />
              </div>
              <div class="form-group">
                <label for="value">value:</label>
                <Field name="value" v-model="kpiData.value" type="text" class="form-control" />
                <ErrorMessage name="value" class="error-feedback" />
              </div>
              <div class="form-group">
                <label for="value_type">Type de value :</label>
                <Field name="value_type" v-model="kpiData.value_type" as="select" class="form-control">
                  <!-- Generating options based on this.eventTypes -->
                  <option value="taux">Taux</option>
                  <option value="number">Number</option>
                </Field>
                <ErrorMessage name="value_type" class="error-feedback" />
              </div>
              <div class="form-group">
                <label for="start">Start Date :</label>
                <Field name="start" v-model="kpiData.start" type="date" class="form-control" />
                <ErrorMessage name="start" class="error-feedback" />
              </div>
              <div class="form-group">
                <label for="end">End Date :</label>
                <Field name="end" v-model="kpiData.end" type="date" class="form-control" />
                <ErrorMessage name="end" class="error-feedback" />
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
                <button class="btn btn-primary" @click="navigatePage('backward')" :disabled="currentPage === 1">
                  <font-awesome-icon icon="step-backward" />
                </button>
                <button class="btn ml-1 mr-2 btn-primary" @click="navigatePage('prev')" :disabled="currentPage === 1">
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
                  Total tags:
                  <span class="chips chips_purple py-2">
                    {{ totalKpis }}
                  </span>
                </p>
              </div>
            </div>
            <div>
              <input type="text" class="form-control" placeholder="Recherche" aria-label="Search"
                aria-describedby="basic-addon1" v-model="search" style="border-radius: 1rem; width: 300px !important;" />
            </div>
          </div>
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

      <div v-for="(kpi, index) in filteredKpi" :key="index" class="d-flex mt-4 justify-content-between py-3 px-4"
        style="margin:0.5rem 0 0 2rem !important; background-color: #f8fafb; border-radius: 1rem; width: 95%; height: 80px;">
        <div class="row px-3 col-12" :id="'dupli-row-' + kpi.id">
          <div style="width: 25%;" class="d-flex justify-content-center border-right">
            <span class="cursor-pointer">
              {{ kpi.id ?? 'Not available' }}
            </span>
          </div>
          <div style="width: 25%;" class="d-flex justify-content-center border-right">

            <span class="cursor-pointer">
              {{ kpi.name ?? 'Not available' }}
            </span>
          </div>
          <div style="width: 25%;" class="d-flex justify-content-center border-right">
            <span class="cursor-pointer">
              {{ kpi.description ?? 'Not available' }}
            </span>
          </div>
          <div style="width: 25%;" class="d-flex justify-content-center ">
            <span class="cursor-pointer">
              {{ kpi.event_type ?? 'Not available' }}
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
import EventService from "../services/events.service";
import TagService from "../services/tag.service";
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
      description: yup
        .string()
        .required("La description doit être renseigné")
        .min(2, "Le description doit avoir au moins 2 caractères"),
      event_type: yup
        .string()
        .required("Le type d'évenement doit être renseigné")
        .min(2, "Le type d'évenement doit avoir au moins 2 caractères"),
      value: yup
        .number("La valeur doit être renseignée")
        .required(),
      tag_id: yup
        .string(),
      value_type: yup
        .string()
        .required("Le type de valeur doit être renseigné"),
      start: yup
        .date(),
      end: yup
        .date(),
    });
    return {
      kpiList: [],
      tags: [],
      eventTypes: [],
      components: {
        Form,
        Field,
        ErrorMessage,
      },
      options: {
        responsive: true,
      },
      schema,
      kpiData: {
        name: "",
        description: "",
        event_type: "",
        value: "",
        tag_id: "",
        value_type: "",
        start: "",
        end: "",
      },
      currentPage: 1,
      pageLimit: 10,
    };
  },
  computed: {
    nbPageMax() {
      return Math.ceil(this.kpiList.length / this.pageLimit);
    },
    totalKpis() {
      return this.filteredKpi.length
    },
    filteredKpi() {
      return this.search
        ? this.kpiList.filter(el => {
          return el.name?.toString().toLowerCase().includes(this.search.toString().toLowerCase())
        }).slice((this.currentPage - 1) * this.pageLimit, this.currentPage * this.pageLimit)
        : this.kpiList.slice((this.currentPage - 1) * this.pageLimit, this.currentPage * this.pageLimit)

      // return this.webMasterList.slice((this.currentPage - 1) * this.pageLimit, this.currentPage * this.pageLimit)
    }
  },
  async mounted() {
    this.getKpis();
    this.getEventTypes();
    this.getTags();
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
          tag_id: this.kpiData.tag_id,
          value: parseInt(this.kpiData.value),
          value_type: this.kpiData.value_type,
          start: this.kpiData.start,
          end: this.kpiData.end,
        }),
      };
      this.kpiData.name - "";
      this.kpiData.description - "";
      this.kpiData.event_type - "";
      this.kpiData.tag_id - "";
      this.kpiData.value - "";
      this.kpiData.value_type - "";
      this.kpiData.start - "";
      this.kpiData.end - "";

      fetch(API_URL + "/api/kpis/create", requestOptions)
        .then(async (response) => {
          const data = await response.json();

          // check for error response
          if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          }

          this.getKpis();
          this.closeModal();
        })
        .catch((error) => {
          this.errorMessage = error;
          console.error("There was an error!", error);
        });
    },

    async getKpis() {
      const response = await fetch(API_URL + "/api/kpis/", {
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
    getEventTypes() {
      EventService.getEventTypes().then(
        (response) => {
          this.eventTypes = response.data;
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
    getTags() {
      TagService.getTags().then(
        (response) => {
          let res = [];
          const tagList = response.data;
          tagList.forEach((tag) => {
            res.push(tag.tag_uid);
          });
          this.tags = res;
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
    }
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
