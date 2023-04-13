import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Avatar, Toast } from '@douyinfe/semi-ui';

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
            await axios.get(`http://127.0.0.1:8000/accounts/profile/${user_id}/`)
            .then(response => {
                setFirstName(response.data.first_name);
                setLastName(response.data.last_name);
                setEmail(response.data.email);
                setPhoneNumber(response.data.phone_number);
                setAvatar(response.data.avatar);
            })
        }
        fetchData();
    }, []);


    const input_width = 250;

    const validatePhone = (phone) => {
        if (!phone) {
            return '';
        }
        const regex = /^\d{3}-\d{3}-\d{4}$/;
        if (!regex.test(phone)) {
            return "Number must be in the format 123-456-7890";
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

    const submitChange = (value) => {

        let form = new FormData();
        if (avatarPreview !== "") {
            form.append('avatar', avatarPreview);
        }
        Object.keys(value).forEach(key => {
            if (key !== 'avatarPreview') {
                form.append(key, value[key]);
            }
        });
        
        const storedToken = localStorage.getItem('token');
        const accessToken = JSON.parse(storedToken).access;
        const config = {
            headers: {Authorization: `Bearer ${accessToken}`}
        };
        axios.patch('http://127.0.0.1:8000/accounts/profile/', form, config);
        window.location.reload();
        Toast.success("profile changed successfully!");
    }

    
    //Return the edit profile form
    return (
        <div style={{width:'100%', maxWidth:800, margin: "0 auto", marginTop:10, display:"flex", flexDirection:"column", alignItems:"center"}}>
            <Form layout='vertical' onSubmit={value=>{submitChange(value)}}>
                <Avatar size="extra-large" color='orange' style={{margin: "0 auto"}} src={avatar}>
                    {first_name? first_name.charAt(0).toUpperCase()+last_name.charAt(0).toUpperCase():""}
                </Avatar>
                <br/>
                <br/>
                <input type="file" accept="image/*" name="avatarPreview" key={avatarPreview ? "avatarPreview" : "no_ap"} onChange={e=>{
                    setAvatarPreview(e.target.files[0])
                    Toast.success("Upload avatar successfully!");
                }}/>
                <br/>
                <br/>
                <Form.Input field='first_name' label='First Name' key={first_name ? "first_name" : "no_fn"} initValue={first_name} validate={validateFirstName} style={{ width: input_width }} type="text"/>
                <Form.Input field='last_name' label='Last Name' key={last_name ? "last_name" : "no_ln"} initValue={last_name} validate={validateLastName} style={{ width: input_width }} type="text"/>
                <Form.Input field='email' label='Email' key={email ? "email" : "no_email"} validate={validateEmail} initValue={email} style={{ width: input_width }}/>
                <Form.Input field='phone_number' label='Phone Number' key={phone_number ? "phone_number" : "no_phone_number"} validate={validatePhone} initValue={phone_number} style={{ width: input_width }}/>
                <Button htmlType='submit'>Set change</Button>
            </Form>
        </div>
    );
};

export default EditProfile;