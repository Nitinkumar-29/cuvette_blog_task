import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import Home from "./pages/Home";
import PostDetails from "./components/PostDetails";
import Login from "./authentication/Login";
import Signup from "./authentication/Signup";
import CreatePost from "./components/CreatePost";
import UserProfile from "./pages/UserProfile";
import { AuthProvider } from "./context/AuthContext";


function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route exact path="/" element={<Main />}>
            <Route path="/" element={<Home />} />
            <Route path="/posts/:id" element={<PostDetails />} />
            <Route path="/createPost" element={<CreatePost />} />
            <Route path="/profile/:id" element={<UserProfile />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
