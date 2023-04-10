import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";
import { Form, Button, Tooltip } from '@douyinfe/semi-ui';

const EditProfile = () => {
    const [first_name, setFirst] = useState(null);
    const [last_name, setLast] = useState(null);
    const [email, setEmail] = useState(null);
    const [phone_number, setPhone] = useState(null);
    const [avatar, setAvatar] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const user_id = localStorage.getItem('user');
                console.log(user_id);
                const response = await axios.get(`http://127.0.0.1:8000/accounts/profile/${user_id}/`,
                {headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true,
                    "Access-Control-Allow-Origin": "*",
                }
            });
            setFirst(response.data.first_name);
            setLast(response.data.last_name);
            setEmail(response.data.email);
            setPhone(response.data.phone_number);
            setAvatar(response.data.avatar);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        }
        fetchData();
    }, []);

    const handleFirstChange = (e) => {
        setFirst(e.target.value);
    };

    const handleLastChange = (e) => {
        setLast(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePhoneChange = (e) => {
        setPhone(e.target.value);
    };

    const handleAvatarChange = (e) => {
        setAvatar(e.target.value);
    };

    const handleProfileChange = async () => {
        try {
            const storedToken = localStorage.getItem('token');
            const accessToken = JSON.parse(storedToken).access;
    
            const config = {
                headers: { Authorization: `Bearer ${accessToken}` }
            };

            //const { id } = useParams();

            const formData = {
                first_name: first_name,
                last_name: last_name,
                email: email,
                phone_number: phone_number,
                avatar: avatar
            }
            await axios.put('http://127.0.0.1:8000/accounts/profile/', formData, config);
        }
        catch (error) {
            console.log("Error uploading profile: ", error);
        }
    };

    if (!email) {
        return <div>Loading...</div>;
    }

    const input_width = 200;
    
    //Return the edit profile form
    return (
        <div>
            <Form layout='vertical' onValueChange={values=>console.log(values)}>
                <Form.Upload field='files' label='Avatar' initValue={{avatar}} style={{ width: input_width }}>
                    <Button theme="light" onClick={handleAvatarChange}>
                        Upload Picture
                    </Button>
                </Form.Upload>
                <Form.Input field='FirstName' label='FirstName' onChange={handleFirstChange} initValue={{first_name}} style={{ width: input_width }}/>
                <Form.Input field='LastName' label='LastName' onChange={handleLastChange} initValue={{last_name}} style={{ width: input_width }}/>
                <Form.Input field='Email' label='email' onChange={handleEmailChange} initValue={{email}} style={{ width: input_width }}/>
                <Form.Input field='PhoneNumber' label='PhoneNumber' onChange={handlePhoneChange} initValue={{phone_number}} style={{ width: input_width }}/>
                <Button onClick={handleProfileChange}>Set change</Button>
            </Form>
        </div>
    );
};

export default EditProfile;