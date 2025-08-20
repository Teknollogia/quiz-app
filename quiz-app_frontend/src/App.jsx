import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CreateQuiz from "./components/CreateQuiz";
import AggregateQuiz from "./components/AggregateQuiz";
import Quiz from "./components/Quiz";

import {
  useLocation,
  useNavigate,
  Routes,
  Route,
  Link
} from "react-router-dom";
import { useEffect, useState } from "react";

const GOOGLE_AUTH_URL = "http://localhost:8000/auth/google/login";

function OAuthCallbackHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    console.log("OAuthCallbackHandler token:", token);

    if (token) {
      localStorage.setItem("token", token);
      navigate("/");
    } else {
      console.error("Google login failed or no token found.");
      navigate("/login");
    }
  }, [location, navigate]);

  return <p>Logging in with Google...</p>;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleOpen = () => {
    if (!isLoggedIn) {
      alert("Please log in!");
      window.location.href = "/login";
    }
  };

  return (
    <div className="p-6 font-sans">
      <div className="mt-16" />
      <nav className="space-x-4 mb-6">
        <Link onClick={handleOpen} to="/" className="text-blue-600 hover:underline">
          Home
        </Link>
        &nbsp; &nbsp;
        <Link to="/register" className="text-blue-600 hover:underline">
          Register
        </Link>
        &nbsp; &nbsp;
        <Link to="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
        &nbsp; &nbsp;
        <button
          onClick={() => (window.location.href = GOOGLE_AUTH_URL)}
          className="text-white bg-black px-3 py-1 rounded hover:bg-gray-800 ml-4"
        >
          Login with Google
        </button>
        {isLoggedIn && (
          <button
            onClick={() => {
              localStorage.removeItem("token");
              setIsLoggedIn(false);
              window.location.href = "/login";
            }}
          >
            Log Out
          </button>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onLogin={handleLogin} />} />

        {/* Quiz routes */}
        <Route path="/quizzes/quizzes" element={<AggregateQuiz />} />
        <Route path="/quizzes/quizzes/:quizId" element={<Quiz />} />
        <Route path="/quizzes/createQuiz" element={<CreateQuiz />} />

        {/* OAuth callback */}
        <Route path="/auth/callback" element={<OAuthCallbackHandler />} />
      </Routes>
    </div>
  );
}

export default App;
