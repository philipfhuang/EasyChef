import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import IllustrationNoContent from "./IllustrationNoContent.tsx";
import {Card, Checkbox, Empty, InputNumber, List, Typography, Button} from "@douyinfe/semi-ui";
import {useNavigate} from "react-router-dom";
import {IconBookStroked} from "@douyinfe/semi-icons";

export const ShoppingList = () => {
    const { Title, Text } = Typography;

    const [shoppingList, setShoppingList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [serves, setServes] = useState({});
    const [total, setTotal] = useState({});

    const [servesChanged, setServesChanged] = useState(0);
    const [totalChanged, setTotalChanged] = useState(0);

    const firstTime = useRef(true);

    let navigate = useNavigate();

    useEffect(() => {
        if (!servesChanged) {
            if (localStorage.getItem("serves")) {
                setServes(JSON.parse(localStorage.getItem("serves")));
            }
            return
        }

        localStorage.setItem("serves", JSON.stringify(serves));

        console.log(serves);
        let newTotal = {};
        Object.keys(serves).forEach((key) => {
            if (serves[key].checked) {
                if (serves[key].name in newTotal) {
                    newTotal[serves[key].name] += serves[key].value * serves[key].people;
                } else {
                    newTotal[serves[key].name] = serves[key].value * serves[key].people;
                }
            }
        })
        setTotal(newTotal);
        setTotalChanged(Math.random());
    }, [servesChanged])

    useEffect(() => {
        if (!totalChanged) {
            if (localStorage.getItem("total")) {
                setTotal(JSON.parse(localStorage.getItem("total")));
            }
            return
        }
        localStorage.setItem("total", JSON.stringify(total));
    }, [totalChanged])

    useEffect(() => {
        if (!firstTime.current) return;
        firstTime.current = false;

        if (localStorage.getItem("total")) {
            setTotal(JSON.parse(localStorage.getItem("total")));
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
        let name = target.children;

        if (id in serves && !target.checked) {
            const newServes = {...serves};
            delete newServes[id];
            setServes(newServes);
            setServesChanged(Math.random());

        } else if (id in serves) {
            let value = parseInt(target.extra.split(" ")[0]);
            const newIdState = {
                ...serves[id],
                value: value,
                checked: true
            };
            setServes({...serves, [id]: {
                    ...newIdState,
                }});
            setServesChanged(Math.random());
        } else {
            console.log("here");
            let value = parseInt(target.extra.split(" ")[0]);
            setServes({...serves, [id]: {
                    people: 1,
                    checked: true,
                    value: value,
                    name: name
                }});
            setServesChanged(Math.random());
        }
    }

    const addPeople = (id, people, name) => {
        console.log(id, people, name);
        const newIdState = {
            ...serves[id],
            people: people
        }
        setServes({
            ...serves, [id]: {
                ...newIdState,
            }
        });
        setServesChanged(Math.random());
    }

    const deleteShoppingListItem = (id) => {
        const token = JSON.parse(localStorage.getItem('token')).access;
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
            data: {
                id: id
            }
        };
        axios.delete("http://127.0.0.1:8000/accounts/deleteShoppingList/", config)
            .then(() => {
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
                const newServes = {...serves};
                delete newServes[id];
                setServes(newServes);
                setServesChanged(Math.random());
            })
    }


    return (
        <div style={{width:1200, margin:"0 auto", marginTop: 20, marginBottom: 100}}>
            <Title heading={1} style={{marginTop:50, marginBottom:20}}>My Shopping List</Title>
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
                                    <Checkbox key={item.id} aria-label={item.ingredients.ingredient.name}
                                              ingredId={item.id}
                                              extra={`${item.ingredients.quantity} ${item.ingredients.unit.name}`}
                                              onChange={checked => updateServes(checked.target)}
                                              checked={getChecked(item.id)}
                                    >
                                        {item.ingredients.ingredient.name}
                                    </Checkbox>
                                    <Text link={{href : `/recipe/${item.ingredients.recipe}/`}} icon={<IconBookStroked />} underline>
                                        Go to recipe
                                    </Text>
                                </>
                                }
                                extra={
                                <>
                                    <InputNumber defaultValue={serves[item.id] ? serves[item.id].people : 1}
                                                 onNumberChange={(value)=>{addPeople(item.id, value, item.ingredients.ingredient.name)}}
                                                 min={1}
                                                 prefix={'For'}
                                                 suffix={(serves[item.id] ? serves[item.id].people : 1)===1 ? "Person" : "People"}
                                                 style={{width:200}}
                                                 id={item.id}
                                    />
                                    <Button type="danger" onClick={() => {deleteShoppingListItem(item.id)}}>Delete</Button>
                                </>
                                }
                            />
                        )}
                    />
                    <Card
                        title={<h2 style={{textAlign:"center"}}>Calculator</h2>}
                        style={{flex:4, marginLeft: 20}}
                    >
                        <div style={{display:"flex", justifyContent:"space-between"}}>
                            <div style={{width:"100%"}}>
                                <ul style={{width:"100%", margin:0, padding:0}}>
                                    <li key={9999} style={{position:"relative", width:"80%", fontSize:20,
                                        margin:"auto", display:"flex", textAlign:"center", marginBottom:10}}>
                                        <div style={{flex:1, fontWeight:"bold"}}>Ingredients</div>
                                        <div style={{flex:1, fontWeight:"bold"}}>Total Quantity</div>
                                    </li>
                                    {Object.keys(total).map((key, index) => {
                                        return (
                                            <li key={index} style={{position:"relative", width:"80%", fontSize:20,
                                                margin:"auto", display:"flex", textAlign:"center"}}>
                                                <div style={{flex:1}}>{key}</div>
                                                <div style={{flex:1}}>{total[key]}</div>
                                            </li>)
                                    }
                                    )}
                                </ul>
                            </div>
                        </div>
                    </Card>
                </div>
            }
        </div>
    )
}

export default ShoppingList;