import {useNavigate, useSearchParams} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {AutoComplete, BackTop, List, Rating, Select, Spin, Typography} from "@douyinfe/semi-ui";
import {IconArrowUp, IconSearch} from "@douyinfe/semi-icons";

import './common.css'


export const SearchPage = () => {
    let navigate = useNavigate();

    const [recipes, setRecipes] = useState(null);
    const firstTime = useRef(true);
    const changeSearch = useRef(true);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [stringData, setStringData] = useState([]);
    const [value, setValue] = useState('');


    useEffect(() => {
        const params = searchParams.get("search");
        let next = `http://127.0.0.1:8000/search/?sort=sort&content=${params}`;

        if (!firstTime.current && !changeSearch.current) return;
        firstTime.current = false;

        async function getRecipes() {
            let count = 3;
            while (count > 0 && next) {
                await axios.get(next)
                    .then(response => {
                        setRecipes(prevState => {
                            if (!prevState || changeSearch.current) {
                                return [...response.data.results]
                            }
                            response.data.results.forEach(recipe => {
                                if (!prevState.includes(recipe)) {
                                    prevState.push(recipe)
                                }
                            })
                            return prevState;
                        })
                        next = response.data.next;
                        if (!next) {
                            setLoading(false);
                        }
                        count--;
                    })
            }
        }
        getRecipes();

        window.addEventListener('scroll', function() {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                if (!next) {
                    setLoading(false);
                    return;
                }
                axios.get(next)
                    .then(response => {
                        setRecipes(prevState => {
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
                        next = response.data.next;
                    })
            }
        });

    }, [searchParams])

    const toRecipe = (id) => {
        navigate(`/recipe?id=${id}`)
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

    var timer;
    const handleStringSearch = async (value) => {
        if (!value) return;
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(async () => {
            await axios.get(`http://127.0.0.1:8000/search/aid/?content=${value}`)
                .then(response => {
                    setStringData(response.data.results);
                })
        }, 500)
    };

    const handleChange = value => {
        setValue(value);
    };

    const submitSearch = () => {
        setSearchParams({search: value});
    };

    return (
        <>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100, flexDirection:'column'}}>
                <AutoComplete
                    size={'large'}
                    data={stringData}
                    value={value}
                    showClear
                    prefix={<IconSearch onClick={submitSearch} className='hoverPointer'/>}
                    placeholder="Search... "
                    onSearch={handleStringSearch}
                    onChange={handleChange}
                    style={{
                        width: 500
                    }}
                    onKeyDown={e => {
                        if (e.keyCode === 13) {
                            submitSearch();
                        }
                    }}
                />
                <div style={{marginLeft: 20}}>

                </div>
            </div>

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
                {loading ? <Spin size='large'/> : <></>}
            </div>
            <BackTop style={topStyle}>
                <IconArrowUp />
            </BackTop>
        </>
    )
}

export default SearchPage;