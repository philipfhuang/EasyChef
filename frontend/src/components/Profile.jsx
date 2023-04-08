import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";
import { Avatar, Button, Tooltip } from '@douyinfe/semi-ui';

const Profile = () => {

    const [first_name, setFirst] = useState(null);
    const [last_name, setLast] = useState(null);
    const [email, setEmail] = useState(null);
    const [phone_number, setPhone] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [created_recipes, setCreatedRecipes] = useState([]);
    const [liked_recipes, setLikedRecipes] = useState([]);
    const [favored_recipes, setFavoredRecipes] = useState([]);
    const [commented_recipes, setCommentedRecipes] = useState([]);

    const [contentToShow, setContentToShow] = useState([]);

    function changeContent(number) {
        if (number === 1) {
            setContentToShow(created_recipes);
        } else if (number === 2) {
            setContentToShow(liked_recipes);
        } else if (number === 3) {
            setContentToShow(favored_recipes);
        } else if (number === 4) {
            setContentToShow(commented_recipes);
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const { user_id } = useParams();
                const response = await axios.get('http://127.0.0.1:8000/accounts/profile/${user_id}/',
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

            setCreatedRecipes(response.data.created_recipes);
            setLikedRecipes(response.data.liked_recipes);
            setFavoredRecipes(response.data.favored_recipes);
            setCommentedRecipes(response.data.commented_recipes);

            setContentToShow(created_recipes);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        }
        fetchData();
    }, []);

    if (!email) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Avatar size="large" style={{ margin: 4 }} alt='User'>
                {avatar}
            </Avatar>
            <div>
                <h1>{first_name} {last_name}</h1>
                <h2>{email}</h2>
                <h2>{phone_number}</h2>
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