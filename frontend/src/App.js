import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import MyNav from './components/Nav';
import Search from "./components/Search";
import Login from "./components/Login";
import Recipe from "./components/Recipe";
import Signup from "./components/Signup";
import Home from "./components/Home";
import Explore from "./components/Explore";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MyNav/>}>
                    <Route index element={<Home/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/signup" element={<Signup/>}/>
                    <Route path="/recipe" element={<Recipe/>}/>
                    <Route path="/explore" element={<Explore/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
