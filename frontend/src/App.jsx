import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Library from "./pages/Library";
import CharacterProfile from "./pages/CharacterProfile";
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-void text-paper">
        <Header />
        <Routes>
          <Route path="/" element={<Library />} />
          <Route path="/characters/:id" element={<CharacterProfile />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
