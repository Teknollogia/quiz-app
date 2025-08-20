import { useEffect, useState } from "react";

import quizCompleteImg from "../assets/quiz-complete.png";
//import QUESTIONS from "../questions.js";

export default function Summary({ userAnswers }) {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/questions")
    .then((res) => res.json())
    .then((data) => {
      setQuestions(data)
    });
  }, []);

  if(questions.length === 0 || userAnswers.length === 0) {
    return <p>Loading summary...</p>
  }

  const skippedAnswers = userAnswers.filter((answer) => answer === null);
  const correctAnswers = userAnswers.filter(
    (answer, index) => 
      questions[index] &&
      questions[index].answers &&
      answer === questions[index].answers[0].answer_text
  );

  const skippedAnswersShare = Math.round(
    (skippedAnswers.length / userAnswers.length) * 100
  );
  const correctAnswersShare = Math.round(
    (correctAnswers.length / userAnswers.length) * 100
  );
  const incorrectAnswersShare = 100 - skippedAnswersShare - correctAnswersShare;

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
          <span className="number"> {incorrectAnswersShare}</span>
          <span className="text"> % answered incorrectly </span>
        </p>
      </div>
      <ol>
        {userAnswers.map((answer, index) => {
          let cssClass = "user-answer";
          if (answer === null) {
            cssClass += " skipped";
          } else {
            if (answer === questions[index].answers[0]) {
              cssClass += " correct";
            } else {
              cssClass += " wrong";
            }
          }
          return (
            <li key={answer}>
              <h3>{index + 1}</h3>
              <p className="question">{questions[index].question_text}</p>
              <p className={cssClass}> {answer ?? "Skipped"}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}