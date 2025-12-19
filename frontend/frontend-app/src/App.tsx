import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home.tsx";
import Login from "./Pages/Login.tsx";
import Register from "./Pages/Register.tsx"
import NotFound from "./Pages/NotFound.tsx"
import { AuthProvider } from "./auth/AuthContext.tsx";
import Header from "./Components/Header.tsx"
import './App.css'
import { ProtectedRoute } from "./auth/ProtectedRoute.tsx";

function App() {
    return (
        <>
            <AuthProvider>
                <Router>
                    <Header />
                    <Routes>
                        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Router>
            </AuthProvider>
        </>
    )
}

export default App
