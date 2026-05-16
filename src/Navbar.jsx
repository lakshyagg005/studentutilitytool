import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const goHome = (e) => {
    e.preventDefault();
    if (isHome) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  const goTools = (e) => {
    e.preventDefault();
    if (isHome) {
      document.getElementById("tools-nav")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate("/#tools");
    }
  };

  return (
    <header>
      <nav className="navbar" role="navigation" aria-label="Main navigation">
        <a className="navbar-logo" href="/" onClick={goHome}>
          <span className="navbar-logo-dot" />
          Filter<span>o</span>
        </a>
        <ul className="navbar-links">
          <li>
            <a href="/#tools" onClick={goTools}>
              Tools
            </a>
          </li>
          <li>
            <Link to="/#why" onClick={(e) => {
              e.preventDefault();
              if (isHome) {
                document.getElementById("why")?.scrollIntoView({ behavior: "smooth", block: "start" });
              } else {
                navigate("/");
              }
            }}>
              Why Filtero
            </Link>
          </li>
          <li>
            <a className="navbar-cta" href="/" onClick={goHome}>
              All Tools →
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
