import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import IllustrationNoContent from "./IllustrationNoContent.tsx";
import {Card, Checkbox, Empty, List} from "@douyinfe/semi-ui";
import {Link, useNavigate} from "react-router-dom";

export const ShoppingList = () => {
    const [shoppingList, setShoppingList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [serves, setServes] = useState({});
    const [total, setTotal] = useState({});

    const firstTime = useRef(true);

    let navigate = useNavigate();

    useEffect(() => {
        if (!firstTime.current) return;
        firstTime.current = false;

        if (localStorage.getItem("total")) {
            setTotal(JSON.parse(localStorage.getItem("total")));
        }

        if (localStorage.getItem("serves")) {
            setServes(JSON.parse(localStorage.getItem("serves")));
        }

        let token;
        try {
            token = JSON.parse(localStorage.getItem('token')).access;
        }
        catch (e) {
            navigate('/login');
        }
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            }
        };
        axios.get("http://localhost:8000/accounts/shoppinglists/", config)
            .then(response => {
                setShoppingList(response.data.results);
                setLoading(false);
            })
    },[])

    const getChecked = (id) => {
        if (id in serves) {
            return serves[id].checked;
        }
        return false;
    }
    const updateServes = (target) => {
        let id = target.ingredId;
        if (id in serves && !serves[id].checked) {
            setServes(current => {
                const {id, ...rest} = current;
                return rest;
            })
            const name = target.children;
            setTotal({...total, [name]: total[name] - parseInt(target.extra.split(" ")[0])})
            localStorage.setItem("serves", JSON.stringify(serves));
            localStorage.setItem("total", JSON.stringify(total));
            return;
        }
        if (id in serves && serves[id].checked) {
            let value = parseInt(target.extra.split(" ")[0]) + serves[target.ingredId];
            setServes({...serves, [id]: {
                    checked: true,
                    value: value
                }});
        } else {
            setServes({...serves, [id]: {
                    checked: true,
                    value: parseInt(target.extra.split(" ")[0])
                }});
        }

        const name = target.children
        if (name in total) {
            setTotal({...total, [name]: total[name] + parseInt(target.extra.split(" ")[0])});
        } else {
            setTotal({...total, [name]: parseInt(target.extra.split(" ")[0])});
        }
    }

    return (
        <div style={{width:1200, margin:"0 auto", marginTop: 20, marginBottom: 100}}>
            <h1>My Shopping List</h1>
            {shoppingList.length === 0 && !loading ? <Empty
                    style={{marginTop: 100}}
                    image={<IllustrationNoContent style={{ width: 150, height: 150 }} />}
                    title={'Your Shopping List is Empty'}
                    description="Add some ingredients to your shopping list to see them here"
                />
                :<div style={{width: 1200, display:"flex",}}>
                    <List
                        style={{flex:3}}
                        dataSource={shoppingList}
                        renderItem={item => (
                            <List.Item
                                main={
                                <>
                                    <Checkbox key={item.id} aria-label={item.ingredients.id}
                                              ingredId={item.ingredients.id}
                                              extra={`${item.ingredients.quantity} ${item.ingredients.unit.name}`}
                                              onChange={checked => updateServes(checked.target)}
                                              checked={getChecked(item.ingredients.id)}
                                    >
                                        {item.ingredients.ingredient.name}
                                    </Checkbox>
                                    <Link to={`/recipe/${item.ingredients.recipe}/`}>Go to recipe</Link>
                                </>
                                }
                                extra={
                                    <div>hello</div>
                                }
                            />
                        )}
                    />
                    <Card
                        title={<h2 style={{textAlign:"center"}}>Calculator</h2>}
                        style={{flex:4, marginLeft: 20}}
                    >
                        <List
                            dataSource={total}
                            renderItem={item => (
                                <List.Item
                                    main={
                                        <div>
                                            <h3>{item}</h3>
                                            <p>{total[item]} {item}</p>
                                        </div>
                                    }
                                />
                            )}
                        />
                    </Card>
                </div>
            }
        </div>
    )
}

export default ShoppingList;