<template>
    <div class="dashboard">
        <Sidebar />
        <div class="content">
            <div class="mt-4"
                style="background-color: #f8fafb; height: 80px !important; width: 95%; margin-left: 2rem !important; border-radius: 1rem;">
                <label style="margin: 1.5rem 0 0 2rem; font-size: 21px; font-weight: 500;">Tunnels de conversion</label>
                
                <Modal>

                    <template #activator="{ openModal }">
                        <button class="btn btn-info btn-newTag" @click="openModal">Ajouter un tunnel de conversion</button>
                    </template>

                    <template v-slot:actions="{ closeModal }">
                        <button class="btn btn-danger" title="Fermer" @click="closeModal">Fermer</button>
                    </template>

                    <Form @submit="createConvTunnel" :validation-schema="schema" style="padding: 1.5em;">
                            <div class="form-group">
                                <label for="comment">Commentaire:</label>
                                <Field name="comment" v-model="convTunnelData.comment" type="text" class="form-control" />
                                <ErrorMessage name="comment" class="error-feedback" />
                            </div>

                            <div class="form-group d-flex" style="overflow:scroll; height:400px;">
                                <div class="col-6">
                                <label for="tags">Tags:</label>
                                    <draggable
                                        :list="tagList"
                                        :disabled="!enabled"
                                        class="list-group"
                                        ghost-class="ghost"
                                        :move="checkMove"
                                        @start="dragging = true"
                                        @end="dragging = false"
                                        @change="log"
                                        group="tags"
                                        style="overflow:scroll; height:400px;"
                                    >
                                        <template #item="{ element }">
                                        <div class="list-group-item" :class="{ 'not-draggable': !enabled }" :key="element.tag_uid">
                                            {{ element.tag_uid }} {{ element.comment }}
                                        </div>
                                        </template>
                                    </draggable>
                                </div>

                                <div class="col-6">
                                <label for="newTags">Tag(s) choisi(s):</label>
                                <draggable
                                    :list="newTagList"
                                    :disabled="!enabled2"
                                    class="list-group"
                                    ghost-class="ghost"
                                    :move="checkMove"
                                    @start="dragging = true"
                                    @end="dragging = false"
                                    @change="log"
                                    group="tags"
                                >
                                    <template #item="{ element }" >
                                    <div class="list-group-item" :class="{ 'not-draggable': !enabled2 }" :key="element.tag_uid">
                                        {{ element.tag_uid }} {{ element.comment }}
                                    </div>
                                    </template>
                                </draggable>
                                <!--<ErrorMessage name="newTags" class="error-feedback" />-->
                            </div>

                            <rawDisplayer class="col-6" :value="tagList" title="List 1" />

                            <rawDisplayer class="col-6" :value="newTagList" title="List 2" />

                                <!--
                                    <Field name="comment" v-model="convTunnelData.comment" type="text" class="form-control" />
                                    <ErrorMessage name="comment" class="error-feedback" />
                                -->
                            </div>
                            
                            <button type="submit">ajouter une conversion de tunnels</button>
                        </Form>
                        
                        
                    
                        <template #close-icon="{ closeModal }">
                            <button class="btn btn-default" title="Fermer" @click="closeModal"><i class='bx bx-x'></i></button>
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
                                    Total tunnels de conversion:
                                    <span class="chips chips_purple py-2">
                                        {{ totalConvTunnels }}
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
                <div class="row col-12">
                    <div style="width: 50%;" class="d-flex justify-content-center border-right">
                        <span class="cursor-pointer" @click="orderListBy('comment', 'String')">
                            <b class="mr-2">Commentaire</b>
                        </span>
                    </div>
                    <div style="width:50%;" class="d-flex justify-content-center">
                        <span class="cursor-pointer" @click="orderListBy('tags', 'String')">
                            <b class="mr-2">Tags</b>
                        </span>
                    </div>
                </div>
            </div>

            <div v-for="(convtunnel, index) in filteredConvTunnel" :key="index"
                class="d-flex mt-4 justify-content-between py-3 px-4"
                style="margin:0.5rem 0 0 2rem !important; background-color: #f8fafb; border-radius: 1rem; width: 95%; height: 80px;">
                <div class="row px-3 col-12" :id="'dupli-row-' + convtunnel.id">
                    <div style="width: 50%;" class="d-flex justify-content-center border-right">
                        <span class="cursor-pointer">
                            {{ convtunnel.comment?? 'Not available' }}
                        </span>
                    </div>
                    <div style="max-width: 50%; overflow:scroll;" class="d-flex justify-content-center">
                        <span class="cursor-pointer" v-for="(tag, index) in convtunnel.tags" :key="index">
                            <span class="badge rounded-pill badge-info">tag {{tag.tag_uid ?? 'Not available' }}</span>
                        </span>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>
  
<script>
import Sidebar from './Sidebar.vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import Draggable from 'vuedraggable';
import Modal from './Modal.vue';

export default {
    components: {
        Sidebar,
        Form,
        Field,
        ErrorMessage,
        Draggable,
        Modal
    },
    data() {
        const schema = yup.object().shape({
            comment: yup
                .string()
                .required("Le commentaire doit être renseigné")
                .min(2, "Le commentaire doit avoir au moins 2 caractères"),
            newTag: yup
                .array()
                .required("La liste des tags doit en contenir au moins 1")
                .min(1,"Vous devez mettre au moins un tag dans la liste")
        });
        return {
            enabled: true,
            enabled2: true,
            dragging: false,
            convTunnelList: [],
            components: {
                Form,
                Field,
                ErrorMessage,
                Draggable
            },
            tagList: [],
            newTagList: [],
            options: {
                responsive: true,
            },
            schema,
            convTunnelData: {
                comment: "",
                newTags: []
            },
            currentPage: 1,
            pageLimit: 10,
        };
    },
    computed: {
        nbPageMax() {
            return Math.ceil(this.convTunnelList.length / this.pageLimit);
        },
        totalConvTunnels() {
            return this.filteredConvTunnel.length
        },
        filteredConvTunnel() {
            return this.search
                ? this.convTunnelList.filter(el => {
                    return el.comment?.toString().toLowerCase().includes(this.search.toString().toLowerCase()) 
                }).slice((this.currentPage - 1) * this.pageLimit, this.currentPage * this.pageLimit)
                : this.convTunnelList.slice((this.currentPage - 1) * this.pageLimit, this.currentPage * this.pageLimit)

            // return this.webMasterList.slice((this.currentPage - 1) * this.pageLimit, this.currentPage * this.pageLimit)
        },
        draggingInfo() {
            return this.dragging ? "under drag" : "";
        }
    },
    async mounted() {
        this.fetchConvTunnel();
        this.fetchTag();
        //this.$tracker.trackPageView('/example-page', 'Example Page');
    },
    methods: {
        
        log: function(evt) {
            //window.console.log(evt);
        },
        createConvTunnel() {

            const listTags =  new Array();
            this.newTagList.forEach(element => {
                listTags.push(element.tag_uid)
            });
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token},
                body: JSON.stringify({ comment: this.convTunnelData.comment, tags: listTags})
            };
            this.convTunnelData.comment - '';
            this.convTunnelData.newTags - [];
            fetch('http://localhost:8080/api/convTunnel/create', requestOptions)
            .then(async response => {
                const data = await response.json();

                // check for error response
                if (!response.ok) {
                    // get error message from body or default to response status
                    const error = (data && data.message) || response.status;
                    return Promise.reject(error);
                }
                this.fetchConvTunnel();
                this.fetchTag();
                this.newTagList = [];
                //console.log(data)
                //this.postId = data.id;
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
            }
            else if (direction === 'prev' && this.currentPage > 1) {
                this.currentPage--;
            }
        },
        async fetchConvTunnel() {
            const response = await fetch('http://localhost:8080/api/convTunnel/', {
                method: "Get",
                headers: {
                    "Content-type": 'application/json',
                    Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
                }
            }).then((response) => response.json())
            .then((responseJSON) => {
                this.convTunnelList= responseJSON;
            });
        },
        async fetchTag() {
            const response = await fetch('http://localhost:8080/api/tags/', {
                method: "Get",
                headers: {
                    "Content-type": 'application/json',
                    Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
                }
            }).then((response) => response.json())
            .then((responseJSON) => {
                this.tagList= responseJSON;
            });
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

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.not-draggable {
  cursor: no-drop;
}

.btn-newTag {
    background-color: #84a3b3 !important;
    border-color: #f8fafb !important;
    border-radius: 2rem;
    color: black;
    position: absolute;
    top: 5%;
	right: 5%;
}

.btn-newTag:hover {
    background-color: #6f8d9d !important;
    border-color: #e6e8ea !important;
    border-radius: 2rem;
    color: black;
}

.btn-newTag:disabled {
    background-color: #9ec1d4 !important;
    border-color: #f8fafb !important;
    border-radius: 2rem;
    color: rgb(61, 61, 61);
}

</style>
  