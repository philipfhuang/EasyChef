import React, { useState, useEffect } from 'react';
import { IoHeartOutline, IoHeartSharp, IoBookmarkOutline, IoBookmarkSharp, IoListOutline, IoStarOutline } from 'react-icons/io5';
import axios from 'axios';
import './Recipe.css';
import { Image } from '@douyinfe/semi-ui';



const Recipe = () => {
    const [recipe, setRecipe] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [liked, setLiked] = useState(false);
    const [favorited, setFavorited] = useState(false);
    const [rating, setRating] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);
    const [imageFiles, setImageFiles] = useState([]);
    const [videoFiles, setVideoFiles] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('http://127.0.0.1:8000/posts/recipe/46/');
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
            await fetchComments(`http://127.0.0.1:8000/comments/fromRecipe/46/`);


        }
        fetchData();
    }, []);

    const handleAddImage = async (commentId, file) => {
        try {
          const formData = new FormData();
          formData.append('comment', commentId);
          formData.append('image', file);
      
          const storedToken = localStorage.getItem('token');
          const accessToken = JSON.parse(storedToken).access;
          const config = {
            headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'multipart/form-data' }
          };
      
          await axios.post('http://127.0.0.1:8000/comments/commentImage/', formData, config);
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      };
      
      const handleAddVideo = async (commentId, file) => {
        try {
          const formData = new FormData();
          formData.append('comment', commentId);
          formData.append('video', file);
      
          const storedToken = localStorage.getItem('token');
          const accessToken = JSON.parse(storedToken).access;
          const config = {
            headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'multipart/form-data' }
          };
      
          await axios.post('http://127.0.0.1:8000/comments/commentVideo/', formData, config);
        } catch (error) {
          console.error('Error uploading video:', error);
        }
      };

    const fetchComments = async (url) => {
        try {
            const response = await axios.get(url);
            setComments(response.data.results);
            setNextPage(response.data.next);
            setPreviousPage(response.data.previous);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleNextPage = () => {
        if (nextPage) {
            setCurrentPage(currentPage + 1);
            fetchComments(nextPage);
        }
    };

    const handlePreviousPage = () => {
        if (previousPage) {
            setCurrentPage(currentPage - 1);
            fetchComments(previousPage);
        }
    };

    const handleLike = async () => {
        try {
            const storedToken = localStorage.getItem('token');
            const accessToken = JSON.parse(storedToken).access;
    
            const config = {
                headers: { Authorization: `Bearer ${accessToken}` }
            };
    
            const likeData = {
                recipeid: recipe.id,
            };
    
            console.log(accessToken);
    
            if (!liked) {
                await axios.post('http://127.0.0.1:8000/accounts/like/', likeData, config);
    
                // Update local storage
                const storedUser = JSON.parse(localStorage.getItem('user'));
                storedUser.liked_recipes.push({ id: recipe.id });
                localStorage.setItem('user', JSON.stringify(storedUser));
            } else {
                await axios.delete('http://127.0.0.1:8000/accounts/unlike/', { data: likeData, headers: config.headers });
    
                // Update local storage
                const storedUser = JSON.parse(localStorage.getItem('user'));
                storedUser.liked_recipes = storedUser.liked_recipes.filter(item => item.id !== recipe.id);
                localStorage.setItem('user', JSON.stringify(storedUser));
            }
            setLiked(!liked);
        } catch (error) {
            console.error('Error liking or unliking:', error);
        }
    };
    
    const handleFavorite = async () => {
        try {
            const storedToken = localStorage.getItem('token');
            const accessToken = JSON.parse(storedToken).access;
    
            const config = {
                headers: { Authorization: `Bearer ${accessToken}` }
            };
    
            const favoriteData = {
                recipeid: recipe.id,
            };
    
            if (!favorited) {
                await axios.post('http://127.0.0.1:8000/accounts/favor/', favoriteData, config);
    
                // Update local storage
                const storedUser = JSON.parse(localStorage.getItem('user'));
                storedUser.favored_recipes.push({ id: recipe.id });
                localStorage.setItem('user', JSON.stringify(storedUser));
            } else {
                await axios.delete('http://127.0.0.1:8000/accounts/unfavor/', { data: favoriteData, headers: config.headers });
    
                // Update local storage
                const storedUser = JSON.parse(localStorage.getItem('user'));
                storedUser.favored_recipes = storedUser.favored_recipes.filter(item => item.id !== recipe.id);
                localStorage.setItem('user', JSON.stringify(storedUser));
            }
            setFavorited(!favorited);
        } catch (error) {
            console.error('Error favoriting or unfavoriting:', error);
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
                    headers: { Authorization: `Bearer ${accessToken}` }
                };
    
                await axios.post('http://127.0.0.1:8000/accounts/addShoppingList/', ShopData, config);
            } catch (error) {
                console.error('Error adding to shopping list:', error);
            }
        };
    
        recipe.ingredient_quantities.map(ingredient => addIngredientToShoppingList(ingredient));
    };

    const handleAddComment = async () => {
        try {
            const storedToken = localStorage.getItem('token');
            const accessToken = JSON.parse(storedToken).access;
    
            const config = {
                headers: { Authorization: `Bearer ${accessToken}` }
            };
    
            const commentData = {
                recipeid: recipe.id,
                rating: rating,
                content: newComment
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
    
            setNewComment('');
            setImageFiles([]);
            setVideoFiles([]);
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    if (!recipe) return <div>Loading...</div>;

    return (
        <div className="container">
            <h1>{recipe.title}</h1>
            <div className="recipe-top">
            <div>
            {recipe.cover ? (
                <Image src={recipe.cover} alt={recipe.title} />
            ) : (
                <p>No cover image available</p>
            )}
            </div>
            <div className="recipe-info">
                <p><span>Description:</span> {recipe.description}</p>
                <p><span>Creator:</span> {recipe.creator.username}</p>
                <p><span>Cooking time:</span> {recipe.cooking_time} minutes</p>
                <p><span>Created Date:</span> {recipe.created_at.slice(0, 10)}</p>
                <p><span>Edited Date:</span> {recipe.updated_at.slice(0, 10)}</p>
            </div>
            </div>
    
            <div class="recipe-sections">
                <div class="recipe-section">
                    <h2>Cuisines:</h2>
                    <ul>
                    {recipe.cuisines.map(cuisine => (
                        <li key={cuisine.id}>
                        {cuisine.cuisine.name}
                        </li>
                    ))}
                    </ul>
                </div>
                <div class="recipe-section">
                    <h2>Diets:</h2>
                    <ul>
                    {recipe.diets.map(diet => (
                        <li key={diet.id}>
                        {diet.diet.name}
                        </li>
                    ))}
                    </ul>
                </div>
                <div class="recipe-section">
                    <h2>Ingredients:</h2>
                    <ul>
                    {recipe.ingredient_quantities.map(ingredient => (
                        <li key={ingredient.id}>
                        {ingredient.quantity} {ingredient.unit.name} of {ingredient.ingredient.name}
                        </li>
                    ))}
                    </ul>
                </div>
                </div>

                <div class="recipe-steps">
                    <h2>Steps:</h2>
                    <ol>
                        {recipe.steps.map(step => (
                        <li key={step.id}>
                            <div class="recipe-step">
                            <div class="recipe-step-content">
                                {step.content}
                            </div>
                            <div class="recipe-step-media">
                                {step.images.map(image => (
                                <Image
                                    key={image.id}
                                    src={image.image}
                                    alt={image.image}
                                    width={250}
                                    height={250}
                                    class="recipe-step-image"
                                />
                                ))}
                                <br />
                                {step.videos.map(video => (
                                <video
                                    key={video.id}
                                    class="recipe-step-video"
                                    controls
                                >
                                    <source src={video.video} type="video/ogg" />
                                    Your browser does not support the video tag.
                                </video>
                                ))}
                            </div>
                            </div>
                        </li>
                        ))}
                    </ol>
                </div>

    
            <div className="recipe-actions">
                <button onClick={handleLike}>{liked ? <IoHeartSharp /> : <IoHeartOutline />}</button>
                <button onClick={handleFavorite}>{favorited ? <IoBookmarkSharp /> : <IoBookmarkOutline />}</button>
                <button onClick={handleAddToShoppingList}><IoListOutline /></button>
            </div>

            
    
            <div className="comments-section">
                <h2>Comments:</h2>

                <div className="comment-input">
                    <input
                        type="text"
                        placeholder="Add a comment"
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                    />
                    {/* Add a dropdown or input to set the rating */}
                    <select value={rating} onChange={e => setRating(Number(e.target.value))}>
                        {[1, 2, 3, 4, 5].map(value => (
                            <option key={value} value={value}>
                                {value} <IoStarOutline />
                            </option>
                        ))}
                    </select>
                    <input type="file" multiple accept="image/*" onChange={e => setImageFiles(e.target.files)} />
                    <input type="file" multiple accept="video/*" onChange={e => setVideoFiles(e.target.files)} />
                    <button onClick={handleAddComment}>Add Comment</button>
                    <p>Likes : {recipe.total_likes}</p>
                    <p>Rating : {String(recipe.avg_rating).slice(0, 3)}</p>
                </div>
                        {comments.length > 0 ? (
                        <>
                        <ul className="comment-list">
                        {comments.map(comment => (
                        !comment.content ? (
                        <li className="comment" key={comment.id}>
                            {comment.userid.username}: This user did not comment. {comment.rating} <IoStarOutline />
                            {comment.images.map((image) => (
                            <Image key={comment.id} src={image.image} alt={`Comment image ${comment.id}` } width={250} height={250} />
                            ))}
                            {comment.videos.map((video, idx) => (
                            <video key={idx} width="320" height="240" controls>
                                <source src={video.video} type="video/ogg" />
                                Your browser does not support the video tag.
                            </video>
                            ))}
                        </li>
                        ) : (
                        <li className="comment" key={comment.id}>
                            {comment.userid.username}: {comment.content} {comment.rating} <IoStarOutline />
                            {comment.images.map((image) => (
                            <Image key={comment.id} src={image.image} alt={`Comment image ${comment.id}` } width={250} height={250} />
                            ))}
                            {comment.videos.map((video, idx) => (
                            <video key={idx} width="320" height="240" controls>
                                <source src={video.video} type="video/ogg" />
                                Your browser does not support the video tag.
                            </video>
                            ))}
                        </li>
                        )))}
                        </ul>
                        <div>
                        <button disabled={!previousPage} onClick={handlePreviousPage}>Previous</button>
                        <span>Page {currentPage}</span>
                        <button disabled={!nextPage} onClick={handleNextPage}>Next</button>
                        </div>
                        </>
                        ) : (
                        <p>No comments available</p>
                        )}

                    </div>

        </div>
    );
    
};

export default Recipe;