import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Pombos from "./pages/Pombos";
import Pedigree from "./pages/Pedigree";
import Saude from "./pages/Saude";
import Competicoes from "./pages/Competicoes";
import Acasalamentos from "./pages/Acasalamentos";
import Toaster from "./components/Toaster";
import "./App.css";

function IconHome() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}
function IconPigeon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/>
      <line x1="16" y1="8" x2="2" y2="22"/>
      <line x1="17.5" y1="15" x2="9" y2="15"/>
    </svg>
  );
}
function IconTree() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}
function IconHeart() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}
function IconTrophy() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 0 0 5H6"/>
      <path d="M18 9h1.5a2.5 2.5 0 0 1 0 5H18"/>
      <path d="M4 22h16"/>
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
    </svg>
  );
}
function IconUsers() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}
function IconSun() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}
function IconMoon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

export default function App() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    return (localStorage.getItem("fth-theme") as "dark" | "light") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("fth-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <BrowserRouter>
      <div className="app-layout">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <span className="logo-fly">Fly</span>
            <span className="logo-to"> to </span>
            <span className="logo-home">Home</span>
          </div>
          <nav className="sidebar-nav">
            <NavLink to="/" end className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <span className="nav-icon"><IconHome /></span><span>Dashboard</span>
            </NavLink>
            <NavLink to="/pombos" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <span className="nav-icon"><IconPigeon /></span><span>Pombos</span>
            </NavLink>
            <NavLink to="/pedigree" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <span className="nav-icon"><IconTree /></span><span>Pedigree</span>
            </NavLink>
            <NavLink to="/saude" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <span className="nav-icon"><IconHeart /></span><span>Saúde</span>
            </NavLink>
            <NavLink to="/competicoes" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <span className="nav-icon"><IconTrophy /></span><span>Competições</span>
            </NavLink>
            <NavLink to="/acasalamentos" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <span className="nav-icon"><IconUsers /></span><span>Acasalamentos</span>
            </NavLink>
          </nav>

          <div className="sidebar-footer">
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === "dark" ? <IconSun /> : <IconMoon />}
              <span>{theme === "dark" ? "Modo Claro" : "Modo Escuro"}</span>
            </button>
          </div>
        </aside>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pombos/*" element={<Pombos />} />
            <Route path="/pedigree" element={<Pedigree />} />
            <Route path="/saude" element={<Saude />} />
            <Route path="/competicoes/*" element={<Competicoes />} />
            <Route path="/acasalamentos" element={<Acasalamentos />} />
          </Routes>
        </main>
      </div>
      <Toaster />
    </BrowserRouter>
  );
}
