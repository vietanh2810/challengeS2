<template>
    <div class="dashboard">
        <Sidebar />
        <div class="content">
            <div class="mt-4"
                style="background-color: #f8fafb; height: 80px !important; width: 95%; margin-left: 2rem !important; border-radius: 1rem;">
                <label style="margin: 1.5rem 0 0 2rem; font-size: 21px; font-weight: 500;">Alerts</label>

                <Modal id="modal-create-alert">
                    <template #activator="{ openModal }">
                        <button class="btn btn-info btn-newAlert" @click="openModal">Nouvelle alerte</button>
                    </template>
                    <template v-slot:actions="{ closeModal }">
                        <button class="btn btn-danger" title="Fermer" @click="closeModal">Fermer</button>
                    </template>
                    <Form @submit="createAlert" :validation-schema="schema" style="padding: 1.5em;">
                        <div class="form-group">
                            <label for="entity">Type de value :</label>
                            <Field name="entity" v-model="alertData.entity" as="select" class="form-control">
                                <!-- Generating options based on this.eventTypes -->
                                <option value="event">Events</option>
                                <option value="conversion">Conversion</option>
                            </Field>
                            <ErrorMessage name="entity" class="error-feedback" />
                        </div>
                        <div class="form-group" v-if="alertData.entity==='event' && alertData !== ''">
                            <label for="event_type">Type d'événement :</label>
                            <Field name="event_type" v-model="alertData.event_type" as="select" class="form-control">
                                <option v-for="eventType in eventTypes" :key="eventType" :value="eventType">{{ eventType }}
                                </option>
                            </Field>
                            <ErrorMessage name="event_type" class="error-feedback" />
                        </div>
                        <div class="form-group" v-else>
                            <label for="conversion">Conversions :</label>
                            <Field name="conversion" v-model="alertData.conversionId" as="select" class="form-control">
                                <option v-for="conversion in conversions" :key="conversion" :value="conversion.id">{{ conversion.comment }}
                                </option>
                            </Field>
                            <ErrorMessage name="conversion" class="error-feedback" />
                        </div>
                        <div class="form-group"
                            v-if="alertData.event_type !== 'new_visitor' && alertData.event_type !== ''">
                            <label for="tag_id">Tag :</label>
                            <Field name="tag_id" v-model="alertData.tag_id" as="select" class="form-control">
                                <option :value="null">Aucun</option>
                                <option v-for="tag in tags" :key="tag" :value="tag">{{ tag }}</option>
                            </Field>
                            <ErrorMessage name="tag_id" class="error-feedback" />
                        </div>
                        <div class="form-group">
                            <label for="value">Value:</label>
                            <Field name="value" v-model="alertData.value" type="text" class="form-control" />
                            <ErrorMessage name="value" class="error-feedback" />
                        </div>
                        <div class="form-group">
                            <label for="value_type">Type de value :</label>
                            <Field name="value_type" v-model="alertData.value_type" as="select" class="form-control">
                                <!-- Generating options based on this.eventTypes -->
                                <option value="taux">Taux</option>
                                <option value="number">Number</option>
                            </Field>
                            <ErrorMessage name="value_type" class="error-feedback" />
                        </div>
                        <div class="form-group">
                            <label for="notif_method">Type de value :</label>
                            <Field name="notif_method" v-model="alertData.notif_method" as="select" class="form-control">
                                <!-- Generating options based on this.eventTypes -->
                                <option value="http">HTTP</option>
                                <option value="mail">Mail</option>
                            </Field>
                            <ErrorMessage name="notif_method" class="error-feedback" />
                        </div>
                        <div class="form-group">
                            <label for="time_scale">Type de value :</label>
                            <Field name="time_scale" v-model="alertData.time_scale" as="select" class="form-control">
                                <!-- Generating options based on this.eventTypes -->
                                <option value="day">Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                                <options value="year">This Year</options>
                            </Field>
                            <ErrorMessage name="time_scale" class="error-feedback" />
                        </div>
                        <button class="btn btn-primary" type="submit">Ajouter un alert</button>
                    </Form>
                    <template #close-icon="{ closeModal }">
                        <button class="btn btn-default" ref="clodeModalBtn" title="Fermer" @click="closeModal">x</button>
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
                                    Total alerts:
                                    <span class="chips chips_purple py-2">
                                        {{ totalAlerts }}
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
                        <span class="cursor-pointer" @click="orderListBy('tag_uid', 'String')">
                            <b class="mr-2">Id</b>
                        </span>
                    </div>
                    <div style="width: 750px;" class="d-flex justify-content-center">
                        <span class="cursor-pointer" @click="orderListBy('comment', 'String')">
                            <b class="mr-2">Commentaire</b>
                        </span>
                    </div>
                </div>
            </div>

            <div v-for="(alert, index) in filteredAlert" :key="index" class="d-flex mt-4 justify-content-between py-3 px-4"
                style="margin:0.5rem 0 0 2rem !important; background-color: #f8fafb; border-radius: 1rem; width: 95%; height: 60px;">
                <div class="row px-3" :id="'alert-row-' + alert.id">
                    <div style="width: 450px;" class="d-flex justify-content-center border-right">
                        <span class="cursor-pointer">
                            <span class="badge rounded-pill badge-info">
                                {{ alert.id ?? 'Not available' }}
                            </span>
                        </span>
                    </div>
                    <div style="width: 750px;" class="d-flex justify-content-center">
                        <span class="cursor-pointer">
                            {{ alert.event_type ?? 'Not available' }}
                        </span>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>
  
<script>
import Sidebar from './Sidebar.vue';
import Modal from './Modal.vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import EventService from "../services/events.service";
import TagService from '../services/tag.service';
import ConversionService from '../services/conversion.service';
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
            event_type: yup.string().required("Event type is required"),
            value: yup.number()
                .typeError("Value must be a number")
                .required("Value is required"),
            value_type: yup.string().required("Value type is required"),
            notif_method: yup.string().required("Notify method is required"),
            time_scale: yup.string().required("Time scale is required"),
        });
        return {
            alertList: [],
            components: {
                Form,
                Field,
                ErrorMessage,
            },
            options: {
                responsive: true,
            },
            schema,
            alertData: {
                event_type: "",
                value: "",
                value_type: "number",
                notif_method: "http",
                time_scale: "day",
                tag_id: "",
                conversionId: "",
            },
            currentPage: 1,
            pageLimit: 10,
            eventTypes: [],
            search: "",
            tags: [],
            conversions: [],
        };
    },
    computed: {
        nbPageMax() {
            return Math.ceil(this.alertList.length / this.pageLimit);
        },
        totalAlerts() {
            return this.filteredAlert.length
        },
        filteredAlert() {
            return this.search
                ? this.alertList.filter(el => {
                    return el.event_type?.toString().toLowerCase().includes(this.search.toString().toLowerCase()) ||
                        el.time_scale?.toString().toLowerCase().includes(this.search.toString().toLowerCase()) ||
                        el.value?.toString().toLowerCase().includes(this.search.toString().toLowerCase()) ||
                        el.value_type?.toString().toLowerCase().includes(this.search.toString().toLowerCase()) ||
                        el.notif_method?.toString().toLowerCase().includes(this.search.toString().toLowerCase())
                }).slice((this.currentPage - 1) * this.pageLimit, this.currentPage * this.pageLimit)
                : this.alertList.slice((this.currentPage - 1) * this.pageLimit, this.currentPage * this.pageLimit)
        }
    },
    async mounted() {
        this.fetchAlert();
        this.getEventTypes();
        this.getTags();
        this.getConversions();
    },
    methods: {
        createAlert() {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token },
                body: JSON.stringify({
                    event_type: this.alertData.event_type,
                    time_scale: this.alertData.time_scale,
                    value: this.alertData.value,
                    value_type: this.alertData.value_type,
                    notif_method: this.alertData.notif_method,
                    tag_id: this.alertData.tag_id,
                })
            };
            fetch(API_URL + '/api/alerts/create', requestOptions)
                .then(async response => {
                    const data = await response.json();

                    // check for error response
                    if (!response.ok) {
                        // get error message from body or default to response status
                        const error = (data && data.message) || response.status;
                        return Promise.reject(error);
                    }
                    this.fetchAlert();
                    this.$refs.clodeModalBtn.click();
                }).catch(error => {
                    this.errorMessage = error;
                    console.error('There was an error!', error);
                });
        },
        navigatePage(direction) {
            if (direction === 'forward' && this.currentPage < this.nbPageMax) {
                this.currentPage = this.nbPageMax
            } else if (direction === 'backward' && this.currentPage > 1) {
                this.currentPage = 1;
            } else if (direction === 'next' && this.currentPage < this.nbPageMax) {
                this.currentPage++;
            } else if (direction === 'prev' && this.currentPage > 1) {
                this.currentPage--;
            }
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
        async fetchAlert() {
            const response = await fetch(API_URL + '/api/alerts/', {
                method: "Get",
                headers: {
                    "Content-type": 'application/json',
                    Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
                }
            }).then((response) => response.json())
                .then((responseJSON) => {
                    this.alertList = responseJSON;
                });
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
        },
        getConversions() {
            ConversionService.getConversions().then(
                (response) => {
                    this.conversions = response.data;
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

.btn-newAlert {
    background-color: #84a3b3 !important;
    border-color: #f8fafb !important;
    border-radius: 2rem;
    color: black;
    position: absolute;
    top: 5%;
    right: 5%;
}

.btn-newAlert:hover {
    background-color: #6f8d9d !important;
    border-color: #e6e8ea !important;
    border-radius: 2rem;
    color: black;
}

.btn-newAlert:disabled {
    background-color: #9ec1d4 !important;
    border-color: #f8fafb !important;
    border-radius: 2rem;
    color: rgb(61, 61, 61);
}
</style>
  