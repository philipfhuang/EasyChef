import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import MyNav from './components/Nav';
import Login from "./components/Login";
import Recipe from "./components/Recipe";
import Signup from "./components/Signup";
import Home from "./components/Home";
import CreateRecipe from "./components/CreateRecipe";
import EditRecipe from "./components/EditRecipe";

import SearchPage from "./components/SearchPage";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import ShoppingList from "./components/ShoppingList";
import ContentList from "./components/ContentList";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                    <Route path="/" element={<MyNav/>}>
                    <Route index element={<Home/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/signup" element={<Signup/>}/>
                    <Route path="/recipe/:id" element={<Recipe/>}/>
                    <Route path="/createRecipe" element={<CreateRecipe/>}/>
                    <Route path="/editRecipe/:id" element={<EditRecipe/>}/>
                    <Route path="/explore" element={<ContentList content="explore"/>}/>
                    <Route path="/search" element={<SearchPage/>}/>
                    <Route path="/accounts/profile/:user_id/" element={<Profile/>}/>
                    <Route path="/accounts/profile/edit/" element={<EditProfile/>}/>
                    <Route path="/shoppinglist" element={<ShoppingList/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
