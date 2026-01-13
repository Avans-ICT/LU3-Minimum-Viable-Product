import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home.tsx";
import Login from "./Pages/Login.tsx";
import Register from "./Pages/Register.tsx"
import NotFound from "./Pages/NotFound.tsx"
import SingleModulePage from "./Pages/SingleModulePage.tsx"
import Header from "./Components/Header.tsx"
import ModulePage from "./Pages/ModulePage.tsx";
import { ProtectedRoute } from "./auth/ProtectedRoute.tsx";
import { AuthProvider } from "./auth/AuthContext.tsx";
import RecommendationPage from "./Pages/RecommendationPage.tsx"
import "./Colors.css"
import ProfilePage from "./Pages/ProfilePage.tsx";


function App() {
    return (
        <>
            <AuthProvider> 
                <Router>
                    <Header />
                    <Routes>
                        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="*" element={<NotFound />} />
                        <Route path="/module/:id" element={<ProtectedRoute><SingleModulePage /></ProtectedRoute>} />
                        <Route path="/allmodules" element={<ProtectedRoute><ModulePage /></ProtectedRoute>} />
                        <Route path="/recommendations" element={<ProtectedRoute><RecommendationPage /></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                    </Routes>
                </Router>
            </AuthProvider>   
        </>
            
    )
}

export default App
