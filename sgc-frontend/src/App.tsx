import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Pombos from "./pages/Pombos";
import Pedigree from "./pages/Pedigree";
import Saude from "./pages/Saude";
import Competicoes from "./pages/Competicoes";
import Acasalamentos from "./pages/Acasalamentos";
import "./App.css";

function IconHome() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}
function IconPigeon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/>
    </svg>
  );
}
function IconTree() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
    </svg>
  );
}
function IconHeart() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}
function IconTrophy() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="14 9 14 2 10 2 10 9"/><path d="M17.09 3H7.91L6 21h12L16.09 3z"/><path d="M4 21h16"/>
    </svg>
  );
}
function IconUsers() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

export default function App() {
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
    </BrowserRouter>
  );
}
