
import { BrowserRouter, Routes, Route } from "react-router-dom"
import MainLayout from "./layouts/Mainlayout"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import VideoPage from "./pages/VideoPage"
import Navbar from "./components/Navbar"
import UploadVideo from "./pages/UploadVideo"
import Mychannel from "./pages/Mychannel"
import Channelpage from "./pages/Channelpage"
import Feed from "./pages/Feedpage"
import MyProfile from "./pages/Myprofile"

function App() {
  return (
    <BrowserRouter >
      <Routes>

        {/* 🔓 Public Pages (NO sidebar/navbar) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔒 Pages WITH layout */}
        <Route path="/" element={
          <MainLayout>
            <Home />
          </MainLayout>
        } />

        <Route path="/feed" element={
          <MainLayout>
            <Feed />
          </MainLayout>
        } />

        <Route path="/video/:id" element={
          <MainLayout>
            <VideoPage />
          </MainLayout>
        } />

        <Route path="/upload" element={
          <MainLayout>
            <UploadVideo />
          </MainLayout>
        } />

        <Route path="/mychannel" element={
          <MainLayout>
            <Mychannel />
          </MainLayout>
        } />

        <Route path="/channel/:userId" element={
          <MainLayout>
            <Channelpage />
          </MainLayout>
        } />

        <Route path="/myprofile" element={
          <MainLayout>
            <MyProfile />
          </MainLayout>
        } />

        <Route path="/explore/trending" element={<MainLayout><div>Trending Page</div></MainLayout>} />
        <Route path="/explore/music" element={<MainLayout><div>Music Page</div></MainLayout>} />
        <Route path="/explore/gaming" element={<MainLayout><div>Gaming Page</div></MainLayout>} />
        <Route path="/explore/news" element={<MainLayout><div>News Page</div></MainLayout>} />

      </Routes>

    </BrowserRouter>
  )
}

export default App
