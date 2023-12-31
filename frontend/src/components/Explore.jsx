import {useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {BackTop, List, Rating, Spin, Typography} from "@douyinfe/semi-ui";
import {IconArrowUp} from "@douyinfe/semi-icons";

import './common.css'


export const Explore = () => {
    let navigate = useNavigate();

    const [recipes, setRecipes] = useState([]);
    const firstTime = useRef(true);
    const [loading, setLoading] = useState(false);

    var timer = null;

    const next = useRef('http://127.0.0.1:8000/search/?sort=sort')

    useEffect(() => {
        if (!firstTime.current) return;
        firstTime.current = false;

        async function getRecipes() {
            axios.get(next.current)
                .then(response => {
                    setRecipes(response.data.results);
                    next.current = response.data.next;
                    if (!next.current) {
                        setLoading(false);
                    }
                })
        }
        getRecipes();

        window.addEventListener('scroll', function() {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                if (!next.current) {
                    setLoading(false);
                    return;
                }
                setLoading(true);

                clearTimeout(timer);
                timer = setTimeout(() => {
                    axios.get(next.current)
                        .then(response => {
                            setRecipes(prevState => {
                                let newRecipes = [...prevState];
                                response.data.results.forEach(recipe => {
                                    if (!newRecipes.includes(recipe)) {
                                        newRecipes.push(recipe)
                                    }
                                })
                                return newRecipes;
                            });
                            next.current = response.data.next;
                            setLoading(false);
                        })
                }, 500);
            }
        });

    }, [])


    const toRecipe = (id) => {
        navigate(`/recipe/${id}`)
    }

    const { Title, Paragraph } = Typography;

    const topStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 30,
        width: 30,
        borderRadius: '100%',
        backgroundColor: '#976332',
        color: '#fff',
        bottom: 100,
    };

    return (
        <>
            <List
                style={{width:'100%', maxWidth:1200, margin: "0 auto", marginTop:10}}
                grid={{
                    gutter: 16,
                    span: 8,
                }}
                dataSource={recipes}
                renderItem={item => (
                    <List.Item style={{marginTop:20, height:300, backgroundColor:'white', borderRadius:10, overflow:'hidden'}}
                               className='hoverPointer hoverScale' onClick={() => toRecipe(item.id)}>
                        <div style={{backgroundImage: `url(${item.cover})`, backgroundSize: 'cover', height: '70%', width: '100%'}}/>
                        <div style={{height: '30%', width: '100%', marginTop: 2, marginRight:10, marginLeft:10, position:'relative'}}>
                            <Title heading={4}>{item.title}</Title>
                            <Paragraph>{item.description}</Paragraph>
                            <div style={{display: 'flex', justifyContent: 'space-between', position:'absolute', bottom:8, width:'100%'}}>
                                <Paragraph style={{color:'#727477'}}>{item.cooking_time} mins</Paragraph>
                                <Rating allowHalf defaultValue={item.avg_rating} disabled size={15}/>
                            </div>
                        </div>
                    </List.Item>
                )}
            />
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100}}>
                {loading ?<Spin size='large'/>: ""}
            </div>
            <BackTop style={topStyle}>
                <IconArrowUp />
            </BackTop>
        </>
    )
}

export default Explore