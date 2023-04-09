import React, {useEffect, useState} from "react";
import axios from "axios";
import IllustrationNoContent from "./IllustrationNoContent.tsx";
import IllustrationNoResult from "./IllustrationNoResult";
import {Empty} from "@douyinfe/semi-ui";

export const ShoppingList = () => {
    const [shoppingList, setShoppingList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [serves, setServes] = useState({});

    useEffect(() => {
        const config = {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token')).access}`,
                'Content-Type': 'multipart/form-data',
            }
        };
        axios.get("http://localhost:8000/accounts/shoppinglists/", config)
            .then(response => {
                console.log(response.data);
                setShoppingList(response.data);
                setLoading(false);
            })
    },[])

    // if (Object.keys(shoppingList).length === 0 && shoppingList.constructor === Object) {
        return (
            <Empty
                style={{marginTop: 100}}
                image={<IllustrationNoContent style={{ width: 150, height: 150 }} />}
                title={'Your Shopping List is Empty'}
                description="Add some ingredients to your shopping list to see them here."
            />
        )
    // }

    return (
        <>
        </>
    )
}

export default ShoppingList;