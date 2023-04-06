import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Recipe = () => {
    const [recipe, setRecipe] = useState(null);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('http://127.0.0.1:8000/posts/recipe/1',
                {headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true,
                    "Access-Control-Allow-Origin": "*",
                }
            });
                setRecipe(response.data);
                setComments(response.data.comments);
            } catch (error) {
                console.error('Error fetching recipe:', error);
            }
        }
        fetchData();
    }, []);

    if (!recipe) return <div>Loading...</div>;

    return (
        <div className="recipe-container">
            <h1>{recipe.title}</h1>
            {recipe.cover ? (
                <img src={recipe.cover} alt={recipe.title} />
            ) : (
                <p>No cover image available</p>
            )}
            <p>Description: {recipe.description}</p>
            <p>Cooking time: {recipe.cooking_time} minutes</p>
            <h2>Ingredients:</h2>
            <ul>
                {recipe.ingredient_quantities.map(ingredient => (
                    <li key={ingredient.id}>
                        {ingredient.quantity} {ingredient.unit} of {ingredient.ingredient}
                    </li>
                ))}
            </ul>
            <h2>Steps:</h2>
            <ol>
                {recipe.steps.map(step => (
                    <li key={step.id}>{step.content}</li>
                ))}
            </ol>
            <h2>Comments:</h2>
            {comments.length > 0 ? (
                <ul>
                    {comments.map(comment => (
                        <li key={comment.id}>{comment.text}</li>
                    ))}
                </ul>
            ) : (
                <p>No comments available</p>
            )}
        </div>
    );
};

export default Recipe;