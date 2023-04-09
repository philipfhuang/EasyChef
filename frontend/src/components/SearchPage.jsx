import {useNavigate, useSearchParams} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {
    AutoComplete,
    BackTop,
    Button,
    Empty,
    InputNumber,
    List,
    Rating,
    Select,
    Spin,
    Typography
} from "@douyinfe/semi-ui";
import {IconArrowUp, IconSearch} from "@douyinfe/semi-icons";
import NoResult from "./NoResult.tsx";

import './common.css'


export const SearchPage = () => {
    let navigate = useNavigate();

    const [recipes, setRecipes] = useState(null);
    const changeSearch = useRef(true);
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [stringData, setStringData] = useState([]);
    const [value, setValue] = useState('');

    const [ingredientValue, setIngredientValue] = useState('');
    const [dietValue, setDietValue] = useState('');
    const [cuisineValue, setCuisineValue] = useState('');

    const [ingredientList, setIngredientList] = useState([]);
    const [dietList, setDietList] = useState([]);
    const [cuisineList, setCuisineList] = useState([]);

    const [cookingtime, setCookingtime] = useState(0);


    useEffect(() => {
        const content = searchParams.get("search");
        let ingredient = searchParams.get("ingredient");
        let diet = searchParams.get("diet");
        let cuisine = searchParams.get("cuisine");
        let cooktime = searchParams.get("cooktime");
        if (!ingredient) ingredient = '';
        if (!diet) diet = '';
        if (!cuisine) cuisine = '';
        if (!cooktime) cooktime = '';

        let next = `http://127.0.0.1:8000/search/?sort=sort&content=${content}&ingredient=${ingredient}&diet=${diet}&cuisine=${cuisine}&cooktime=${cooktime}`;

        if (!changeSearch.current) return;
        setRecipes(null);
        changeSearch.current = false;

        async function getRecipes() {
            axios.get(next)
                .then(response => {
                    setRecipes(prevState => {
                        console.log("seting state");
                        if (!prevState || changeSearch.current) {
                            console.log("firsttime");
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
        getRecipes();

        window.addEventListener('scroll', function() {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                if (!next) {
                    setLoading(false);
                    return;
                }
                setLoading(true);
                axios.get(next)
                    .then(response => {
                        setRecipes(prevState => {
                            if (!prevState) {
                                console.log("firsttime");
                                return response.data.results
                            }
                            console.log("not firsttime");
                            return [...prevState, ...response.data.results]
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

    const handleStringSearch = async (value) => {
        if (!value) return;
        await axios.get(`http://127.0.0.1:8000/search/aid/?content=${value}`)
            .then(response => {
                setStringData(response.data.results);
            })
    };

    const handleChange = value => {
        setValue(value);
    };

    const submitSearch = async () => {
        if (!value) return;
        console.log(value);
        changeSearch.current = true;
        setRecipes(null);
        setSearchParams({search: value});
    };

    const handleIngredientMultipleChange = newValue => {
        setIngredientValue(newValue);
    };

    const handleIngredientSearch = inputValue => {
        axios.get(`http://127.0.0.1:8000/search/filter/?content=${inputValue}&type=ingredient`)
            .then(response => {
                setIngredientList(response.data.results);
            })
    };

    const handleCuisineMultipleChange = newValue => {
        setCuisineValue(newValue);
    };

    const handleCuisineSearch = inputValue => {
        axios.get(`http://127.0.0.1:8000/search/filter/?content=${inputValue}&type=cuisine`)
            .then(response => {
                setCuisineList(response.data.results);
            })
    };

    const handleDietMultipleChange = newValue => {
        setDietValue(newValue);
    };

    const handleDietSearch = inputValue => {
        axios.get(`http://127.0.0.1:8000/search/filter/?content=${inputValue}&type=diet`)
            .then(response => {
                setDietList(response.data.results);
            })
    };

    const submitFilter = () => {
        let params = '';
        if (value) {
            params += `&search=${value}`;
        }
        if (ingredientValue.length > 0) {
            params += '&ingredient=';
            ingredientValue.forEach(ingredient => {
                params += `${ingredient.value},`;
            })
            params = params.slice(0, -1);
        }
        if (dietValue.length > 0) {
            params += '&diet=';
            dietValue.forEach(diet => {
                params += `${diet.value},`;
            })
            params = params.slice(0, -1);
        }
        if (cuisineValue.length > 0) {
            params += '&cuisine=';
            cuisineValue.forEach(cuisine => {
                params += `${cuisine.value},`;
            })
            params = params.slice(0, -1);
        }
        if (cookingtime) {
            params += `&cooktime=${cookingtime}`;
        }

        if (!params || params.slice(1).replace(/\s/g, "+") === window.location.search.slice(1)) return;

        changeSearch.current = true;
        setSearchParams(params);
        setRecipes(null);
    }

    return (
        <>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 150, flexDirection:'column', marginTop:10}}>
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
                <div style={{marginTop:20, width:605, display:"flex", justifyContent:"space-between",
                     flexFlow: "row wrap"}}>
                    <Select
                        style={{flex:"0 0 49%"}}
                        filter
                        remote
                        onChangeWithObject
                        multiple
                        value={ingredientValue}
                        onSearch={handleIngredientSearch}
                        optionList={ingredientList}
                        onChange={handleIngredientMultipleChange}
                        emptyContent={null}
                        placeholder={'Ingredient'}
                    ></Select>
                    <Select
                        style={{flex:"0 0 49%"}}
                        filter
                        remote
                        onChangeWithObject
                        multiple
                        value={cuisineValue}
                        onSearch={handleCuisineSearch}
                        optionList={cuisineList}
                        onChange={handleCuisineMultipleChange}
                        emptyContent={null}
                        placeholder={'Cuisine'}
                    ></Select>
                    <Select
                        style={{flex:"0 0 49%", marginTop:10}}
                        filter
                        remote
                        onChangeWithObject
                        multiple
                        value={dietValue}
                        onSearch={handleDietSearch}
                        optionList={dietList}
                        onChange={handleDietMultipleChange}
                        emptyContent={null}
                        placeholder={'Diet'}
                    ></Select>
                    <InputNumber suffix={'minutes'} min={1} style={{flex:"0 0 30%", marginTop:10}} onChange={setCookingtime}/>
                    <Button theme='light' type='tertiary' style={{flex:"0 0 16%", marginTop:10}} onClick={submitFilter}>Apply</Button>
                </div>
            </div>

            {recipes && recipes.length > 0 ?
            <List
                style={{width:'100%', maxWidth:1200, margin: "0 auto", marginTop:5, marginBottom:50}}
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
            : <Empty
                    style={{marginTop: 100}}
                    image={<NoResult style={{ width: 150, height: 150 }} />}
                    title={'No Result'}
                    description="Seems like there is no result that matches your search"
                />
            }
            {loading ?
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100}}>
                    <Spin size='large'/>
                </div>
                : <></>}
            <BackTop style={topStyle}>
                <IconArrowUp />
            </BackTop>
        </>
    )
}

export default SearchPage;