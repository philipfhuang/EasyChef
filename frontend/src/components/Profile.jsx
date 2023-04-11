import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useParams ,useNavigate } from "react-router-dom";
import ContentList from './ContentList';
import { Avatar, Button, Typography, Tabs, TabPane } from '@douyinfe/semi-ui';

const Profile = () => {

    const { Title, Text } = Typography;

    const [profile, setProfile] = useState({});

    const [contentToShow, setContentToShow] = useState([]);
    const { user_id } = useParams();
    const navigate = useNavigate();

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

    const editProfileRedirect = () => {
        navigate(`/accounts/profile/edit`);
    }

    useEffect(() => {
        async function fetchData() {
            await axios.get(`http://127.0.0.1:8000/accounts/profile/${user_id}/`)
            .then(response => {
                setProfile(response.data);
                setContentToShow(response.data.created_recipes);
            })
        }
        fetchData();
    }, [user_id]);

    return (
        <div style={{width:'100%', maxWidth:800, margin: "0 auto", marginTop:10, display:"flex", flexDirection:"column", alignItems:"center"}}>
            <div style={{flex:1, width:"100%", display:"flex", flexDirection:"column", alignItems:"center", marginTop:10 }}>
                <Avatar size="large" color='orange' style={{margin: "auto"}} src={profile.avatar}>
                    {profile.first_name? profile.first_name.charAt(0).toUpperCase()+profile.last_name.charAt(0).toUpperCase():""}
                </Avatar>
                <Title heading={3} style={{marginTop:8}}>{profile.first_name} {profile.last_name}</Title>
                <Text type="secondary" style={{marginTop:8}}>@{profile.username}</Text>
                <Text type="secondary" style={{marginTop:8}}>Email: {profile.email?profile.email:"-"}</Text>
                <Text type="secondary" style={{marginTop:8}}>Phone: {profile.phone_number?profile.phone_number:"-"}</Text>
            </div>
                <Button onClick={editProfileRedirect} style={{marginTop:8}}>Edit Profile</Button>
            <br></br>
            <div>
                <Button onClick={() => {changeContent(1)}}>Created Recipes</Button>
                <Button onClick={() => {changeContent(2)}}>Liked Recipes</Button>
                <Button onClick={() => {changeContent(3)}}>Favorited Recipes</Button>
                <Button onClick={() => {changeContent(4)}}>Commented Recipes</Button>
            </div>
            <div>
                <ContentList content={contentToShow}/>
            </div>
        </div>
    );
}

export default Profile;