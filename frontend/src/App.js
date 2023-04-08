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
import SearchContext, {useSearcContext} from "./contexts/SearchContext";

function App() {
    const expore = (
        <SearchContext.Provider value={useSearcContext()}>
            <Explore/>
        </SearchContext.Provider>
    )
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MyNav/>}>
                    <Route index element={<Home/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/signup" element={<Signup/>}/>
                    <Route path="/recipe" element={<Recipe/>}/>
                    <Route path="/explore" element={expore}/>
                    <Route path="/search" element={expore}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
