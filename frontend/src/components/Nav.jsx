import {Link, Outlet, useNavigate} from "react-router-dom";
import * as React from "react";
import {Nav, Button} from '@douyinfe/semi-ui';
import {IconBriefStroked} from '@douyinfe/semi-icons';

import logo from "../images/logo.png";
import Search from "./Search";
import UserInfo from "./UserInfo";
import SearchContext, {useSearcContext} from "../contexts/SearchContext";

export const MyNav = () => {
    let navigate = useNavigate();
    const user = localStorage.getItem("user");

    const RouterChange = () => {
        if (!user) {
            navigate(`/login`)
            return
        }
        navigate("/recipe/")
    }

    return (
        <>
            <div style={{height:59, backgroundColor:"#000"}}>
                <Nav
                    renderWrapper={({itemElement, props}) => {
                        const routerMap = {
                            home: "/",
                            explore: "/explore"
                        };
                        return (
                            <Link
                                style={{textDecoration: "none"}}
                                to={routerMap[props.itemKey]}
                            >
                                {itemElement}
                            </Link>
                        );
                    }}
                    style={{width: '100%', position: 'fixed', zIndex: 1000}}
                    mode={'horizontal'}
                    items={[
                        {itemKey: 'home', text: 'Home'},
                        {itemKey: 'explore', text: 'Explore'},
                        {itemKey: 'search', text: <Search/>, style: {paddingTop: '2px', paddingBottom: '0'}},
                    ]}
                    // onSelect={key => console.log(key)}
                    header={{
                        logo: <img src={logo} style={{height: 40}}/>,
                        text: 'Easychef'
                    }}
                    footer={
                        <>
                            <UserInfo/>
                            <Button theme='solid'
                                    type='warning'
                                    icon={<IconBriefStroked/>}
                                    style={{marginLeft: 20, borderRadius:5, backgroundColor:"#976332"}}
                                    onClick={RouterChange}
                            >
                                New Recipe
                            </Button>
                        </>
                    }
                />
            </div>
            <Outlet/>
        </>
    )
}

export default MyNav