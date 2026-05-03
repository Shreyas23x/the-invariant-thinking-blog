import { Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import CSProjects from "./pages/CSProjects";
import MathOlympiad from "./pages/MathOlympiad";
import NBAAnalysis from "./pages/NBAAnalysis";
import BlogIndex from "./pages/BlogIndex";
import BlogPost from "./pages/BlogPost";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/cs-projects" element={<CSProjects />} />
      <Route path="/math" element={<MathOlympiad />} />
      <Route path="/math-olympiad" element={<Navigate to="/math" replace />} />
      <Route path="/nba-analysis" element={<NBAAnalysis />} />
      <Route path="/blog" element={<BlogIndex />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
