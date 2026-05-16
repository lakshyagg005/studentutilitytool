import { Link } from "react-router-dom";
import { TOOLS } from "./toolsData";

export default function Footer() {
  return (
    <footer>
      <Link to="/" className="footer-logo" style={{ textDecoration: "none" }}>
        Filter<span>o</span>
      </Link>
      <div className="footer-links">
        <Link to="/">Home</Link>
        {TOOLS.slice(0, 5).map((t) => (
          <Link key={t.id} to={t.path}>
            {t.shortName}
          </Link>
        ))}
      </div>
      <p>
        © {new Date().getFullYear()} <strong>Filtero</strong> · Free student
        utility platform · Made with ♥ for learners everywhere
      </p>
    </footer>
  );
}
