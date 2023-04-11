import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Image } from '@douyinfe/semi-ui';
import { AutoComplete } from '@douyinfe/semi-ui';
import { IconSearch } from '@douyinfe/semi-icons';
import { Input, Icon } from 'antd';
import { useParams } from 'react-router-dom';



const EditRecipe = () => {
    const [recipe, setRecipe] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [cookingTime, setCookingTime] = useState('');
    const [steps, setSteps] = useState([]);
    const [ingredientQuantities, setIngredientQuantities] = useState([]);
    const [diets, setDiets] = useState([]);
    const [cuisines, setCuisines] = useState([]);
    const [coverFile, setCoverFile] = useState(null);
    const [dietSearchResults, setDietSearchResults] = useState([]);
    const [cuisineSearchResults, setCuisineSearchResults] = useState([]);
    const [ingredientSearchResults, setIngredientSearchResults] = useState([]);
    const [diet, setDiet] = useState('');
    const [cuisine, setCuisine] = useState('');
    const [recipeId, setRecipeId] = useState(null);
    const [ingredient, setIngredient] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('');
    const [stepContent, setStepContent] = useState('');
    const [stepImages, setStepImages] = useState([]);
    const [stepVideos, setStepVideos] = useState([]);
    const [stepId, setStepId] = useState(null);
    const [stepImageFiles, setStepImageFiles] = useState([]);
    const [stepVideoFiles, setStepVideoFiles] = useState([]);
    const [createdStepIds, setCreatedStepIds] = useState([]);
    const { id } = useParams();



  

    useEffect(() => {
        async function fetchRecipe() {
            try {
              const response = await axios.get(`http://127.0.0.1:8000/posts/recipe/${id}/`);
              console.log(response.data)
              const recipe = response.data;
              setCreatedStepIds(recipe.steps.map(step => step.id));
              setRecipeId(recipe.id);
              setTitle(recipe.title);
              setDescription(recipe.description);
              setCookingTime(recipe.cooking_time);
              setIngredientQuantities(recipe.ingredient_quantities.map(ingredientQuantity => ({
                id: ingredientQuantity.id,
                unit: ingredientQuantity.unit.name,
                quantity: ingredientQuantity.quantity,
                ingredient: ingredientQuantity.ingredient.name
              })));
              setDiets(recipe.diets.map(diet => diet.diet.name));
              setCuisines(recipe.cuisines.map(cuisine => cuisine.cuisine.name));
              // setSteps if you have a steps state
              setRecipe(recipe); 
              setSteps(recipe.steps.map((step) => ({
                id: step.id,
                step_number: step.step_number,
                content: step.content,
                recipe: step.recipe,
                images: step.images,
                videos: step.videos
                })));
              setCoverFile(recipe.cover);
        
            } catch (error) {
              console.error('Error fetching recipe:', error);
            }
          }
        
        fetchRecipe();
    }, []);






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
        const newVideoFiles = videoFiles.map((video) => video.file);
        if (!stepId || !newVideoFiles || newVideoFiles.length === 0) {
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
        for (const videoFile of newVideoFiles) {
            const formData = new FormData();
            formData.append('step', stepId);
            formData.append('video', videoFile);

            try {
                await axios.post('http://127.0.0.1:8000/posts/stepVideo/', formData, config);
                console.log(`Video added to step ${stepId} successfully!`);
            } catch (error) {
                console.error(`Error adding video to step ${stepId}:`, error);
            }
        }
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

        const newImageFiles = imageFiles.map((image) => image.file);
        if (!stepId || !newImageFiles || newImageFiles.length === 0) {
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
        for (const imageFile of newImageFiles) {
            const formData = new FormData();
            formData.append('step', stepId);
            formData.append('image', imageFile);
    
            try {
                await axios.post('http://127.0.0.1:8000/posts/stepImage/', formData, config);
                console.log(`Image added to step ${stepId} successfully!`);
            } catch (error) {
                console.error(`Error adding image to step ${stepId}:`, error);
            }
        }
    
    };
    

    const updateCover = async (recipeId) => {
        if (!recipeId || !coverFile) {
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
        } catch (error) {
            console.error('Error updating cover image:', error);
        }
    };
    

    const addDiet = async (item) => {
        if (typeof item === "object") {
          setDiets([...diets, item.label]);
          await addDietToAPI(recipeId, item.label);
        } else if (typeof item === "string" && item.trim()) {
          setDiets([...diets, item]);
          await addDietToAPI(recipeId, item);
        }
    };

    const addDietToAPI = async (recipe_id, diet_name) => {

        const config = {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token')).access}`,
                'Content-Type': 'multipart/form-data',
            }
        };

        try {
          await axios.post("http://127.0.0.1:8000/posts/recipeDiet/", {
            recipe_id,
            diet_name
          }, config);
        } catch (error) {
          console.error("Error adding diet to API:", error);
        }
    };

    const deleteDietFromAPI = async (recipe_id, diet_name) => {
        const config = {
          headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token')).access}`,
          },
          data: {
            recipe_id: recipe_id,
            diet_name: diet_name,
          },
        };
              
        try {
          await axios.delete("http://127.0.0.1:8000/posts/recipeDietDelete/", config);
        } catch (error) {
          console.error("Error deleting diet from API:", error);
        }
    };


    const addCuisine = async (item) => {
        if (typeof item === "object") {
          setCuisines([...cuisines, item.label]);
          await addCuisineToAPI(recipeId, item.label);
        } else if (typeof item === "string" && item.trim()) {
          setCuisines([...cuisines, item]);
          await addCuisineToAPI(recipeId, item);
        }
    };

    const addCuisineToAPI = async (recipe_id, cuisine_name) => {

        const config = {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token')).access}`,
                'Content-Type': 'multipart/form-data',
            }
        };
        try {
          await axios.post("http://127.0.0.1:8000/posts/recipeCuisine/", {
            recipe_id,
            cuisine_name,
          }, config);
        } catch (error) {
          console.error("Error adding cuisine to API:", error);
        }
    };

    const deleteCuisineFromAPI = async (recipe_id, cuisine_name) => {

        const config = {
            headers: {
              'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token')).access}`,
            },
            data: {
              recipe_id: recipe_id,
              cuisine_name: cuisine_name,
            },
        };

        try {
          await axios.delete("http://127.0.0.1:8000/posts/recipeCuisineDelete/", config);
        } catch (error) {
          console.error("Error deleting cuisine from API:", error);
        }
    };

    const saveIngredients = async () => {
        for (const ingredientQuantity of ingredientQuantities) {
          if (!ingredientQuantity.id) {
            await createIngredient(ingredientQuantity);
          } else {
            await updateIngredient(ingredientQuantity);
          }
        }
    };


    const createIngredient = async (ingredientQuantity) => {
        const data = {
        ingredient_name: ingredientQuantity.ingredient,
        quantity: ingredientQuantity.quantity,
        recipe_id: recipeId,
        unit_name: ingredientQuantity.unit,
        };

        const config = {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token')).access}`,
                'Content-Type': 'multipart/form-data',
            }
        }; 

        try {
            await axios.post('http://127.0.0.1:8000/posts/ingredientQuantity/', data, config);
          } catch (error) {
            console.error('Error creating ingredient:', error);
          }
    };

    const updateIngredient = async (ingredientQuantity) => {
        const data = {
          ingredient_name: ingredientQuantity.ingredient,
          quantity: ingredientQuantity.quantity,
          recipe_id: recipeId,
          unit_name: ingredientQuantity.unit,
          id: ingredientQuantity.id,
        };

        const config = {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token')).access}`,
                'Content-Type': 'multipart/form-data',
            }
        }; 
      
        try {
          await axios.patch('http://127.0.0.1:8000/posts/ingredientQuantityUpdate/', data, config);
        } catch (error) {
          console.error('Error updating ingredient:', error);
        }
    };

    const deleteIngredient = async (index) => {
        const ingredientQuantity = ingredientQuantities[index];

        const config = {
            headers: {
              'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token')).access}`,
            },
            data: {
              id: ingredientQuantity.id,
            },
        };


        if (ingredientQuantity.id) {
          try {
            await axios.delete('http://127.0.0.1:8000/posts/ingredientQuantityDelete/', config);
          } catch (error) {
            console.error('Error deleting ingredient:', error);
          }
        }
      
        const updatedQuantities = [...ingredientQuantities];
        updatedQuantities.splice(index, 1);
        setIngredientQuantities(updatedQuantities);
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
        const newStep = {
          id: null,
          step_number: steps.length + 1,
          content: "",
          images: [{ id: null, file: null }],
          videos: [{ id: null, file: null }],
        };
        setSteps([...steps, newStep]);
      };
    

    const handleImageInputChange = (stepIndex, imageIndex, file) => {
        const updatedSteps = [...steps];
        updatedSteps[stepIndex].images[imageIndex] = { id: null, file };
        setSteps(updatedSteps);
      };
    
    const handleVideoInputChange = (stepIndex, videoIndex, file) => {
        const updatedSteps = [...steps];
        updatedSteps[stepIndex].videos[videoIndex] = { id: null, file };
        setSteps(updatedSteps);
    };

    const updateStep = (index, value) => {
        const updatedSteps = [...steps];
        updatedSteps[index].content = value;
        setSteps(updatedSteps);
    };

    const saveSteps = async () => {
        for (const step of steps) {
            if (!step.id) {
                await createStep(step);
            } else {
                await updateStepContent(step);
                await addStepImage(step.id, step.images.filter((image) => image.id === null));
                await addStepVideo(step.id, step.videos.filter((video) => video.id === null));
            }
        }
    };

    const createStep = async (step) => {

        const config = {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token')).access}`,
                'Content-Type': 'multipart/form-data',
            }
        }; 

        const data = {
          recipe_id: recipeId,
          step_number: step.step_number,
          content: step.content,
        };
      
        try {
          const response = await axios.post('http://127.0.0.1:8000/posts/step/', data, config);
          const stepId = response.data.id;
          await createStepImage(stepId, step.images);
          await createStepVideo(stepId, step.videos);
        } catch (error) {
          console.error('Error creating step:', error);
        }
    };

    const updateStepContent = async (step) => {

        const config = {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token')).access}`,
                'Content-Type': 'multipart/form-data',
            }
        }; 

        const data = {
          id: step.id,
          step_number: step.step_number,
          content: step.content,
        };
      
        try {
          await axios.patch('http://127.0.0.1:8000/posts/stepUpdate/', data, config);
          const stepId = step.id;
          await createStepImage(stepId, step.images);
          await createStepVideo(stepId, step.videos);
        } catch (error) {
          console.error('Error updating step:', error);
        }
    };

    const deleteStep = async (stepId) => {
        const config = {
            headers: {
              'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token')).access}`,
            },
            data: {
              id: stepId,
            },
        };

        try {
          await axios.post('http://127.0.0.1:8000/posts/stepDelete/', config);
        } catch (error) {
          console.error('Error deleting step:', error);
        }
    };

    const createStepImage = async (stepId, imageFiles) => {
        // Reuse addStepImage() function from previous code
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
            }
        }
    
    };

    const deleteStepImage = async (imageId) => {
        const config = {
            headers: {
              'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token')).access}`,
            },
            data: {
              id: imageId,
            },
        };


        try {
          await axios.delete('http://127.0.0.1:8000/posts/stepImageDelete/', config);
        } catch (error) {
          console.error('Error deleting step image:', error);
        }
    };

    const createStepVideo = async (stepId, videoFiles) => {
        // Reuse addStepVideo() function from previous code
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
            }
        }

    };

    const deleteStepVideo = async (videoId) => {
        const config = {
            headers: {
              'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token')).access}`,
            },
            data: {
              id: videoId,
            },
        };

        try {
          await axios.delete('http://127.0.0.1:8000/posts/stepVideoDelete/', config);
        } catch (error) {
          console.error('Error deleting step video:', error);
        }
      };


    const handleSubmit = async (e) => {
        e.preventDefault();
    
    
        const updateConfig = {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token')).access}`,
                'Content-Type': 'multipart/form-data',
            }
        };
    
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('cooking_time', cookingTime);
        formData.append('id', recipeId);

        if (coverFile && coverFile instanceof File) {
            formData.append('cover', coverFile);
        }

        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }
    
        try {
            await axios.patch(`http://127.0.0.1:8000/posts/recipeUpdate/`, formData, updateConfig);
            alert('Recipe updated successfully!');
        
            // Call updateCoverAndAddStepImages after successfully creating the recipe
            await updateCoverAndAddStepImages(recipeId, createdStepIds, steps);
        
        } catch (error) {
            console.error('Error updating recipe:', error);
            alert('Failed to update recipe.');
        }
    };

    if (!recipe) return <div>Loading...</div>;

    return (
        <>
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
        </div>

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
    <input type="number" value={cookingTime} onChange={(e) => setCookingTime(e.target.value)} />
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
        onClick={async () => {
          const updatedDiets = [...diets];
          updatedDiets.splice(index, 1);
          setDiets(updatedDiets);
          await deleteDietFromAPI(recipeId, dietItem);
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
        onClick={async () => {
          const updatedCuisines = [...cuisines];
          updatedCuisines.splice(index, 1);
          setCuisines(updatedCuisines);
          await deleteCuisineFromAPI(recipeId, cuisineItem);
        }}
      >
        Delete Cuisine
      </button>
    </div>
  ))}
</div>

Ingredient Quantities
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

<button type="button" onClick={saveIngredients}>
  Save Ingredients
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
                    deleteStepImage(image.id);
                    const updatedSteps = [...steps];
                    updatedSteps[stepIndex].images.splice(imageIndex, 1);
                    setSteps(updatedSteps);
                }}>Delete Image {imageIndex + 1}</button>
            </div>
        ))}
<button
  type="button"
  onClick={() => {
    const updatedSteps = [...steps];
    updatedSteps[stepIndex].images.push({ id: null, file: null });
    setSteps(updatedSteps);
  }}
>
  Add Image
</button>

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
                    deleteStepVideo(video.id);
                    const updatedSteps = [...steps];
                    updatedSteps[stepIndex].videos.splice(videoIndex, 1);
                    setSteps(updatedSteps);
                }}>Delete Video {videoIndex + 1}</button>
                </div>
                ))}
<button
  type="button"
  onClick={() => {
    const updatedSteps = [...steps];
    updatedSteps[stepIndex].videos.push({ id: null, file: null });
    setSteps(updatedSteps);
  }}
>
  Add Video
</button>


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

<button type="button" onClick={saveSteps}>
  Save Steps
</button>

{/* Cover Image */}
<label>
    Cover Image:
    <input type="file" onChange={(e) => setCoverFile(e.target.files[0])} />
</label>

{/* Submit Button */}
<button type="submit">Create Recipe and Add Images</button>

</form></>
    );

};

export default EditRecipe;