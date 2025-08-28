import LoginForm from "../components/LoginForm";

export default function Login({ onLogin }) {

  return (
    <div className="login-container">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <LoginForm onLogin={onLogin} />
    </div>
  );
}