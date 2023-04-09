import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";
import ContentList from './ContentList';
import { Avatar, Button, Tooltip } from '@douyinfe/semi-ui';

const Profile = () => {

    const [profile, setProfile] = useState(null);

    const [contentToShow, setContentToShow] = useState([]);
    const { user_id } = useParams();

    const changeContent = (number) => {
        if (number === 1) {
            setContentToShow(profile.created_recipes);
        } else if (number === 2) {
            setContentToShow(profile.liked_recipes);
        } else if (number === 3) {
            setContentToShow(profile.favored_recipes);
        } else if (number === 4) {
            setContentToShow(profile.commented_recipes);
        }
    }

    window.onload = async () => {
        try {
            console.log("1")
            const response = await axios.get(`http://127.0.0.1:8000/accounts/profile/${user_id}/`)
            console.log(user_id);
            console.log(response.data);
            setProfile(response.data);
            setContentToShow(response.data.created_recipes);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    return (
        <div>
            {console.log(profile)}
            {
                profile !== null && (profile.avatar ? (
            <Avatar size="large" style={{ margin: 4 }} alt='User'>
                {profile.avatar}
            </Avatar>) : (
                <p>No avatar</p>))
            }
            <div>
                <h1>{profile.first_name} {profile.last_name}</h1>
                <h2>{profile.email}</h2>
                <h2>{profile.phone_number}</h2>
            </div>
            <div>
                <Button onClick={changeContent(1)}>Created Recipes</Button>
                <Button onClick={changeContent(2)}>Liked Recipes</Button>
                <Button onClick={changeContent(3)}>Favorited Recipes</Button>
                <Button onClick={changeContent(4)}>Commented Recipes</Button>
            </div>
            <div>
                <ContentList content={contentToShow}/>
            </div>
        </div>
    );
}

export default Profile;