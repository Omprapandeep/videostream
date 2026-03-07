
import { BrowserRouter , Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import VideoPage from "./pages/VideoPage"
import Navbar from "./components/Navbar"
import UploadVideo from "./pages/UploadVideo"

function App() {
  return (
    <BrowserRouter >
      
      <Navbar />

      <Routes >
         <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/video/:id" element={<VideoPage />} />
        <Route path="/upload" element={<UploadVideo />}  />
      </Routes>
       
    
    </BrowserRouter>
  )
}

export default App
