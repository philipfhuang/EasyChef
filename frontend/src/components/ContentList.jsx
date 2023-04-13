import React, {useState, useEffect, useRef} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {List, Rating, Spin, BackTop, Typography, Empty} from '@douyinfe/semi-ui';
import {IconArrowUp} from "@douyinfe/semi-icons";
import axios from "axios";
import IllustrationNoContent from "./IllustrationNoContent.tsx";

const ContentList = (props) => {
    const height = window.location.href.includes('explore') ? "60vh" : "100%";
    let navigate = useNavigate();

    const [recipes, setRecipes] = useState([]);
    const firstTime = useRef(true);
    const [loading, setLoading] = useState(false);

    const { user_id } = useParams();

    var timer = null;
    let url;
    if (props.content === 'explore') {
        url = 'http://127.0.0.1:8000/search/?sort=sort'
    } else  {
        url = `http://127.0.0.1:8000/accounts/${props.content}/${user_id}/`
    }

    const next = useRef(url)

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
            {recipes.length > 0 ?
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
                />:<div style={{display:"flex", justifyContent:"center", alignItems:"center", height:height, width:"100%"}}>
                    <Empty
                        style={{marginTop: 100}}
                        image={<IllustrationNoContent style={{ width: 150, height: 150 }} />}
                        title={'No Recipes'}
                        description="Let's add the first one!"
                    />
                </div>

            }
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100}}>
                {loading ?<Spin size='large'/>: ""}
            </div>
            <BackTop style={topStyle}>
                <IconArrowUp />
            </BackTop>
        </>
    )
}

export default ContentList;