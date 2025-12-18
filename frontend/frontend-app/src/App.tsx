import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home.tsx";
import Login from "./Pages/Login.tsx";
import Register from "./Pages/Register.tsx"
import NotFound from "./Pages/NotFound.tsx"
import Logout from './Components/logout.tsx'

import Header from "./Components/Header.tsx"
import './App.css'

function App() {
    return (
        <>      
            <Router>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="*" element={<NotFound />}/>
                </Routes>
            </Router>
        </>
    )
}

export default App
