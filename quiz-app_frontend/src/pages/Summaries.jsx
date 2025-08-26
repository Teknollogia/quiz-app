import { useEffect, useState } from "react";

export default function Summaries() {
    const [summaries, setSummaries] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/quizzes/summaries")
            .then((res) => res.json())
            .then((data) => setSummaries(data));
    }, []);

    return (
        <div id="summaries">
            <h2>Quiz summaries</h2>
            {
                summaries.length > 0 ? (
                    <ul>
                        {summaries.map((summary) => (
                            <li key={summary.id}>
                                <p>Quiz ID: {summary.quiz_id}</p>
                                <p>User_ID: {summary.user_id}</p>
                                <p>Correct Answers Rate: {summary.correct_answers_rate}%</p>
                                <p>Skipped Answers Rate: {summary.skipped_answers_rate}%</p>
                                <p>Wrong Answers Rate: {summary.wrong_answers_rate}%</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No summaries available.</p>
                )
            }
        </div>
    );
}