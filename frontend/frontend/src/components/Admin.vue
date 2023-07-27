<template>
    <div class="dashboard">
        <Sidebar />
        <div class="content">
            <div class="mt-4"
                style="background-color: #f8fafb; height: 80px !important; width: 95%; margin-left: 2rem !important; border-radius: 1rem;">
                <label style="margin: 1.5rem 0 0 2rem; font-size: 21px; font-weight: 500;">Administration</label>
            </div>
            <!-- Dashboard content goes here -->
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
                                    Total webmaster:
                                    <span class="chips chips_purple py-2">
                                        {{ totalWebmaster }}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div>
                            <input type="text" class="form-control" placeholder="Search" aria-label="Search"
                                aria-describedby="basic-addon1" v-model="search"
                                style="border-radius: 1rem; width: 300px !important;" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="d-flex mt-4 justify-content-between py-3 px-4"
                style="margin-left: 32px !important; padding-left:38px !important; background-color: #f8fafb; border-radius: 1rem; width: 95%; height: 60px;">
                <div class="row">
                    <div style="width: 250px;" class="d-flex justify-content-center border-right">
                        <span class="cursor-pointer" @click="orderListBy('userName', 'String')">
                            <b class="mr-2">User</b>
                        </span>
                        <font-awesome-icon style="margin-top: 5px;" @click="orderListBy('userName', 'String')"
                            v-if="sortOption === userName && sortDirection === 'DESC'" icon="sort-down" />
                        <font-awesome-icon style="margin-top: 5px;" @click="orderListBy('userName', 'String')"
                            v-else-if="sortOption === userName && sortDirection === 'ASC'" icon="sort-up" />
                        <font-awesome-icon style="margin-top: 5px;" @click="orderListBy('userName', 'String')" v-else
                            icon="sort" />
                    </div>
                    <div style="width: 250px;" class="d-flex justify-content-center border-right">
                        <span class="cursor-pointer" @click="orderListBy('email', 'String')">
                            <b class="mr-2">Email</b>
                        </span>
                        <font-awesome-icon style="margin-top: 5px;" @click="orderListBy('email', 'String')"
                            v-if="sortOption === userName && sortDirection === 'DESC'" icon="sort-down" />
                        <font-awesome-icon style="margin-top: 5px;" @click="orderListBy('email', 'String')"
                            v-else-if="sortOption === userName && sortDirection === 'ASC'" icon="sort-up" />
                        <font-awesome-icon style="margin-top: 5px;" @click="orderListBy('email', 'String')" v-else
                            icon="sort" />
                    </div>
                    <div style="width: 250px;" class="d-flex justify-content-center border-right">
                        <span class="cursor-pointer" @click="orderListBy('contact', 'String')">
                            <b class="mr-2">Contact Infos</b>
                        </span>
                        <font-awesome-icon style="margin-top: 5px;" @click="orderListBy('contact', 'String')"
                            v-if="sortOption === userName && sortDirection === 'DESC'" icon="sort-down" />
                        <font-awesome-icon style="margin-top: 5px;" @click="orderListBy('contact', 'String')"
                            v-else-if="sortOption === userName && sortDirection === 'ASC'" icon="sort-up" />
                        <font-awesome-icon style="margin-top: 5px;" @click="orderListBy('contact', 'String')" v-else
                            icon="sort" />
                    </div>
                    <div style="width: 250px;" class="d-flex justify-content-center border-right">
                        <span class="cursor-pointer" @click="orderListBy('isValidated', 'String')">
                            <b class="mr-2">Validated</b>
                        </span>
                        <font-awesome-icon style="margin-top: 5px;" @click="orderListBy('isValidated', 'String')"
                            v-if="sortOption === userName && sortDirection === 'DESC'" icon="sort-down" />
                        <font-awesome-icon style="margin-top: 5px;" @click="orderListBy('isValidated', 'String')"
                            v-else-if="sortOption === userName && sortDirection === 'ASC'" icon="sort-up" />
                        <font-awesome-icon style="margin-top: 5px;" @click="orderListBy('isValidated', 'String')" v-else
                            icon="sort" />
                    </div>
                    <div style="width: 200px;" class="d-flex justify-content-center border-right">
                        <span class="cursor-pointer">
                            <b class="mr-2">KBIS</b>
                        </span>
                    </div>
                </div>
            </div>

            <div v-for="(webmaster, index) in filteredWebmaster" :key="index"
                class="d-flex mt-4 justify-content-between py-3 px-4"
                style="margin:0.5rem 0 0 2rem !important; background-color: #f8fafb; border-radius: 1rem; width: 95%; height: 60px;">
                <div class="row px-3" :id="'dupli-row-' + webmaster.id">
                    <div style="width: 250px;" class="d-flex justify-content-center border-right">
                        <span class="cursor-pointer">
                            {{ webmaster.userName ?? 'Not available' }}
                        </span>
                    </div>
                    <div style="width: 250px;" class="d-flex justify-content-center border-right">
                        <span class="cursor-pointer">
                            {{ webmaster.email ?? 'Not available' }}
                        </span>
                    </div>
                    <div style="width: 250px;" class="d-flex justify-content-center border-right">
                        <span class="cursor-pointer">
                            {{ webmaster.contactInfo ?? 'Not available' }}
                        </span>
                    </div>
                    <div style="width: 250px;" class="d-flex justify-content-center border-right">
                        <div>
                            <span class="cursor-pointer"
                                :class="{ 'chip-green': webmaster.isValidated, 'chip-red': !webmaster.isValidated }">
                                {{ webmaster.isValidated ? 'Validated' : 'Not Validated' }}
                            </span>
                        </div>
                    </div>
                    <div style="width: 200px;" class="d-flex justify-content-center border-right">
                        <div>
                            <span class="cursor-pointer">
                                <button class="btn btn-primary" v-if="webmaster.kbis" @click="handleShowPdf(webmaster.kbis)">
                                    Show file
                                </button>
                                <span v-else class="cursor-pointer">
                                    Not available
                                </span>
                            </span>
                        </div>
                    </div>
                    <div v-if="!webmaster.isValidated" style="width: 110px;" class="d-flex justify-content-center">
                        <div>
                            <button class="btn btn-primary" @click="validate(webmaster.id)" >
                                Validate
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="pdf-modal" v-if="showFile" @click="handleClosePdf">
                <div class="pdf-modal-content">
                    <vue-pdf-embed :source="showedFile" @click.stop />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Sidebar from './Sidebar.vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import UserService from "../services/user.service";
import VuePdfEmbed from 'vue-pdf-embed'


export default {
    components: {
        Sidebar,
        VuePdfEmbed,
    },
    data() {
        return {
            webMasterList: [],
            currentPage: 1,
            pageLimit: 10,
            search: '',
            showFile: false,
            showedFile: '',
        };
    },
    computed: {
        nbPageMax() {
            return Math.ceil(this.webMasterList.length / this.pageLimit);
        },
        totalWebmaster() {
            return this.filteredWebmaster.length
        },
        filteredWebmaster() {
            return this.search
                ? this.webMasterList.filter(el => {
                    return el.userName?.toString().toLowerCase().includes(this.search.toString().toLowerCase()) ||
                        el.email?.toString().toLowerCase().includes(this.search.toString().toLowerCase()) ||
                        el.contact?.toString().toLowerCase().includes(this.search.toString().toLowerCase()) ||
                        el.isValidated?.toString().toLowerCase().includes(this.search.toString().toLowerCase())
                }).slice((this.currentPage - 1) * this.pageLimit, this.currentPage * this.pageLimit)
                : this.webMasterList.slice((this.currentPage - 1) * this.pageLimit, this.currentPage * this.pageLimit)

            // return this.webMasterList.slice((this.currentPage - 1) * this.pageLimit, this.currentPage * this.pageLimit)
        }
    },
    mounted() {
        this.getAdminBoard();
    },
    methods: {
        navigatePage(direction) {
            if (direction === 'forward' && this.currentPage < this.nbPageMax) {
                this.currentPage = this.nbPageMax
            } else if (direction === 'backward' && this.currentPage > 1) {
                this.currentPage = 1;
            } else if (direction === 'next' && this.currentPage < this.nbPageMax) {
                this.currentPage++;
            }
            else if (direction === 'prev' && this.currentPage > 1) {
                this.currentPage--;
            }
        },
        handleShowPdf(path) {
            this.showFile = true;
            this.showedFile = 'http://localhost:8080/uploads/' + path;
            console.log(import.meta.env.VITE_API_ENDPOINT)
        },
        handleClosePdf(){
            this.showFile = false;
            this.showedFile ='';
        },
        validate(id) {
            UserService.validateUser(id).then(
            () => {
                this.getAdminBoard();
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
        getAdminBoard() {
            UserService.getAdminBoard().then(
            (response) => {
                this.content = response.data;
                this.webMasterList = response.data;
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

.chip-green {
    background-color: rgb(74, 192, 74);
    color: white;
    padding: 5px 10px;
    border-radius: 15px;
}

.chip-red {
    background-color: rgb(254, 93, 93);
    color: white;
    padding: 5px 10px;
    border-radius: 15px;
}

.pdf-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(128, 128, 128, 0.8);
    /* Blue background with opacity */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.pdf-modal-content {
    position: relative;
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    max-width: 90%;
    max-height: 90%;
    overflow: auto;
}

.close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: transparent;
    border: none;
    font-size: 20px;
    color: white;
    cursor: pointer;
}
</style>
  