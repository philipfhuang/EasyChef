import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import MyNav from './components/Nav';
import Search from "./components/Search";
import Login from "./components/Login";
import UserContext, {useUserContext} from "./contexts/UserContext";
import Recipe from "./components/Recipe";

function App() {
    const login = (
        <UserContext.Provider value={useUserContext()}>
            <Login/>
        </UserContext.Provider>
    )
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MyNav/>}>
                    <Route path="/explore" element={<Search/>}/>
                    <Route path="/login" element={login}/>
                    <Route path="/recipe" element={<Recipe/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
