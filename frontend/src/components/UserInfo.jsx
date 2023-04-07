import {Avatar, Dropdown} from "@douyinfe/semi-ui";
import {IconEdit, IconUser, IconCart, IconExit, IconUserAdd} from "@douyinfe/semi-icons";
import {Link, useNavigate} from "react-router-dom";


export const UserInfo = () => {
    let navigate = useNavigate();
    const user = localStorage.getItem("user");

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
                            <Avatar size="default" color='orange' style={{margin: "auto"}}>BD</Avatar>
                            <div style={{marginTop: 10}}>Hello World</div>
                        </div>
                    </Dropdown.Title>
                    <Dropdown.Divider/>
                    <Dropdown.Item icon={<IconEdit/>} onClick={()=>{RouterChange("profile", true)}}>
                        Edit Profile
                    </Dropdown.Item>
                    <Dropdown.Item icon={<IconUser/>} onClick={()=>{RouterChange("profile/1", true)}}>
                        My Profile
                    </Dropdown.Item>
                    <Dropdown.Item icon={<IconCart/>} onClick={()=>{RouterChange("shoppinglists", true)}}>
                        Shopping List
                    </Dropdown.Item>
                    <Dropdown.Item icon={<IconExit/>} onClick={()=>{RouterChange("logout", true)}}>
                        Logout
                    </Dropdown.Item>
                </Dropdown.Menu>
            }>
            <Link to={`/profile/1`} style={{textDecoration: "none", color:"black"}}>
                <Avatar size="small" color='orange' style={{margin: "auto"}}>BD</Avatar>
            </Link>
        </Dropdown>
    )
}

export default UserInfo