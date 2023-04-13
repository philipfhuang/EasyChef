import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useParams ,useNavigate } from "react-router-dom";
import ContentList from './ContentList';
import {Avatar, Button, Typography, Tabs, TabPane} from '@douyinfe/semi-ui';

const Profile = () => {

    const { Title, Text } = Typography;
    const [profile, setProfile] = useState({});
    const { user_id } = useParams();
    const navigate = useNavigate();

    const editProfileRedirect = () => {
        navigate(`/accounts/profile/edit`);
    }

    useEffect(() => {
        async function fetchData() {
            await axios.get(`http://127.0.0.1:8000/accounts/profile/${user_id}/`)
            .then(response => {
                setProfile(response.data);
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
            <Tabs type="line" style={{fix:1, width:"100%"}}>
                <TabPane tab="Created" itemKey="1">
                    <ContentList content="created" />
                </TabPane>
                <TabPane tab="Favorite" itemKey="2">
                    <ContentList content="favourited" />
                </TabPane>
                <TabPane tab="Interacted" itemKey="3">
                    <ContentList content="interated" />
                </TabPane>
            </Tabs>
        </div>
    );
}

export default Profile;