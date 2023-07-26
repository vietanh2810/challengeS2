<template>
    <div class="signup-form">
        <h2>Sign Up</h2>
        <Form @submit="handleSubmit" :validation-schema="schema">
            <div class="form-group">
                <label for="userName">Username:</label>
                <Field name="userName" type="text" class="form-control" />
                <ErrorMessage name="userName" class="error-feedback" />
            </div>

            <div class="form-group">
                <label for="password">Password:</label>
                <Field name="password" type="password" class="form-control" />
                <ErrorMessage name="password" class="error-feedback" />
            </div>

            <div class="form-group">
                <label for="passwordConfirmation">Confirm Password:</label>
                <Field name="passwordConfirmation" type="password" class="form-control" />
                <ErrorMessage name="passwordConfirmation" class="error-feedback" />
            </div>

            <div class="form-group">
                <label for="email">Email:</label>
                <Field name="email" type="email" class="form-control" />
                <ErrorMessage name="email" class="error-feedback" />
            </div>

            <div class="form-group">
                <label for="contactInfo">Contact Information:</label>
                <Field name="contactInfo" type="text" class="form-control" />
                <ErrorMessage name="contactInfo" class="error-feedback" />
            </div>

            <div class="form-group">
                <label for="companyName">Company Name:</label>
                <Field name="companyName" type="text" class="form-control" />
                <ErrorMessage name="companyName" class="error-feedback" />
            </div>

            <div class="form-group">
                <label for="kbis">KBIS (PDF file):</label>
                <Field name="kbis" type="file" class="form-control" accept="application/pdf" />
                <ErrorMessage name="kbis" class="error-feedback" />
            </div>

            <div class="form-group">
                <label for="websiteUrl">Website URL:</label>
                <Field name="websiteUrl" type="url" class="form-control" />
                <ErrorMessage name="websiteUrl" class="error-feedback" />
            </div>
            <button type="submit">Sign Up</button>
        </Form>
    </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

export default {
    name: "SignUp",
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    data() {
        const schema = yup.object().shape({
            userName: yup.string().required("Username is required!"),
            password: yup
                .string()
                .required("Password is required!")
                .min(8, "Password must be at least 8 characters"),
            passwordConfirmation: yup
                .string()
                .oneOf([yup.ref("password"), null], "Passwords do not match")
                .required("Password confirmation is required!"),
            email: yup.string().required("Email is required!").email("Invalid email format"),
            contactInfo: yup.string().required("Contact Information is required!"),
            companyName: yup.string().required("Company Name is required!"),
            kbis: yup.mixed().required("KBIS (PDF file) is required!"),
            websiteUrl: yup.string().url("Invalid URL format").required("Website URL is required!"),
        });

        return {
            schema,
            userData: {
                userName: "",
                password: "",
                // passwordConfirmation: "",
                email: "",
                contactInfo: "",
                companyName: "",
                kbis: null,
                websiteUrl: "",
            },
        };
    },
    methods: {
        handleSubmit(user) {
            delete user.passwordConfirmation;

            this.$store.dispatch("auth/register", user).then(
                () => {
                    // this.$router.push("/login");
                    console.log("User registered successfully!")
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
            )
        },
    },
};
</script>

<style>
/* Your custom styles here */
</style>

<style>
.signup-form {
    max-width: 400px;
    margin: 4rem auto;
}

.form-group {
    margin-bottom: 1rem;
}

label {
    display: block;
    font-weight: bold;
}

input[type="text"] {
    display: block;
    width: 100% !important;
    padding: 8px 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
}

/* input[type="file"] {
    display: none;
} */

button[type="submit"] {
    background-color: #007bff;
    color: #fff;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
</style>
