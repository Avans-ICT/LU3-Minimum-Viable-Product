import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home.tsx";
import Login from "./Pages/Login.tsx";
import Register from "./Pages/Register.tsx"
import NotFound from "./Pages/NotFound.tsx"
import SingleModulePage from "./Pages/SingleModulePage.tsx"
import Header from "./Components/Header.tsx"
import ModulePage from "./Pages/ModulePage/ModulePage.tsx";

function App() {
  return (
    <>      
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />}/>
          <Route path="/module/:id" element={<SingleModulePage />} />
          <Route path="/allmodules" element={<ModulePage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
