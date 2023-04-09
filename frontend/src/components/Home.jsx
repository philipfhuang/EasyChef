import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {BackTop, Carousel, List, Rating, Space, Typography} from "@douyinfe/semi-ui";
import { IconArrowUp } from '@douyinfe/semi-icons';

import './common.css'

export const Home = () => {
    let navigate = useNavigate();

    const [recipes, setRecipes] = useState(null);
    const [topRecipes, setTopRecipes] = useState(null);
    const firstTime = useRef(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!firstTime.current) return;
        firstTime.current = false;

        async function getRecipes() {
            await axios.get('http://127.0.0.1:8000/search/?sort=sort')
                .then(response => {
                    setRecipes(response.data.results.slice(0, 6));
                    setTopRecipes(response.data.results.slice(6));
                })

            let next = 'http://127.0.0.1:8000/search/?sort=sort&page=2';
            axios.get(next)
                .then(response => {
                    setTopRecipes(prevState => {
                        if (!prevState) {
                            return [...response.data.results]
                        }
                        response.data.results.forEach(recipe => {
                            if (!prevState.includes(recipe)) {
                                prevState.push(recipe)
                            }
                        })
                        return prevState;
                    })
                })
            setLoading();
        }
        getRecipes();
    }, [])


    const toRecipe = (id) => {
        navigate(`/recipe?id=${id}`)
    }

    const { Title, Paragraph } = Typography;

    const style = {
        maxWidth: 1200,
        width: '100%',
        height: '400px',
        margin: '0 auto',
    };

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

    const titleStyle = {
        position: 'absolute',
        top: '150px',
        left: '100px',
        color: '#1C1F23'
    };

    const colorStyle = {
        color: 'aliceblue'
    };

    return (
        <>
            <Carousel style={style} indicatorType='line' arrowType='hover' theme='light'>
                {
                    recipes && recipes.map(recipe => {
                        return (
                            <div key={recipe.id} style={{ backgroundSize: 'cover', backgroundImage: `url(${recipe.cover})`}} onClick={() => toRecipe(recipe.id)}>
                                <div className={'hoverPointer'} style={{height:'100%', width:'100%', backgroundColor: 'rgba(0, 0, 0, .2)'}}>
                                    <Space vertical align='start' spacing='medium' style={titleStyle}>
                                        <Title heading={2} style={colorStyle}>{recipe.title}</Title>
                                        <Space vertical align='start'>
                                            <Paragraph style={colorStyle}>{recipe.description}</Paragraph>
                                        </Space>
                                    </Space>
                                </div>
                            </div>
                        )
                    })
                }
            </Carousel>

            <List
                style={{width:'100%', maxWidth:1200, margin: "0 auto", marginTop:10}}
                grid={{
                    gutter: 16,
                    span: 8,
                }}
                dataSource={topRecipes}
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
            <div style={{height: 100}}/>
            <BackTop style={topStyle}>
                <IconArrowUp />
            </BackTop>
        </>

    );
}
export default Home