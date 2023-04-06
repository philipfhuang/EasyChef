import logo from '../images/logo-name-h.png'
import {Button, Form} from "@douyinfe/semi-ui";
import {useContext} from "react";
import jwt_decode from "jwt-decode";

import UserContext from "../contexts/UserContext";
import {useNavigate} from "react-router-dom";

export const Login = () => {
    const {user, setUser} = useContext(UserContext);

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

        var form = new FormData();
        form.append("username", values.username);
        form.append("password", values.password);

        var requestOptions = {
            method: 'POST',
            body: form
        };

        return fetch("http://localhost:8000/accounts/login/", requestOptions)
                .then(response => {
                if (response.status === 401) {
                    errors.username = "Username or password is incorrect";
                    errors.password = "Username or password is incorrect";
                    return errors;
                }
                res = response.json();
            })
    }
    const loginSuccess = () => {
        res.then(result => {
            setUser({token: result})
            const user_id = jwt_decode(result.access).user_id;
            fetch(`http://localhost:8000/accounts/profile/${user_id}/`, {method: 'GET'})
                .then(response => response.json())
                .then(res => {
                    setUser((params) => ({...params, userinfo: res}));
                })
        })
        navigate("/");
    }
    return (

        <div style={{width: 300, margin: "0 auto", marginTop: 100}}>
            <img src={logo} alt="logo" style={{width: "100%"}}/>
            <Form style={{marginTop: 10}} validateFields={values => loginValidate(values)} onSubmit={loginSuccess}>
                <Form.Input field='username' label='Username' placeholder='Username'/>
                <Form.Input field='password' label='Password' placeholder='Password' mode='password'/>
                <div style={{display: "flex", justifyContent: "center", marginTop: 10}}>
                    <Button htmlType="submit" theme="solid"
                            style={{width: 100, backgroundColor: "#976332"}}>Login</Button>
                </div>
            </Form>
        </div>

    )
}

export default Login