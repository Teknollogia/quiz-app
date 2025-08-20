import { useState } from "react";

export default function CreateQuiz() {
  const [questions, setQuestions] = useState([
    { text: "", answers: ["", "", "", ""], correctIndex: 0 },
  ]);

  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [createdBy, setCreatedBy] = useState("");

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].text = value;
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (qIndex, aIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answers[aIndex] = value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (qIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctIndex = parseInt(value);
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { text: "", answers: ["", "", "", ""], correctIndex: 0 }]);
  };

  const handleSubmit = async () => {
    setMessage("");

    const token = localStorage.getItem("token");

    const payload = {
        title: title.trim(),
        created_by: 1,   //PAY ATTENTION: created_by in QuizResponse model is integer (createdBy.trim())
        questions: questions.map((q) => ({
          question_text: q.text,
          answers: q.answers.map((a) => ({ answer_text: a }))
        }))
    };

    try {
        const res = await fetch("http://localhost:8000/quizzes/createQuiz", {
            method: 'POST',
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify(payload),
        });

        const data = await res.json();
        if(!res.ok) {
            throw new Error(data.detail || "Failed to post quiz")
        }
        setMessage("Quiz posted successfully!");
    } catch(err) {
        setMessage(err.message);
    }
  };

  return (
    <div>
      <h2>Create Quiz</h2>
      <input 
        placeholder="Quiz Title" 
        value = {title} 
        onChange={(e) => setTitle(e.target.value)} 
      /> 
      <input
        placeholder="Created By"
        value={createdBy}
        onChange={(e) => setCreatedBy(e.target.value)}
      />

      {questions.map((q, qIndex) => (
        <div key={qIndex}>
          <input
            placeholder="Question text"
            value={q.text}
            onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
          />
          {q.answers.map((a, aIndex) => (
            <input
              key={aIndex}
              placeholder={`Answer ${aIndex + 1}`}
              value={a}
              onChange={(e) => handleAnswerChange(qIndex, aIndex, e.target.value)}
            />
          ))}
          <select
            value={q.correctIndex}
            onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)}
          >
            {q.answers.map((_, i) => (
              <option key={i} value={i}>{`Correct answer ${i + 1}`}</option>
            ))}
          </select>
        </div>
      ))}
      <button onClick={addQuestion}>Add Question</button>
      <button onClick={handleSubmit}>Submit Quiz</button>
      {message && <p>{message}</p>}
    </div>
  );
}
