import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import IllustrationNoContent from "./IllustrationNoContent.tsx";
import {Card, Checkbox, Empty, InputNumber, List} from "@douyinfe/semi-ui";
import {Link, useNavigate} from "react-router-dom";

export const ShoppingList = () => {
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
    }, [servesChanged])

    useEffect(() => {
        if (!totalChanged) {
            if (localStorage.getItem("total")) {
                setTotal(JSON.parse(localStorage.getItem("total")));
            }
            console.log(total);
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

        if (id in serves && !target.checked) {
            console.log("if");
            const newServes = {...serves};
            delete newServes[id];
            setServes(newServes);
            setServesChanged(Math.random());

            const name = target.children;
            const result = total[name].value - parseInt(target.extra.split(" ")[0]);

            if (result <= 0) {
                const newTotal = {...total};
                delete newTotal[name];
                setTotal(newTotal);
                setTotalChanged(Math.random());
            } else {
                setTotal({...total, [name]: {
                        value: result,
                        people: total[name].people
                    }});
                setTotalChanged(Math.random());
            }
        } else if (id in serves) {
            console.log("else if");
            let value = parseInt(target.extra.split(" ")[0]) + serves[target.ingredId].value;

            setServes({...serves, [id]: {
                    ...id,
                    checked: true,
                    value: value
                }});
            setServesChanged(Math.random());

            const name = target.children;
            setTotal({...total, [name]: {
                    value: total[name].value + parseInt(target.extra.split(" ")[0]),
                    people: total[name].people
                }});
            setTotalChanged(Math.random());
        } else {
            console.log("else");
            setServes({...serves, [id]: {
                    ...id,
                    checked: true,
                    value: parseInt(target.extra.split(" ")[0])
                }});
            setServesChanged(Math.random());

            const name = target.children;
            setTotal({...total, [name]: {
                    value: (name in total ? total[name].value : 0) + parseInt(target.extra.split(" ")[0]),
                    people: 1
                }});
            setTotalChanged(Math.random());
        }
    }

    const addPeople = (id, people) => {
        setServes({...serves, [id]: {
                ...id,
                people: people
            }})
        setServesChanged(Math.random());
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
                                    <Checkbox key={item.id} aria-label={item.ingredients.name}
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
                                    <InputNumber defaultValue={1}
                                                 onNumberChange={(value)=>{addPeople(item.id, value)}}
                                                 min={1}
                                                 prefix={'For'}
                                                 suffix={'People'}
                                                 style={{width:200}}
                                    />
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
                                <h3>Ingredients</h3>
                                <ul style={{width:"100%"}}>
                                    {Object.keys(total).map((key, index) => {
                                        return (
                                            <li key={index} style={{position:"relative", width:"100%"}}>
                                                {key}: {total[key].value * total[key].people}
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