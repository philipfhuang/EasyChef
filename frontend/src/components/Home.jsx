import {Carousel, Space, Typography} from "@douyinfe/semi-ui";
import axios from "axios";
import {useEffect, useState} from "react";

export const Home = () => {

    const [recipes, setRecipes] = useState(null);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/posts/recipes/')
            .then(response => {
                setRecipes(response.data)
            })

    }, [])

    const { Title, Paragraph } = Typography;

    const style = {
        maxWidth: 1200,
        width: '100%',
        height: '400px',
        margin: '0 auto',
    };

    const titleStyle = {
        position: 'absolute',
        top: '130px',
        left: '100px',
        color: '#1C1F23'
    };

    const colorStyle = {
        color: '#1C1F23'
    };

    return (
        <>
            <Carousel style={style} indicatorType='line' arrowType='hover' theme='dark'>
                {
                    recipes && recipes.results.map(recipe => {
                        return (
                            <div key={recipe.id} style={{ backgroundSize: 'cover', backgroundImage: `url(${recipe.cover})` }}>
                                <Space vertical align='start' spacing='medium' style={titleStyle}>
                                    <Title heading={2} style={colorStyle}>{recipe.title}</Title>
                                    <Space vertical align='start'>
                                        <Paragraph style={colorStyle}>{recipe.description}</Paragraph>
                                    </Space>
                                </Space>
                            </div>
                        )
                    })
                }
            </Carousel>
        </>

    );
}
export default Home