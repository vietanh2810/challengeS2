<template>
    <div class="d-flex">
        <!-- First Div - Image -->
        <div class="container">
            <div class="content">
                <img src="../assets/bg2.webp" alt="Vue logo" />
            </div>
        </div>

        <!-- Second Div - Login Form -->
        <div class="login-form">
            <h2>Login</h2>
            <Form @submit="handleLogin" :validation-schema="schema">
                <div class="form-group">
                    <label for="email">Email</label>
                    <Field name="email" type="text" class="form-control" />
                    <ErrorMessage name="email" class="error-feedback" />
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <Field name="password" type="password" class="form-control" />
                    <ErrorMessage name="password" class="error-feedback" />
                </div>

                <div class="form-group">
                    <button class="btn btn-primary btn-block" :disabled="loading">
                        <span v-show="loading" class="spinner-border spinner-border-sm"></span>
                        <span>Login</span>
                    </button>
                </div>

                <div class="form-group">
                    <div v-if="message" class="alert alert-danger" role="alert">
                        {{ message }}
                    </div>
                </div>
            </Form>
            <p class="d-flex mt=1 justify-content-between" style="margin-top: 2rem;">Don't have an account? <a
                    href="/signup">Sign Up</a></p>
        </div>
    </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
const apiEndpoint = import.meta.env.VUE_APP_API_ENDPOINT;

export default {
    name: "Login",
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    data() {
        const schema = yup.object().shape({
            email: yup.string().required("Email is required!"),
            password: yup.string().required("Password is required!"),
        });

        return {
            loading: false,
            message: "",
            schema,
            email: "",
            password: "",
        };
    },
    computed: {
        loggedIn() {
            return this.$store.state.auth.status.loggedIn;
        },
    },
    created() {
        if (this.loggedIn) {
            this.$router.push("/dashboard");
        }
    },
    methods: {
        handleLogin(user) {
            this.loading = true;

            this.$store.dispatch("auth/login", user).then(
                () => {
                    this.$router.push("/dashboard");
                },
                (error) => {
                    this.loading = false;
                    this.message =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();
                }
            );
        },
    },
};
</script>

<style>
.d-flex {
    display: flex;
    width: 100%;
}

.container {
    flex: 7;
    /* Make the container take 80% of the available width */
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    /* Set the container height to full viewport height */
}

.content img {
    max-width: 100%;
    /* Ensure the image doesn't exceed the container width */
    height: auto;
    /* Maintain aspect ratio */
}

.login-form {
    flex: 3;
    /* Make the login form take 20% of the available width */
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: #f0f0f0;
    /* Add a background color for visibility */
}

.login-form h2 {
    text-align: center;
    margin-bottom: 20px;
}

form {
    display: flex;
    flex-direction: column;
}

label {
    margin-bottom: 5px;
}

input {
    margin-bottom: 10px;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

button {
    padding: 10px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
</style>
