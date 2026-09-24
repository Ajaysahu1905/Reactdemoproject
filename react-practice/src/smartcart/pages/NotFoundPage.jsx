import { useNavigate } from "react-router-dom";
import "../styles/NotFoundPage.css";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <h1>404</h1>
      <p>Oops! The page you are looking for does not exist.</p>
      <button onClick={() => navigate("/")}>Go to Home</button>
    </div>
  );
}

export default NotFoundPage;
