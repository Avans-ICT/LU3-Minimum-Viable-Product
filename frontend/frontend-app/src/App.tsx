import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home.tsx";
import Login from "./Pages/Login.tsx";
import Register from "./Pages/Register.tsx"
import NotFound from "./Pages/NotFound.tsx"
import SingleModulePage from "./Pages/SingleModulePage.tsx"
import Header from "./Components/Header.tsx"
import ModulePage from "./Pages/ModulePage/ModulePage.tsx";
import { ProtectedRoute } from "./auth/ProtectedRoute.tsx";
import { AuthProvider } from "./auth/AuthContext.tsx";
import "./Colors.css"


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
                    </Routes>
                </Router>
            </AuthProvider>   
        </>
            
    )
}

export default App
