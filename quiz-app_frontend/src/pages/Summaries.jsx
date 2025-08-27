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
                    <table>
                        <thead>
                            <tr>
                                <th>Quiz ID</th>
                                <th>User ID</th>
                                <th>Correct Answers Rate</th>
                                <th>Skipped Answers Rate</th>
                                <th>Wrong Answers Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {summaries.map((summary) => (
                                <tr key={summary.id}>
                                    <td>{summary.quiz_id}</td>
                                    <td>{summary.user_id}</td>
                                    <td>{summary.correct_answers_rate}%</td>
                                    <td>{summary.skipped_answers_rate}%</td>
                                    <td>{summary.wrong_answers_rate}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No summaries available.</p>
                )
            }
        </div>
    );
}