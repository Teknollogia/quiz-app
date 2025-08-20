import {useState, useEffect} from 'react'
import Header from '../components/Header.jsx'
import AggregateQuiz from '../components/AggregateQuiz.jsx';
import CreateQuiz from '../components/CreateQuiz.jsx';

export default function Home() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem("token");
      if (!token) {
        setUserRole(null);
        return;
      }

      const response = await fetch("http://localhost:8000/users/me", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const user = await response.json();
        setUserRole(user.role);
      } else {
        setUserRole(null);
      }
    }
    fetchUser();
  }, []);

  if (userRole === null) {
    return <div>Loading...</div>
  }

  return (
    <>
       <Header />
       <main>
         { userRole === 'student' ? <AggregateQuiz /> : <CreateQuiz />}
       </main>
     </>
  );
}