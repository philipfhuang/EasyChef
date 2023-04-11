import {Avatar, Dropdown} from "@douyinfe/semi-ui";
import {IconEdit, IconUser, IconCart, IconExit, IconUserAdd} from "@douyinfe/semi-icons";
import {Link, useNavigate} from "react-router-dom";


export const UserInfo = () => {
    let navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const RouterChange = (path, needAuth) => {
        if (needAuth && !user) {
            navigate(`/login`)
            return
        }
        navigate(path)
    }

    if (!user) return (
        <Dropdown
            position={'bottom'}
            render={
                <Dropdown.Menu>
                    <Dropdown.Item icon={<IconUser/>} onClick={()=>{RouterChange("login", false)}}>
                        Login
                    </Dropdown.Item>
                    <Dropdown.Item icon={<IconUserAdd/>} onClick={()=>{RouterChange("signup", false)}}>
                        Sign Up
                    </Dropdown.Item>
                </Dropdown.Menu>
            }
        >
            <Link to={`/accounts/profile/1/`} style={{textDecoration: "none", color:"black"}}>
                <Avatar size="small" color='orange' style={{margin: "auto"}}>U</Avatar>
            </Link>
        </Dropdown>
    )

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("serves");
        localStorage.removeItem("total");
        navigate("/")
    }

    return (
        <Dropdown
            position={'bottom'}
            render={
                <Dropdown.Menu>
                    <Dropdown.Title>
                        <div style={{
                            margin: "auto",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            width: 150
                        }}>
                            <Avatar size="small" color='orange' style={{margin: "auto"}} src={user.avatar}>
                                {user.first_name.charAt(0).toUpperCase()}{user.last_name.charAt(0).toUpperCase()}
                            </Avatar>
                            <div style={{marginTop: 10, color:"#1C1F23", fontSize:15}}>{user.first_name} {user.last_name}</div>
                            <div style={{}}>@{user.username}</div>
                        </div>
                    </Dropdown.Title>
                    <Dropdown.Divider/>
                    <Dropdown.Item icon={<IconUser/>} onClick={()=>{RouterChange(`accounts/profile/${user.id}`, true)}}>
                        My Profile
                    </Dropdown.Item>
                    <Dropdown.Item icon={<IconEdit/>} onClick={()=>{RouterChange("profile", true)}}>
                        Edit Profile
                    </Dropdown.Item>
                    <Dropdown.Item icon={<IconCart/>} onClick={()=>{RouterChange("shoppinglist", true)}}>
                        Shopping List
                    </Dropdown.Item>
                    <Dropdown.Item icon={<IconExit/>} onClick={logout}>
                        Logout
                    </Dropdown.Item>
                </Dropdown.Menu>
            }>
            <Link to={`accounts/profile/${user.id}`} style={{textDecoration: "none", color:"black"}}>
                <Avatar size="small" color='orange' style={{margin: "auto"}} src={user.avatar}>
                    {`${user.first_name.charAt(0).toUpperCase()}${user.last_name.charAt(0).toUpperCase()}`}
                </Avatar>
            </Link>
        </Dropdown>
    )
}

export default UserInfo