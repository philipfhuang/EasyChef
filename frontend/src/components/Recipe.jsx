import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import {
    Image,
    ImagePreview,
    Rating,
    Typography,
    Divider,
    Button,
    Toast,
    Avatar,
    Form,
    List,
    Empty, Pagination, BackTop
} from '@douyinfe/semi-ui';
import {
    IconChecklistStroked,
    IconHeartStroked,
    IconLikeHeart,
    IconBookmarkAddStroked,
    IconBookmark,
    IconArrowUp
} from '@douyinfe/semi-icons';

import './Recipe_new.css'
import IllustrationNoContent from "./IllustrationNoContent.tsx";


const Recipe = () => {
    const {Text, Title, Paragraph} = Typography;
    const {TextArea} = Form;
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

    const [recipe, setRecipe] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentCount, setCommentCount] = useState(0);
    const [liked, setLiked] = useState(false);
    const [favorited, setFavorited] = useState(false);
    const [page, setPage] = useState(1);
    const [imageFiles, setImageFiles] = useState([]);
    const [videoFiles, setVideoFiles] = useState([]);

    const [addComment, setAddComment] = useState(0);
    const {id} = useParams();

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/posts/recipe/${id}/`);
                setRecipe(response.data);

                const storedUser = JSON.parse(localStorage.getItem('user'));
                console.log(storedUser);

                if (storedUser.liked_recipes !== undefined) {
                    if (storedUser.liked_recipes.some(recipe => recipe.id === response.data.id)) {
                        setLiked(true);
                    }
                }

                if (storedUser.favored_recipes !== undefined) {
                    if (storedUser.favored_recipes.some(favor => favor.id === response.data.id)) {
                        setFavorited(true);
                    }
                }

            } catch (error) {
                console.error('Error fetching recipe:', error);
            }
            await fetchComments(`http://127.0.0.1:8000/comments/fromRecipe/${id}/`);
        }

        fetchData();
    }, [addComment]);

    const fetchComments = async (url) => {
        try {
            const response = await axios.get(url);
            setCommentCount(response.data.count);
            setComments(response.data.results);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };
    const handleLike = async () => {
        try {
            const storedToken = localStorage.getItem('token');
            const accessToken = JSON.parse(storedToken).access;

            const config = {
                headers: {Authorization: `Bearer ${accessToken}`}
            };

            const likeData = {
                recipeid: recipe.id,
            };

            console.log(accessToken);

            if (!liked) {
                await axios.post('http://127.0.0.1:8000/accounts/like/', likeData, config);

                // Update local storage
                const storedUser = JSON.parse(localStorage.getItem('user'));
                storedUser.liked_recipes.push({id: recipe.id});
                localStorage.setItem('user', JSON.stringify(storedUser));
                Toast.success({
                    content: 'Liked!',
                    duration: 3,
                });
                recipe.total_likes += 1;
            } else {
                await axios.delete('http://127.0.0.1:8000/accounts/unlike/', {data: likeData, headers: config.headers});

                // Update local storage
                const storedUser = JSON.parse(localStorage.getItem('user'));
                storedUser.liked_recipes = storedUser.liked_recipes.filter(item => item.id !== recipe.id);
                localStorage.setItem('user', JSON.stringify(storedUser));
                Toast.success({
                    content: 'Unliked!',
                    duration: 3,
                });
                recipe.total_likes -= 1;
            }
            setLiked(!liked);
        } catch (error) {
            console.error('Error liking or unliking:', error);
            Toast.error({
                content: 'Error liking or unliking',
                duration: 3,
            });
        }
    };

    const handleFavorite = async () => {
        try {
            const storedToken = localStorage.getItem('token');
            const accessToken = JSON.parse(storedToken).access;

            const config = {
                headers: {Authorization: `Bearer ${accessToken}`}
            };

            const favoriteData = {
                recipeid: recipe.id,
            };

            if (!favorited) {
                await axios.post('http://127.0.0.1:8000/accounts/favor/', favoriteData, config);

                // Update local storage
                const storedUser = JSON.parse(localStorage.getItem('user'));
                storedUser.favored_recipes.push({id: recipe.id});
                localStorage.setItem('user', JSON.stringify(storedUser));
                Toast.success({
                    content: 'Favorited!',
                    duration: 3,
                });
            } else {
                await axios.delete('http://127.0.0.1:8000/accounts/unfavor/', {
                    data: favoriteData,
                    headers: config.headers
                });
                Toast.success({
                    content: 'Unfavorited!',
                    duration: 3,
                });

                // Update local storage
                const storedUser = JSON.parse(localStorage.getItem('user'));
                storedUser.favored_recipes = storedUser.favored_recipes.filter(item => item.id !== recipe.id);
                localStorage.setItem('user', JSON.stringify(storedUser));
            }
            setFavorited(!favorited);
        } catch (error) {
            console.error('Error favoriting or unfavoriting:', error);
            Toast.error({
                content: 'Error favoriting or unfavoriting',
                duration: 3,
            });
        }
    };

    const handleAddToShoppingList = async () => {
        const storedUser = JSON.parse(localStorage.getItem('user'));

        const addIngredientToShoppingList = async (ingredient) => {
            try {
                const storedToken = localStorage.getItem('token');
                const accessToken = JSON.parse(storedToken).access;

                const ShopData = {
                    userid: storedUser.id,
                    item: ingredient.id
                };

                const config = {
                    headers: {Authorization: `Bearer ${accessToken}`}
                };

                await axios.post('http://127.0.0.1:8000/accounts/addShoppingList/', ShopData, config);
                Toast.success({
                    content: 'Added to shopping list!',
                    duration: 3,
                });
            } catch (error) {
                console.error('Error adding to shopping list:', error);
                Toast.error({
                    content: 'Error adding to shopping list',
                    duration: 3,
                });
            }
        };

        recipe.ingredient_quantities.map(ingredient => addIngredientToShoppingList(ingredient));
    };

    const handleAddComment = async (form) => {
        try {
            const storedToken = localStorage.getItem('token');
            const accessToken = JSON.parse(storedToken).access;

            const config = {
                headers: {Authorization: `Bearer ${accessToken}`}
            };

            const commentData = {
                recipeid: recipe.id,
                rating: form.rating,
                content: form.content
            };

            const response = await axios.post('http://127.0.0.1:8000/comments/', commentData, config);
            const commentId = response.data.id;

            // Upload images
            for (let i = 0; i < imageFiles.length; i++) {
                const imageData = new FormData();
                imageData.append('comment', commentId);
                imageData.append('image', imageFiles[i]);

                await axios.post('http://127.0.0.1:8000/comments/commentImage/', imageData, config);
            }

            // Upload videos
            for (let i = 0; i < videoFiles.length; i++) {
                const videoData = new FormData();
                videoData.append('comment', commentId);
                videoData.append('video', videoFiles[i]);

                await axios.post('http://127.0.0.1:8000/comments/commentVideo/', videoData, config);
            }

            setImageFiles([]);
            setVideoFiles([]);
            setAddComment(Math.random());
            Toast.success({
                content: 'Comment added!',
                duration: 3,
            });
        } catch (error) {
            console.error('Error adding comment:', error);
            Toast.error({
                content: 'Error adding comment',
                duration: 3,
            });
        }
    };

    if (!recipe) return <div>Loading...</div>;

    function onPageChange(currentPage) {
        setPage(currentPage);
    }

    return (
        <div style={{width: 1000, margin: "0 auto", marginTop: 20}}>
            <Title heading={1} style={{fontSize: 44, marginTop: 40}}>{recipe.title}</Title>
            <div style={{marginTop: 15}}>
                <Text type="secondary" style={{fontSize: 18}}>
                    <Rating allowHalf defaultValue={recipe.avg_rating} disabled size={16}/>
                    {recipe.avg_rating.toFixed(1)}
                    ({recipe.comments.length})
                    &nbsp;
                    Cooking Time: {recipe.cooking_time} minutes
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    Creator: <Text
                    link={{href: `/accounts/profile/${recipe.creator.id}/`}}>{recipe.creator.username}</Text>
                    &nbsp;
                    Created: {recipe.created_at.slice(0, 10)}
                    &nbsp;
                    Last Updated: {recipe.updated_at.slice(0, 10)}
                </Text>
            </div>
            <Divider margin='12px'/>
            <Text type="secondary" style={{fontSize: 18}}>
                Cusines: {recipe.cuisines.map(cuisine => cuisine.cuisine.name).join(', ')}
            </Text>
            <br/>
            <Text type="secondary" style={{fontSize: 18}}>
                Diets: {recipe.diets.map(diet => diet.diet.name).join(', ')}
            </Text>
            {recipe.cover ? (
                <Image
                    style={{width: 1000, height: 500, objectFit: "cover", marginTop: 10}}
                    src={recipe.cover}
                    alt={recipe.title}
                    width={1000}
                    height={500}
                />
            ) : <></>}
            <Paragraph style={{marginTop: 20, fontSize: 18}}>{recipe.description}</Paragraph>

            <Divider margin='12px'/>

            <div>
                <Title heading={2} style={{fontSize: 24}}>Ingredients</Title>
                <ul>
                    {recipe.ingredient_quantities.map(ingredient => (
                        <li key={ingredient.id}>
                            <Text type="secondary" style={{fontSize: 18}}>
                                {ingredient.quantity} {ingredient.unit.name} of {ingredient.ingredient.name}
                            </Text>
                        </li>
                    ))}
                </ul>

                <Button icon={<IconChecklistStroked/>}
                        style={{borderRadius: 5, backgroundColor: "#976332"}}
                        type="primary"
                        theme="solid"
                        onClick={handleAddToShoppingList}>
                    Add Them to My Shopping List
                </Button>
            </div>
            <Divider margin='12px'/>
            <div>
                <Title heading={2} style={{fontSize: 24}}>Directions</Title>
                {
                    recipe.steps.map(step => (
                        <div key={step.id} style={{marginTop: 20}}>
                            <Title heading={3} style={{fontSize: 20}}>Step {step.step_number}</Title>
                            <Paragraph style={{fontSize: 18}}>{step.content}</Paragraph>
                            <ImagePreview style={{marginTop: 10}}>
                                {step.images.map((img, index) => {
                                    return (
                                        <Image
                                            key={index}
                                            src={img.image}
                                            width={320}
                                            height={200}
                                            alt={`lamp${index + 1}`}
                                            style={{marginRight: 5, objectFit: 'cover'}}
                                        />
                                    );
                                })}
                            </ImagePreview>
                            {
                                step.videos.map((video, index) => {
                                    return (
                                        <video
                                            key={index}
                                            width="320"
                                            height="240"
                                            controls
                                            style={{marginTop: -20, marginRight: 5}}
                                        >
                                            <source src={video.video} type="video/mp4"/>
                                        </video>
                                    );
                                })
                            }
                        </div>
                    ))
                }
            </div>

            <div style={{marginTop:20}}>
                <Button
                    onClick={handleLike}
                    style={{height:30, width:200, fontSize:30, color: "#976332"}}
                    theme="borderless"
                    icon={liked ? <IconLikeHeart style={{height:30, width:30, fontSize:30, color: "#976332"}}/>:
                        <IconHeartStroked style={{height:30, width:30, fontSize:30, color: "#976332"}}/>}>
                    Like! ({recipe.total_likes})
                </Button>
                &nbsp;&nbsp;&nbsp;
                <Button
                    onClick={handleFavorite}
                    style={{height:30, width:200, fontSize:30, color: "#976332"}}
                    theme="borderless"
                    icon={favorited ? <IconBookmark style={{height:30, width:30, fontSize:30, color: "#976332"}}/>:
                        <IconBookmarkAddStroked style={{height:30, width:30, fontSize:30, color: "#976332"}}/>}>
                    Favorite!
                </Button>
            </div>

            <Divider margin='12px'/>

            <Title heading={2} style={{fontSize: 24}}>Comments ({recipe.comments.length})</Title>

            <div style={{marginTop:10}}>
                <Avatar size="small" color='orange' style={{margin: "auto"}} src={user.avatar}>
                    {`${user.first_name.charAt(0).toUpperCase()}${user.last_name.charAt(0).toUpperCase()}`}
                </Avatar>
                <Text style={{fontSize: 18, marginLeft: 10}}>{user.first_name} {user.last_name}</Text>
                <Form onSubmit={form => {handleAddComment(form)}} style={{position:'relative'}}>
                    <Form.Rating field='rating' label="Rate"/>
                    <TextArea field='content' label="Comment"/>
                    <label htmlFor="images" className="btn">Select Images</label>&nbsp;
                    <input type="file" multiple accept="image/*" id='images' onChange={e => setImageFiles(e.target.files)}/>
                    <label htmlFor="videos" className="btn">Select Videos</label>&nbsp;
                    <input type="file" multiple accept="video/*" id="videos" onChange={e => setVideoFiles(e.target.files)}/>
                    <Button
                        type="primary"
                        theme="solid"
                        htmlType="submit"
                        style={{backgroundColor:"#976332",
                            borderRadius:5,
                            position:"absolute",
                        right:0}}>Submit</Button>
                </Form>

                <div style={{marginTop: 30}}>
                    {
                        comments.length > 0 ? (
                            <List
                                dataSource={comments}
                                renderItem={comment => (
                                    <List.Item
                                        header={
                                            <Avatar size="medium" color='orange' style={{margin: "auto"}} src={comment.userid.avatar}>
                                                {`${comment.userid.first_name.charAt(0).toUpperCase()}${comment.userid.last_name.charAt(0).toUpperCase()}`}
                                            </Avatar>
                                        }
                                        main={
                                            <div>
                                                <Title heading={4} style={{fontSize: 18}}>{comment.userid.username}</Title>
                                                <Rating allowHalf defaultValue={comment.rating} disabled size={16}/>
                                                <Paragraph style={{fontSize: 16}}>
                                                    {comment.content ? comment.content : <Text type="tertiary">This user did not leave any text comments</Text>}
                                                </Paragraph>
                                                <ImagePreview style={{marginTop: 10}}>
                                                    {comment.images.map((img, index) => {
                                                        return (
                                                            <Image
                                                                key={index}
                                                                src={img.image}
                                                                width={100}
                                                                height={100}
                                                                alt={`lamp${index + 1}`}
                                                                style={{marginRight: 5, objectFit: 'cover'}}
                                                            />
                                                        );
                                                    })}
                                                </ImagePreview>
                                                {
                                                    comment.videos.map((video, index) => {
                                                        return (
                                                            <video
                                                                key={index}
                                                                width="200"
                                                                height="100"
                                                                controls
                                                                style={{marginTop: 10, marginRight: 5}}
                                                            >
                                                                <source src={video.video} type="video/mp4"/>
                                                            </video>
                                                        );
                                                    })
                                                }
                                            </div>
                                        }
                                    />
                                )}
                            />
                        ) :(
                            <Empty
                                style={{marginTop: 100}}
                                image={<IllustrationNoContent style={{ width: 150, height: 150 }} />}
                                title={'No Comments'}
                                description="Let's be the first to comment!"
                            />
                        )
                    }
                    <div style={{marginTop: 30, marginBottom:30, width:"100%", display:"flex", justifyContent:"space-around"}}>
                        <Pagination
                            total={commentCount}
                            pageSize={12}
                            style={{ marginBottom: 12 }}
                            currentPage={page}
                            onPageChange={onPageChange}
                            onChange={() => {fetchComments(`http://127.0.0.1:8000/comments/fromRecipe/${id}/?page=${page}`)}}
                        ></Pagination>
                    </div>

                </div>

            </div>
            <BackTop style={topStyle}>
                <IconArrowUp />
            </BackTop>
        </div>
    );

};

export default Recipe;