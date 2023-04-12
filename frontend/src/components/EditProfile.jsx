import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";
import { Form, Button, Avatar, Tooltip } from '@douyinfe/semi-ui';

const EditProfile = () => {
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone_number, setPhoneNumber] = useState("");
    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("");

    const user_id = JSON.parse(localStorage.getItem('user')).id;
    if (!user_id) {
        window.location.href = "/login/";
    }

    useEffect(() => {
        async function fetchData() {
            //console.log("1")
            await axios.get(`http://127.0.0.1:8000/accounts/profile/${user_id}/`)
            .then(response => {
                //console.log(response.data);
                setFirstName(response.data.first_name);
                setLastName(response.data.last_name);
                setEmail(response.data.email);
                setPhoneNumber(response.data.phone_number);
                setAvatar(response.data.avatar);
            })
        }
        fetchData();
    }, []);

    // const handleProfileChange = async () => {
    //     try {
    //         let errors = {};

    //         if (first_name === "") {
    //             errors.first_name = "No First Name";
    //         }
    //         if (last_name === "") {
    //             errors.last_name = "No Last Name";
    //         }
    //         if (validateEmail(email) !== "") {
    //             errors.email = validateEmail(email);
    //         }
    //         if (validatePhone(phone_number) !== "") {
    //             errors.phone_number = validatePhone(phone_number);
    //         }
    //         if (Object.keys(errors).length > 0) {
    //             return errors;
    //         }

    //         const storedToken = localStorage.getItem('token');
    //         const accessToken = JSON.parse(storedToken).access;

    //         const config = {
    //             headers: {Authorization: `Bearer ${accessToken}`}
    //         };

    //         const formData = {
    //             first_name: first_name,
    //             last_name: last_name,
    //             email: email,
    //             phone_number: phone_number,
    //             avatar: avatar
    //         }
    //         console.log(formData);
    //         await axios.patch('http://127.0.0.1:8000/accounts/profile/', formData, config);
    //     }
    //     catch (error) {
    //         console.log("Error uploading profile: ", error);
    //     }
    // };

    const input_width = 250;

    const validatePhone = (phone) => {
        if (!phone) {
            return '';
        }
        const regex = /^\d{3}-\d{3}-\d{4}$/;
        if (!regex.test(phone)) {
            return "Phone number is invalid";
        }
        setPhoneNumber(phone);
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
        setEmail(email);
        return '';
    }

    const validateFirstName = (firstName) => {
        if (!firstName) {
            return 'No First Name';
        }
        setFirstName(firstName);
        return '';
    }

    const validateLastName = (lastName) => {
        if (!lastName) {
            return 'No Last Name';
        }
        setLastName(lastName);
        return '';
    }

    // const handleFileChange = async (avatar) => {
    //     try {
    //         setAvatar(avatar);

    //         const storedToken = localStorage.getItem('token');
    //         const accessToken = JSON.parse(storedToken).access;

    //         const config = {
    //             headers: {Authorization: `Bearer ${accessToken}`}
    //         };
            
    //         const fileData = {
    //             avatar: avatar
    //         };
    //         console.log(fileData);
    //         await axios.patch('http://127.0.0.1:8000/accounts/profile/', fileData, config);
    //     }
    //     catch (error) {
    //         console.log("Error uploading profile: ", error);
    //     }
    // }
    
    // console.log(first_name);
    // console.log(last_name);
    // console.log(email);
    // console.log(phone_number);

    const submitChange = (value) => {

        console.log(value, "value");
        console.log("avatar", avatar);

        let form = new FormData();
        if (avatarPreview !== "") {
            form.append('avatar', avatarPreview);
        }
        Object.keys(value).forEach(key => {
            if (key !== 'avatarPreview' || (key === 'avatarPreview' && value[key] !== null)) {
                form.append(key, value[key]);
            }
        });
        
        const storedToken = localStorage.getItem('token');
        const accessToken = JSON.parse(storedToken).access;
        const config = {
            headers: {Authorization: `Bearer ${accessToken}`}
        };
        console.log("form",form);
        axios.patch('http://127.0.0.1:8000/accounts/profile/', form, config);
        window.location.reload();
    }

    
    //Return the edit profile form
    return (
        <div>
            <Form layout='vertical' onSubmit={value=>{submitChange(value)}}>
                <Avatar size="large" color='orange' style={{margin: "auto"}} src={avatar}>
                    {first_name? first_name.charAt(0).toUpperCase()+last_name.charAt(0).toUpperCase():""}
                </Avatar>
                {/* <Form.Upload field='avatar' label='Avatar' onChange={submitAvatar} uploadTrigger="custom" style={{ width: input_width }}>
                    <Button theme="light">
                        Upload Picture
                    </Button>
                </Form.Upload> */}
                <br></br>
                <input type="file" accept="image/*" name="avatarPreview" key="avatarPreview" onChange={e=>{setAvatarPreview(e.target.files[0])}}/>
                <Form.Input field='first_name' label='FirstName' key={first_name ? "first_name" : "no_fn"} initValue={first_name} validate={validateFirstName} style={{ width: input_width }} type="text"/>
                <Form.Input field='last_name' label='LastName' key={last_name ? "last_name" : "no_ln"} initValue={last_name} validate={validateLastName} style={{ width: input_width }} type="text"/>
                <Form.Input field='email' label='email' key={email ? "email" : "no_email"} validate={validateEmail} initValue={email} style={{ width: input_width }}/>
                <Form.Input field='phone_number' label='PhoneNumber' key={phone_number ? "phone_number" : "no_phone_number"} validate={validatePhone} initValue={phone_number} style={{ width: input_width }}/>
                <Button htmlType='submit'>Set change</Button>
            </Form>
        </div>
    );
};

export default EditProfile;