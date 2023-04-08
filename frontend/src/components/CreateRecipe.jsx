import React, { useState } from 'react';
import axios from 'axios';

const CreateRecipe = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [cookingTime, setCookingTime] = useState('');
    const [ingredientQuantities, setIngredientQuantities] = useState([]);
    const [steps, setSteps] = useState([]);
    const [diet, setDiet] = useState('');
    const [cuisine, setCuisine] = useState('');
    const [diets, setDiets] = useState([]);
    const [cuisines, setCuisines] = useState([]);
    const [recipeId, setRecipeId] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [stepIds, setStepIds] = useState([]);

    const updateCoverAndAddStepImages = async (recipeId, stepIds, steps) => {
        await updateCover(recipeId);
        for (let i = 0; i < steps.length; i++) {
            const stepId = stepIds[i];
            const imageFiles = steps[i].images;
            await addStepImage(stepId, imageFiles);
        }
    };
    
    

    const addStepImage = async (stepId, imageFiles) => {
        if (!stepId || !imageFiles || imageFiles.length === 0) {
            console.error(`Error adding images to step ${stepId}: No step ID or image files.`);
            return;
        }
    
        const config = {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token')).access}`,
                'Content-Type': 'multipart/form-data',
            }
        };
    
        // Iterate over imageFiles and make an API call for each image
        for (const imageFile of imageFiles) {
            const formData = new FormData();
            formData.append('step', stepId);
            formData.append('image', imageFile);
    
            try {
                await axios.post('http://127.0.0.1:8000/posts/stepImage/', formData, config);
                console.log(`Image added to step ${stepId} successfully!`);
            } catch (error) {
                console.error(`Error adding image to step ${stepId}:`, error);
                alert(`Failed to add image to step ${stepId}.`);
            }
        }
    
        alert(`All images added to step ${stepId} successfully!`);
    };
    
    
    
    

    const updateCover = async (recipeId) => {
        if (!recipeId || !coverFile) {
            alert('Please create a recipe and choose a cover image before updating the cover.');
            return;
        }
    
        const formData = new FormData();
        formData.append('cover', coverFile);
        formData.append('id', recipeId);
    
        const config = {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token')).access}`,
                'Content-Type': 'multipart/form-data',
            }
        };
    
        try {
            await axios.patch(`http://127.0.0.1:8000/posts/recipeUpdate/`, formData, config);
            alert('Cover image updated successfully!');
        } catch (error) {
            console.error('Error updating cover image:', error);
            alert('Failed to update cover image.');
        }
    };
    

    const addDiet = () => {
        if (diet) {
            setDiets([...diets, diet]);
            setDiet('');
        }
    };

    const addCuisine = () => {
        if (cuisine) {
            setCuisines([...cuisines, cuisine]);
            setCuisine('');
        }
    };

    const addIngredientQuantity = () => {
        setIngredientQuantities([...ingredientQuantities, { unit: '', quantity: '', ingredient: '' }]);
    };

    const updateIngredientQuantity = (index, field, value) => {
        const updatedQuantities = [...ingredientQuantities];
        updatedQuantities[index][field] = value;
        setIngredientQuantities(updatedQuantities);
    };

    const addStep = () => {
        setSteps([...steps, { step_number: steps.length + 1, content: '', images: [null] }]);
    };
    

    const handleImageInputChange = (stepIndex, imageIndex, imageFile) => {
        const updatedSteps = [...steps];
        if (updatedSteps[stepIndex].images[imageIndex] === null) {
            updatedSteps[stepIndex].images[imageIndex] = [imageFile];
        } else {
            updatedSteps[stepIndex].images[imageIndex].push(imageFile);
        }
        setSteps(updatedSteps);
    };
    
    

    const updateStep = (index, value) => {
        const updatedSteps = [...steps];
        updatedSteps[index].content = value;
        setSteps(updatedSteps);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const storedToken = localStorage.getItem('token');
        const accessToken = JSON.parse(storedToken).access;
    
        const config = {
            headers: { Authorization: `Bearer ${accessToken}` }
        };
    
        const recipeData = {
            title,
            description,
            ingredient_quantities_data: ingredientQuantities,
            diet_data: diets,
            cuisine_data: cuisines,
            steps,
            cooking_time: parseInt(cookingTime)
        };
    
        try {
            const response = await axios.post('http://127.0.0.1:8000/posts/recipe/', recipeData, config);
            const recipeId = response.data.id; // Extract the id from the returned JSON
            const createdStepIds = response.data.steps.map(step => step.id); // Extract step ids from the returned JSON
            console.log(createdStepIds)
            alert('Recipe created successfully!');
        
            // Call updateCoverAndAddStepImages after successfully creating the recipe
            await updateCoverAndAddStepImages(recipeId, createdStepIds, steps);
        
        } catch (error) {
            console.error('Error creating recipe:', error);
            alert('Failed to create recipe.');
        }
    };
    

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Title:
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>
            <label>
                Description:
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
            </label>
            <label>
                Cooking Time:
                <input type="text" value={cookingTime} onChange={(e) => setCookingTime(e.target.value)} />
            </label>

            <label>
            Diet:
            <input type="text" value={diet} onChange={(e) => setDiet(e.target.value)} />
            <button type="button" onClick={addDiet}>
                Add Diet
            </button>
        </label>
        <div>
            {diets.map((dietItem, index) => (
                <div key={index}>
                    <p>{dietItem}</p>
                    <button type="button" onClick={() => {
                        const updatedDiets = [...diets];
                        updatedDiets.splice(index, 1);
                        setDiets(updatedDiets);
                    }}>Delete Diet</button>
                </div>
            ))}
        </div>

        <label>
            Cuisine:
            <input type="text" value={cuisine} onChange={(e) => setCuisine(e.target.value)} />
            <button type="button" onClick={addCuisine}>
                Add Cuisine
            </button>
        </label>
        <div>
            {cuisines.map((cuisineItem, index) => (
                <div key={index}>
                    <p>{cuisineItem}</p>
                    <button type="button" onClick={() => {
                        const updatedCuisines = [...cuisines];
                        updatedCuisines.splice(index, 1);
                        setCuisines(updatedCuisines);
                    }}>Delete Cuisine</button>
                </div>
            ))}
        </div>
            
            {/* Ingredient Quantities */}
            {ingredientQuantities.map((ingredientQuantity, index) => (
                <div key={index}>
                    <label>
                        Ingredient:
                        <input
                            type="text"
                            value={ingredientQuantity.ingredient}
                            onChange={(e) => updateIngredientQuantity(index, 'ingredient', e.target.value)}
                        />
                    </label>
                    <label>
                        Quantity:
                        <input
                            type="number"
                            value={ingredientQuantity.quantity}
                            onChange={(e) => updateIngredientQuantity(index, 'quantity', e.target.value)}
                        />
                    </label>
                    <label>
                        Unit:
                        <input
                            type="text"
                            value={ingredientQuantity.unit}
                            onChange={(e) => updateIngredientQuantity(index, 'unit', e.target.value)}
                        />
                    </label>
                </div>
            ))}
            <button type="button" onClick={addIngredientQuantity}>
                Add Ingredient
            </button>

            {/* Steps */}
            {steps.map((step, stepIndex) => (
                <div key={stepIndex}>
                    <label>
                        Step {step.step_number}:
                        <input
                            type="text"
                            value={step.content}
                            onChange={(e) => updateStep(stepIndex, e.target.value)}
                        />
                    </label>
                    {step.images.map((image, imageIndex) => (
                        <div key={imageIndex}>
                            <label>
                                Image {imageIndex + 1} for step {step.step_number}:
                                <input
                                    type="file"
                                    onChange={(e) => {
                                        handleImageInputChange(stepIndex, imageIndex, e.target.files[0]);
                                        console.log('Image file for step', stepIndex, 'image', imageIndex, 'set to:', e.target.files[0]);
                                    }}
                                />
                            </label>
                            <button type="button" onClick={() => {
                                const updatedSteps = [...steps];
                                updatedSteps[stepIndex].images.splice(imageIndex, 1);
                                setSteps(updatedSteps);
                            }}>Delete Image {imageIndex + 1}</button>
                        </div>
                    ))}
                    <button type="button" onClick={() => {
                        const updatedSteps = [...steps];
                        updatedSteps[stepIndex].images.push(null);
                        setSteps(updatedSteps);
                    }}>Add Image</button>
                    <button type="button" onClick={() => {
                        const updatedSteps = [...steps];
                        updatedSteps.splice(stepIndex, 1);
                        setSteps(updatedSteps);
                    }}>Delete Step {step.step_number}</button>
                </div>
            ))}


            <button type="button" onClick={addStep}>
                Add Step
            </button>

            {/* Cover Image */}
            <label>
                Cover Image:
                <input type="file" onChange={(e) => setCoverFile(e.target.files[0])} />
            </label>

            {/* Submit Button */}
            <button type="submit">Create Recipe and Add Images</button>

        </form>
    );
};

export default CreateRecipe;
