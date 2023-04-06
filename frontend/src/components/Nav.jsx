import {Link, Outlet, useNavigate} from "react-router-dom";
import * as React from "react";
import {Nav, Button} from '@douyinfe/semi-ui';
import {IconSemiLogo, IconBriefStroked} from '@douyinfe/semi-icons';

import Search from "./Search";
import UserInfo from "./UserInfo";
import UserContext, {useUserContext} from "../contexts/UserContext";
import {useContext} from "react";

export const MyNav = () => {
    let navigate = useNavigate();
    const {user, setUser} = useContext(UserContext);

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
                    renderWrapper={({itemElement, isSubNav, isInSubNav, props}) => {
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
                        logo: <IconSemiLogo style={{height: '36px', fontSize: 36}}/>,
                        text: 'Easychef'
                    }}
                    footer={
                        <UserContext.Provider value={useUserContext()}>
                            <UserInfo/>
                            <Button theme='solid'
                                    type='warning'
                                    icon={<IconBriefStroked/>}
                                    style={{marginLeft: 20, borderRadius:5, backgroundColor:"#976332"}}
                                    onClick={RouterChange}
                            >
                                New Recipe
                            </Button>
                        </UserContext.Provider>
                    }
                />
            </div>
            <Outlet/>
        </>
    )
}

export default MyNav