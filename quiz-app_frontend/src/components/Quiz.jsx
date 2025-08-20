import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";

//import QUESTIONS from "../questions.js";
import Question from "./Question.jsx";
import Summary from "./Summary.jsx";

export default function Quiz() {
  const [userAnswers, setUserAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { quizId } = useParams();

  const activeQuestionIndex = userAnswers.length;

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`http://localhost:8000/quizzes/quizzes/${quizId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch quiz");
        }
        const data = await res.json();
        setQuestions(data.questions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchQuiz();
  }, [quizId])


  const quizIsComplete = activeQuestionIndex === questions.length;

  const handleSelectAnswer = useCallback(function handleSelectAnswer(
    selectedAnswer
  ) {
    setUserAnswers((prevUserAnswers) => {
      return [...prevUserAnswers, selectedAnswer];
    });
  },
  []);

  const handleSkipAnswer = useCallback(() => {
    handleSelectAnswer(null);
  }, [handleSelectAnswer]);

  if (quizIsComplete) {
    return <Summary userAnswers={userAnswers} />;
  }

  return (
    <div id="quiz">
      {questions.length > 0 ? (
      <Question
        key={activeQuestionIndex}
        index={activeQuestionIndex}
        question = {questions[activeQuestionIndex]}
        onSelectAnswer={handleSelectAnswer}
        onSkipAnswer={handleSkipAnswer}
      />
      ) : (
        <p>No questions found for this quiz...</p>
      )}
    </div>
  );
}
