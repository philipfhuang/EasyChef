import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import {Button, Form} from "@douyinfe/semi-ui";

import logo from "../images/logo-name-h.png";


export const Signup = () => {
    let res = null;
    let navigate = useNavigate();
    const validatePhone = (phone) => {
        if (!phone) {
            return '';
        }
        const regex = /^\d{3}-\d{3}-\d{4}$/;
        if (!regex.test(phone)) {
            return "Number must be in the format 123-456-7890";
        }
        return '';
    }

    const validateEmail = (email) => {
        if (!email) {
            return '';
        }
        const regex = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/;
        if (!regex.test(email)) {
            return "Email is invalid";
        }
        return '';
    }

    const signupValidate = (values) => {
        let errors = {};

        if (!values.first_name) {
            errors.first_name = "First Name is required";
        }
        if (!values.last_name) {
            errors.last_name = "Last Name is required";
        }
        if (validateEmail(values.email)) {
            errors.email = "Email is invalid";
        }
        if (validatePhone(values.phone)) {
            errors.phone = "Phone number is invalid";
        }
        if (!values.username) {
            errors.username = "Username is required";
        }
        if (!values.password) {
            errors.password = "Password is required";
        }
        if (values.password !== values.password2 && values.password2) {
            errors.password2 = "Passwords do not match";
        }
        if (Object.keys(errors).length > 0) {
            return errors;
        }

        return axios.post("http://localhost:8000/accounts/signup/", values)
            .then(response => {
                res = response.data;
            })
            .catch(error => {
                const ers = error.response.data
                for (const key in ers) {
                    errors[key] = ers[key][0];
                }
                return errors;
            });
    }
    const signupSuccess = (values) => {
        axios.post("http://localhost:8000/accounts/login/", values)
            .then(response => {
                const result = response.data;
                localStorage.setItem("token", JSON.stringify(result));
                const user_id = jwt_decode(result.access).user_id;
                axios.get(`http://localhost:8000/accounts/profile/${user_id}/`)
                    .then(response => {
                        localStorage.setItem("user", JSON.stringify(response.data));
                        navigate("/");
                    })
            });
    }
    return (
        <div style={{width: 300, margin: "0 auto", marginTop: 70}}>
            <img src={logo} alt="logo" style={{width: "100%", height: "100%"}}/>
            <Form style={{marginTop: 10}} validateFields={values => signupValidate(values)} onSubmit={signupSuccess}>
                <Form.InputGroup>
                    <Form.Input field='first_name' label='First Name' placeholder='First Name' style={{width:"50%"}}/>
                    <Form.Input field='last_name' label='Last Name' placeholder='Last Name' style={{width:"50%"}}/>
                </Form.InputGroup>
                <Form.Input field='username' label='Username' placeholder='Username'/>
                <Form.Input field='phone_number' label='Phone' placeholder='Phone' validate={validatePhone}/>
                <Form.Input field='email' label='Email' placeholder='Email' validate={validateEmail}/>
                <Form.Input field='password' label='Password' placeholder='Password' mode='password'/>
                <Form.Input field='password2' label='Confirm Password' placeholder='Confirm Password' mode='password'/>
                <div style={{display: "flex", justifyContent: "center", marginTop: 10}}>
                    <Button htmlType="submit" theme="solid"
                            style={{width: 100, backgroundColor: "#976332"}}>Signup</Button>
                </div>
            </Form>
            <Link to={"/login"} style={{display: "flex", justifyContent: "center", marginTop: 20}}>
                Already have an account? Login
            </Link>
        </div>
    )
}

export default Signup;