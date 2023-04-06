import {createContext, useState} from "react";

export const useUserContext = () => {
    const [user, setUser] = useState({
        userinfo: null,
        token: null
    });

    return {
        user,
        setUser
    }
}

const UserContext = createContext(
    {
        user: null,
        setUser: () => {}
    }
)

export default UserContext