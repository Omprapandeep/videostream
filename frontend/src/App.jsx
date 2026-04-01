
import { BrowserRouter , Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import VideoPage from "./pages/VideoPage"
import Navbar from "./components/Navbar"
import UploadVideo from "./pages/UploadVideo"
import Mychannel from "./pages/Mychannel"
import Channelpage from "./pages/Channelpage"

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
        <Route path="/mychannel" element={<Mychannel />}  />
        <Route path="/channel/:userId" element={<Channelpage />}  />

      </Routes>
       
    
    </BrowserRouter>
  )
}

export default App
