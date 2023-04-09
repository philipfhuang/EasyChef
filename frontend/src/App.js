import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import MyNav from './components/Nav';
import Search from "./components/Search";
import Login from "./components/Login";
import Recipe from "./components/Recipe";
import Signup from "./components/Signup";
import Home from "./components/Home";
import CreateRecipe from "./components/CreateRecipe";
import Explore from "./components/Explore";
import SearchContext, {useSearcContext} from "./contexts/SearchContext";
import SearchPage from "./components/SearchPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MyNav/>}>
                <Route index element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/signup" element={<Signup/>}/>
                <Route path="/recipe" element={<Recipe/>}/>
                <Route path="/createRecipe" element={<CreateRecipe/>}/>
                <Route path="/explore" element={<Explore/>}/>
                <Route path="/search" element={<SearchPage/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
