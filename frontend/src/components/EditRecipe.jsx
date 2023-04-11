import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, Button, InputNumber, Select, Upload, List, Space, Row, Col } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import './CreateRecipe.css';
import {
    Image,
    ImagePreview,
    Rating,
    Typography,
    Divider,
    Toast,
    Avatar,
    Empty, Pagination, BackTop
} from '@douyinfe/semi-ui';

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
    const [unitSearchResults, setUnitSearchResults] = useState([]);
    const { id } = useParams();

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




    const searchUnit = async (query, index) => {
        if (!query) return;
        const storedToken = localStorage.getItem('token');
        const accessToken = JSON.parse(storedToken).access;

        const config = {
            headers: { Authorization: `Bearer ${accessToken}` },
        };

        try {
            const response = await axios.get(`http://127.0.0.1:8000/search/filter/?type=unit&content=${query}`, config);
            const updatedSearchResults = [...unitSearchResults];
            updatedSearchResults[index] = Array.isArray(response.data.results) ? response.data.results : [];
            setUnitSearchResults(updatedSearchResults);
        } catch (error) {
            console.error('Error searching for units:', error);
            alert('Failed to search for units.');
        }
    };

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

            window.location.reload();
        
        } catch (error) {
            console.error('Error updating recipe:', error);
            alert('Failed to update recipe.');
        }
    };

    if (!recipe) return <div>Loading...</div>;

    return (
        <>


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

            </div>





        <div className="form-container">
            <Row justify="center">
                <Col xs={24} sm={24} md={18} lg={12} xl={10}>
                    <Form onFinish={handleSubmit}>
                        {/* Cover Image */}
                        <Form.Item label="Cover Image">
                            <Upload
                            beforeUpload={file => {
                                setCoverFile(file);
                                return false;
                            }}
                            >
                                <Button>Click to Edit</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item label="Title">
                            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                        </Form.Item>
                        <Form.Item label="Description">
                            <Input value={description} onChange={(e) => setDescription(e.target.value)} />
                        </Form.Item> 
                        <Form.Item label="Cooking Time (min)">
                        <InputNumber
                            min={0}
                            value={cookingTime}
                            onChange={(value) => setCookingTime(value)}
                        />
                        </Form.Item>
                        <Row gutter={16}>
                            <Col>
                                <div style={{ display: 'inline-block' }}>
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

                                </div>
                            </Col>
                            <Col>
                                <div style={{ display: 'inline-block' }}>
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
                                </div>
                            </Col>
                        </Row>
                        {/* Ingredients */}
                        <Form.Item label="Ingredient">
                            {ingredientQuantities.map((ingredientQuantity, index) => (
                            <Space key={index} direction="horizontal" style={{ width: '100%' }}>
                                <Form.Item label={`${index + 1}`}>
                                <Input
                                    value={ingredientQuantity.ingredient}
                                    onChange={(e) => {
                                    updateIngredientQuantity(index, 'ingredient', e.target.value);
                                    searchIngredient(e.target.value, index);
                                    }}
                                />
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
                            </Form.Item>
                            <Form.Item label={`Quantity ${index + 1}`}>
                            <Input
                                type="number"
                                value={ingredientQuantity.quantity}
                                onChange={(e) => updateIngredientQuantity(index, 'quantity', e.target.value)}
                            />
                            </Form.Item>
                            <Form.Item label={`Unit ${index + 1}`}>
                            <Input
                                value={ingredientQuantity.unit}
                                onChange={(e) => {
                                updateIngredientQuantity(index, 'unit', e.target.value);
                                searchUnit(e.target.value, index);
                                }}
                            />
                            <div>
                                {unitSearchResults[index]?.map((result, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => {
                                    updateIngredientQuantity(index, 'unit', result.label);
                                    const updatedSearchResults = [...unitSearchResults];
                                    updatedSearchResults[index] = [];
                                    setUnitSearchResults(updatedSearchResults);
                                    }}
                                >
                                    {result.label}
                                </div>
                                ))}
                            </div>
                            </Form.Item>
                            <Button type="primary" danger onClick={() => deleteIngredient(index)}>
                            Delete
                            </Button>
                        </Space>
                        ))}
                        <Button type="primary" onClick={addIngredientQuantity} icon={<PlusOutlined />}>
                        Add
                        </Button>
                        <Button type="primary" onClick={saveIngredients} icon={<PlusOutlined />}>
                            Save
                        </Button>
                        </Form.Item>
                        {/* Steps */}
                        <Form.Item label="Steps">
                        {steps.map((step, stepIndex) => (
                            <div key={stepIndex}>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                <Form.Item label={`Step ${step.step_number}`}>
                                <Input
                                    value={step.content}
                                    onChange={(e) => updateStep(stepIndex, e.target.value)}
                                />
                                </Form.Item>
                            </Space>
                            <Form.Item>
                            {step.images.map((image, imageIndex) => (
                            <Space key={imageIndex} direction="horizontal" style={{ height: '100%' }}>
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
                            </Space>
                            ))}
                                <button type="button" onClick={() => {
                                const updatedSteps = [...steps];
                                updatedSteps[stepIndex].images.push({ id: null, file: null });
                                setSteps(updatedSteps);
                                }}>Add Image</button>
                            </Form.Item>
                            <Form.Item>
                                {step.videos.map((video, videoIndex) => (
                                <Space key={videoIndex} direction="horizontal" style={{ height: '100%' }}>
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
                                </Space>
                                ))}
                                    <button type="button" onClick={() => {
                                    const updatedSteps = [...steps];
                                    updatedSteps[stepIndex].videos.push({ id: null, file: null });
                                    setSteps(updatedSteps);
                                    }}>Add Video</button>
                                </Form.Item>
                                <Form.Item>
                                <button type="button" onClick={() => {
                                    const updatedSteps = [...steps];
                                    updatedSteps.splice(stepIndex, 1);
                                    setSteps(updatedSteps);
                                    }}>Delete {step.step_number}</button>
                                </Form.Item>
                                </div>
                            ))}
                            <Form.Item>
                            <Button type="primary" onClick={addStep} icon={<PlusOutlined />}>
                                Add
                            </Button>
                            </Form.Item>
                            <Form.Item>
                            <Button type="primary" onClick={saveSteps} icon={<PlusOutlined />}>
                                Save
                            </Button>
                            </Form.Item>
                            <Button type="primary" htmlType='submit' icon={<PlusOutlined />}>
                                Save all changes
                            </Button>


                        </Form.Item>

                    </Form>
                </Col>
            </Row>
        </div>
        </>
        
    );
};





export default EditRecipe;