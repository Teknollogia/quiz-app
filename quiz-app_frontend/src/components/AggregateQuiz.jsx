import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AggregateQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await fetch("http://localhost:8000/quizzes/quizzes");
        if (!res.ok) {
          throw new Error("Failed to fetch quizzes");
        }
        const data = await res.json();
        setQuizzes(data);
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleStartQuiz = (quizId) => {
    navigate(`/quizzes/quizzes/${quizId}`);
  };

  return (
    <div id="aggregated-quiz">
      <h1>Available Quizzes</h1>

      {loading && <p>Loading quizzes...</p>}
      {message && <p className="error">{message}</p>}

      {!loading && quizzes.length === 0 && !message && (
        <p>No quizzes available.</p>
      )}

      {!loading && quizzes.length > 0 && (
        <ol>
          {quizzes.map((quiz) => (
            <li key={quiz.id}>
              <h2>{quiz.title}</h2>
              <button onClick={() => handleStartQuiz(quiz.id)}>
                Start Quiz
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
