import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Recipe.css';



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

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('http://127.0.0.1:8000/posts/recipe/45/');
                setRecipe(response.data);
                setComments(response.data.comments);
    
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
            await fetchComments(`http://127.0.0.1:8000/comments/fromRecipe/45/`);

        }
        fetchData();
    }, []);

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

            await axios.post('http://127.0.0.1:8000/comments/', commentData, config);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    if (!recipe) return <div>Loading...</div>;

    // return (
    //     <div className="recipe-container">
    //         <h1>{recipe.title}</h1>
    //         {recipe.cover ? (
    //             <img src={recipe.cover} alt={recipe.title} />
    //         ) : (
    //             <p>No cover image available</p>
    //         )}
    //         <p>Description: {recipe.description}</p>
    //         <p>Creator: {recipe.creator.username}</p>
    //         <p>Cooking time: {recipe.cooking_time} minutes</p>
    //         <p>Created Date: {recipe.created_at.slice(0, 10)}</p>
    //         <p>Edited Date: {recipe.updated_at.slice(0, 10)}</p>
    //         <h2>Cuisines:</h2>
    //         <ul>
    //             {recipe.cuisines.map(cuisine => (
    //                 <li key={cuisine.id}>
    //                     {cuisine.cuisine.name}
    //                 </li>
    //             ))}
    //         </ul>
    //         <h2>Diets:</h2>
    //         <ul>
    //             {recipe.diets.map(diet => (
    //                 <li key={diet.id}>
    //                     {diet.diet.name}
    //                 </li>
    //             ))}
    //         </ul>
    //         <h2>Ingredients:</h2>
    //         <ul>
    //             {recipe.ingredient_quantities.map(ingredient => (
    //                 <li key={ingredient.id}>
    //                     {ingredient.quantity} {ingredient.unit.name} of {ingredient.ingredient.name}
    //                 </li>
    //             ))}
    //         </ul>
    //         <h2>Steps:</h2>
    //         <ol>
    //             {recipe.steps.map(step => (
    //                 <li key={step.id}>
    //                     {step.content}
    //                     {step.images.map(image => (
    //                         <img key={image.id} src={image.image} alt={image.image} />
    //                     ))}
    //                 </li>
    //             ))}
    //         </ol>
    //         <div>
    //             <button onClick={handleLike}>{liked ? 'Unlike' : 'Like'}</button>
    //             <button onClick={handleFavorite}>{favorited ? 'Unfavorite' : 'Favorite'}</button>
    //             <button onClick={handleAddToShoppingList}>Add to Shopping List</button>
    //         </div>
    //         <div>
    //             <input
    //                 type="text"
    //                 placeholder="Add a comment"
    //                 value={newComment}
    //                 onChange={e => setNewComment(e.target.value)}
    //             />
    //             {/* Add a dropdown or input to set the rating */}
    //             <select value={rating} onChange={e => setRating(Number(e.target.value))}>
    //                 {[1, 2, 3, 4, 5].map(value => (
    //                     <option key={value} value={value}>
    //                         {value}
    //                     </option>
    //                 ))}
    //             </select>
    //             <button onClick={handleAddComment}>Add Comment</button>
    //         </div>

    //         <h2>Comments:</h2>

    //         {comments.length > 0 ? (
    //             <>
    //                 <ul>
    //                     {comments.map(comment => (
    //                         !comment.content ? (
    //                             <li key={comment.id}>
    //                                 This user did not comment. {comment.rating}
    //                             </li>
    //                         ) : (
    //                             <li key={comment.id}>
    //                                 {comment.content} {comment.rating}
    //                             </li>
    //                         )))}
    //                 </ul>
    //                 <div>
    //                     <button disabled={!previousPage} onClick={handlePreviousPage}>Previous</button>
    //                     <span>Page {currentPage}</span>
    //                     <button disabled={!nextPage} onClick={handleNextPage}>Next</button>
    //                 </div>
    //             </>
    //         ) : (
    //             <p>No comments available</p>
    //         )}
    //     </div>
    // );


    return (
        <div className="container">
            <h1>{recipe.title}</h1>
            {recipe.cover ? (
                <img src={recipe.cover} alt={recipe.title} />
            ) : (
                <p>No cover image available</p>
            )}
            <div className="recipe-info">
                <p>Description: {recipe.description}</p>
                <p>Creator: {recipe.creator.username}</p>
                <p>Cooking time: {recipe.cooking_time} minutes</p>
                <p>Created Date: {recipe.created_at.slice(0, 10)}</p>
                <p>Edited Date: {recipe.updated_at.slice(0, 10)}</p>
            </div>
    
            <h2>Cuisines:</h2>
            <ul>
                {recipe.cuisines.map(cuisine => (
                    <li key={cuisine.id}>
                        {cuisine.cuisine.name}
                    </li>
                ))}
            </ul>
            <h2>Diets:</h2>
            <ul>
                {recipe.diets.map(diet => (
                    <li key={diet.id}>
                        {diet.diet.name}
                    </li>
                ))}
            </ul>
            <h2>Ingredients:</h2>
            <ul>
                {recipe.ingredient_quantities.map(ingredient => (
                    <li key={ingredient.id}>
                        {ingredient.quantity} {ingredient.unit.name} of {ingredient.ingredient.name}
                    </li>
                ))}
            </ul>
            <h2>Steps:</h2>
            <ol>
                {recipe.steps.map(step => (
                    <li key={step.id}>
                        {step.content}
                        {step.images.map(image => (
                            <img key={image.id} src={image.image} alt={image.image} />
                        ))}
                        {step.videos.map(video => (
                            <video width="320" height="240" controls>
                            <source src={video.video} type="video/ogg" />
                            Your browser does not support the video tag.
                        </video>
                        ))}
                    </li>
                ))}
            </ol>

    
            <div className="recipe-actions">
                <button onClick={handleLike}>{liked ? 'Unlike' : 'Like'}</button>
                <button onClick={handleFavorite}>{favorited ? 'Unfavorite' : 'Favorite'}</button>
                <button onClick={handleAddToShoppingList}>Add to Shopping List</button>
            </div>
    
            <div className="comments-section">
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
                                {value}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleAddComment}>Add Comment</button>
                    <p>Likes : {recipe.total_likes}</p>
                    <p>Rating : {String(recipe.avg_rating).slice(0, 3)}</p>
                </div>
                <h2>Comments:</h2>
    
                {comments.length > 0 ? (
                    <>
                        <ul className="comment-list">
                            {comments.map(comment => (
                                !comment.content ? (
                                    <li className="comment" key={comment.id}>
                                        This user did not comment. {comment.rating}
                                    </li>
                                ) : (
                                    <li className="comment" key={comment.id}>
                                        {comment.content} {comment.rating}
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