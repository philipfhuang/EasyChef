import React, { useState } from 'react';
import axios from 'axios';
import { AutoComplete } from '@douyinfe/semi-ui';
import { IconSearch } from '@douyinfe/semi-icons';
import { Input, Icon } from 'antd';

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
    const [coverFile, setCoverFile] = useState(null);
    const [dietSearchResults, setDietSearchResults] = useState([]);
    const [cuisineSearchResults, setCuisineSearchResults] = useState([]);
    const [ingredientSearchResults, setIngredientSearchResults] = useState([]);

    const searchIngredient = async (query, index) => {
        if (!query) return;
        const storedToken = localStorage.getItem('token');
        const accessToken = JSON.parse(storedToken).access;
    
        const config = {
            headers: { Authorization: `Bearer ${accessToken}` },
        };
    
        try {
            const response = await axios.get(`http://127.0.0.1:8000/search/filter/?type=ingredient&content=${query}`, config);
            const updatedSearchResults = [...ingredientSearchResults];
            updatedSearchResults[index] = Array.isArray(response.data.results) ? response.data.results : [];
            setIngredientSearchResults(updatedSearchResults);
        } catch (error) {
            console.error('Error searching for ingredients:', error);
            alert('Failed to search for ingredients.');
        }
    };

    const searchCuisine = async (query) => {
        if (!query) return;
        const storedToken = localStorage.getItem('token');
        const accessToken = JSON.parse(storedToken).access;
    
        const config = {
            headers: { Authorization: `Bearer ${accessToken}` },
        };
    
        try {
            const response = await axios.get(`http://127.0.0.1:8000/search/filter/?type=cuisine&content=${query}`, config);
            setCuisineSearchResults(Array.isArray(response.data.results) ? response.data.results : []);
        } catch (error) {
            console.error('Error searching for cuisines:', error);
            alert('Failed to search for cuisines.');
        }
    };

    const searchDiet = async (query) => {
        if (!query) return;
        const storedToken = localStorage.getItem('token');
        const accessToken = JSON.parse(storedToken).access;

        const config = {
            headers: { Authorization: `Bearer ${accessToken}` },
        };

        try {
            const response = await axios.get(`http://127.0.0.1:8000/search/filter/?type=diet&content=${query}`, config);
            setDietSearchResults(Array.isArray(response.data.results) ? response.data.results : []);
        } catch (error) {
            console.error('Error searching for diets:', error);
            alert('Failed to search for diets.');
        }
    };

    const addStepVideo = async (stepId, videoFiles) => {
        if (!stepId || !videoFiles || videoFiles.length === 0) {
            console.error(`Error adding videos to step ${stepId}: No step ID or video files.`);
            return;
        }

        const config = {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token')).access}`,
                'Content-Type': 'multipart/form-data',
            }
        };

        // Iterate over videoFiles and make an API call for each video
        for (const videoFile of videoFiles) {
            const formData = new FormData();
            formData.append('step', stepId);
            formData.append('video', videoFile);

            try {
                await axios.post('http://127.0.0.1:8000/posts/stepVideo/', formData, config);
                console.log(`Video added to step ${stepId} successfully!`);
            } catch (error) {
                console.error(`Error adding video to step ${stepId}:`, error);
                alert(`Failed to add video to step ${stepId}.`);
            }
        }

        alert(`All videos added to step ${stepId} successfully!`);
    };

    const updateCoverAndAddStepImages = async (recipeId, stepIds, steps) => {
        await updateCover(recipeId);
        for (let i = 0; i < steps.length; i++) {
            const stepId = stepIds[i];
            const imageFiles = steps[i].images;
            const videoFiles = steps[i].videos;
            await addStepImage(stepId, imageFiles);
            await addStepVideo(stepId, videoFiles);
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
    

    const addDiet = (item) => {
        if (typeof item === 'object') {
            setDiets([...diets, item.label]);
        } else if (typeof item === 'string' && item.trim()) {
            setDiets([...diets, item]);
        }
    };

    const addCuisine = (item) => {
        if (typeof item === 'object') {
            setCuisines([...cuisines, item.label]);
        } else if (typeof item === 'string' && item.trim()) {
            setCuisines([...cuisines, item]);
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
        setSteps([...steps, { step_number: steps.length + 1, content: '', images: [], videos: [] }]);
    };
    

    const handleImageInputChange = (stepIndex, imageIndex, imageFile) => {
        const updatedSteps = [...steps];
        updatedSteps[stepIndex].images[imageIndex] = imageFile;
        setSteps(updatedSteps);
    };
    
    const handleVideoInputChange = (stepIndex, videoIndex, videoFile) => {
        const updatedSteps = [...steps];
        updatedSteps[stepIndex].videos[videoIndex] = videoFile;
        setSteps(updatedSteps);
    };

    const deleteIngredient = (index) => {
        const updatedQuantities = [...ingredientQuantities];
        updatedQuantities.splice(index, 1);
        setIngredientQuantities(updatedQuantities);
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

        console.log(recipeData)
    
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
            <div>
            <label>
                Diet:
                <Input
                    value={diet}
                    onChange={(e) => {
                        setDiet(e.target.value);
                        searchDiet(e.target.value);
                    }}
                    onPressEnter={() => addDiet(diet)}
                />
<button type="button" onClick={() => addDiet(diet)}>
    Add Diet
</button>
            </label>
<div>
    {dietSearchResults.map((result, index) => (
        <div
            key={index}
            onClick={() => {
                addDiet(result);
                setDietSearchResults([]);
            }}
        >
            {result.label}
        </div>
    ))}
</div>
<ul>
    {diets.map((item, index) => (
        <li key={index}>{item}</li>
    ))}
</ul>
        </div>
        <div>
    {diets.map((dietItem, index) => (
        <div key={index}>
            <button
                type="button"
                onClick={() => {
                    const updatedDiets = [...diets];
                    updatedDiets.splice(index, 1);
                    setDiets(updatedDiets);
                }}
            >
                Delete Diet
            </button>
        </div>
    ))}
</div>

<label>
    Cuisine:
    <Input
        value={cuisine}
        onChange={(e) => {
            setCuisine(e.target.value);
            searchCuisine(e.target.value);
        }}
        onPressEnter={() => addCuisine(cuisine)}
    />
    <button type="button" onClick={() => addCuisine(cuisine)}>
        Add Cuisine
    </button>
</label>
<div>
    {cuisineSearchResults.map((result, index) => (
        <div
            key={index}
            onClick={() => {
                addCuisine(result);
                setCuisineSearchResults([]);
            }}
        >
            {result.label}
        </div>
    ))}
</div>
<ul>
    {cuisines.map((item, index) => (
        <li key={index}>{item}</li>
    ))}
</ul>
<div>
    {cuisines.map((cuisineItem, index) => (
        <div key={index}>
            <button
                type="button"
                onClick={() => {
                    const updatedCuisines = [...cuisines];
                    updatedCuisines.splice(index, 1);
                    setCuisines(updatedCuisines);
                }}
            >
                Delete Cuisine
            </button>
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
    onChange={(e) => {
        updateIngredientQuantity(index, 'ingredient', e.target.value);
        searchIngredient(e.target.value, index);
    }}
/>
                    </label>
                    <div>
    {ingredientSearchResults[index]?.map((result, idx) => (
        <div
            key={idx}
            onClick={() => {
                updateIngredientQuantity(index, 'ingredient', result.label);
                const updatedSearchResults = [...ingredientSearchResults];
                updatedSearchResults[index] = [];
                setIngredientSearchResults(updatedSearchResults);
            }}
        >
            {result.label}
        </div>
    ))}
</div>
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
                    <button type="button" onClick={() => deleteIngredient(index)}>
                        Delete Ingredient
                    </button>
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

                    {step.videos.map((video, videoIndex) => (
                        <div key={videoIndex}>
                            <label>
                            Video {videoIndex + 1} for step {step.step_number}:
                            <input
                                type="file"
                                onChange={(e) => {
                                    handleVideoInputChange(stepIndex, videoIndex, e.target.files[0], 'videos');
                                    console.log('Video file for step', stepIndex, 'video', videoIndex, 'set to:', e.target.files[0]);
                                }}
                            />
                            </label>
                            <button type="button" onClick={() => {
                                const updatedSteps = [...steps];
                                updatedSteps[stepIndex].videos.splice(videoIndex, 1);
                                setSteps(updatedSteps);
                            }}>Delete Video {videoIndex + 1}</button>
                            </div>
                            ))}
                            <button type="button" onClick={() => {
                                const updatedSteps = [...steps];
                                updatedSteps[stepIndex].videos.push(null);
                                setSteps(updatedSteps);
                            }}>Add Video</button>


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
