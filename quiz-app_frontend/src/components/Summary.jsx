import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import quizCompleteImg from "../assets/quiz-complete.png";

export default function Summary({ userAnswers }) {
  const [questions, setQuestions] = useState([]);
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
            <li key={index}>
              <h3>{index + 1}</h3>
              <p className="question">{question?.question_text}</p>
              <p className={cssClass}>{userAnswerText ?? "Skipped"}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
