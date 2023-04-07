import {Link, useNavigate} from "react-router-dom";
import axios from "axios";

import logo from '../images/logo-name-h.png'
import {Button, Form} from "@douyinfe/semi-ui";
import jwt_decode from "jwt-decode";

export const Login = () => {

    let res = null;
    let navigate = useNavigate();
    const loginValidate = (values) => {
        let errors = {};

        if (!values.username) {
            errors.username = "Username is required";
        }
        if (!values.password) {
            errors.password = "Password is required";
        }
        if (Object.keys(errors).length > 0) {
            return errors;
        }

        return axios.post("http://localhost:8000/accounts/login/", values)
            .then(response => {
                res = response.data;
            })
            .catch(error => {
                if (error.response.status === 401) {
                    errors.username = "Username or password is incorrect";
                    errors.password = "Username or password is incorrect";
                    return errors;
                }
            });
    }
    const loginSuccess = () => {
        localStorage.setItem("token", JSON.stringify(res));
        const user_id = jwt_decode(res.access).user_id;
        axios.get(`http://localhost:8000/accounts/profile/${user_id}/`)
            .then(response => {
                localStorage.setItem("user", JSON.stringify(response.data));
                navigate("/");
            })
    }
    return (
        <div style={{width: 300, margin: "0 auto", marginTop: 100}}>
            <img src={logo} alt="logo" style={{width: "100%", height: "100%"}}/>
            <Form style={{marginTop: 10}} validateFields={values => loginValidate(values)} onSubmit={loginSuccess}>
                <Form.Input field='username' label='Username' placeholder='Username'/>
                <Form.Input field='password' label='Password' placeholder='Password' mode='password'/>
                <div style={{display: "flex", justifyContent: "center", marginTop: 10}}>
                    <Button htmlType="submit" theme="solid"
                            style={{width: 100, backgroundColor: "#976332"}}>Login</Button>
                </div>
            </Form>
            <Link to={"/signup"} style={{display: "flex", justifyContent: "center", marginTop: 20}}>
                Don't have an account yet? Sign up
            </Link>
        </div>
    )
}

export default Login