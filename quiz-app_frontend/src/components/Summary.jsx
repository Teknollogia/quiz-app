import { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import quizCompleteImg from "../assets/quiz-complete.png";

export default function Summary({ userAnswers }) {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  const { quizId } = useParams();

  useEffect(() => {
    fetch(`http://localhost:8000/quizzes/quizzes/${quizId}`)
      .then((res) => res.json())
      .then((data) => setQuestions(data.questions));
  }, [quizId]);


  if (questions.length === 0 || userAnswers.length === 0) {
    return <p>Loading summary...</p>;
  }

  const skippedAnswers = userAnswers.filter((answer) => answer === null);

  const correctAnswers = userAnswers.filter((answer, index) => {
    const question = questions[index];
    if (!question) return false;

    const correctOption = question.answers.find((ans) => ans.is_correct);

    const userAnswerText =
      typeof answer === "string" ? answer : answer?.answer_text;

    return userAnswerText === correctOption?.answer_text;
  });

  const skippedAnswersShare = Math.round(
    (skippedAnswers.length / userAnswers.length) * 100
  );
  const correctAnswersShare = Math.round(
    (correctAnswers.length / userAnswers.length) * 100
  );
  const incorrectAnswersShare =
    100 - skippedAnswersShare - correctAnswersShare;

  const handlePostResults = () => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (!token || !username) {
      console.error("User not logged in");
      return;
    }

    const payload = {
      correct_answers_rate: correctAnswersShare,
      skipped_answers_rate: skippedAnswersShare,
      wrong_answers_rate: incorrectAnswersShare,
    };
    
    console.log("Posting results:", payload);

    fetch(`http://localhost:8000/quizzes/submitQuiz/${quizId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to post results");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Results posted successfully:", data);
      })
      .catch((err) => {
        console.error(err);
      });
      navigate("/");
  }

  return (
    <div id="summary">
      <img src={quizCompleteImg} />
      <h2>Quiz completed!</h2>

      <div id="summary-stats">
        <p>
          <span className="number"> {skippedAnswersShare} </span>
          <span className="text"> % skipped</span>
        </p>
        <p>
          <span className="number"> {correctAnswersShare} </span>
          <span className="text"> % answered correctly</span>
        </p>
        <p>
          <span className="number"> {incorrectAnswersShare} </span>
          <span className="text"> % answered incorrectly </span>
        </p>
      </div>

      <ol>
        {userAnswers.map((answer, index) => {
          const question = questions[index];
          const correctOption = question?.answers?.find((ans) => ans.is_correct);

          const userAnswerText =
            typeof answer === "string" ? answer : answer?.answer_text;

          let cssClass = "user-answer";
          if (answer === null) {
            cssClass += " skipped";
          } else if (userAnswerText === correctOption?.answer_text) {
            cssClass += " correct";
          } else {
            cssClass += " wrong";
          }

          return (
            <Fragment key={index}>
              <li key={index}>
                <h3>{index + 1}</h3>
                <p className="question">{question?.question_text}</p>
                <p className={cssClass}>{userAnswerText ?? "Skipped"}</p>
              </li>
            </Fragment> 
          );
        })}
      </ol>
      <button onClick={handlePostResults}>Quiz Final</button>
    </div>
  );
}
