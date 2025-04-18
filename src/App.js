
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import EditorPage from './pages/editorpages'
import { Toaster } from 'react-hot-toast';
import './App.css';
import Chatbot from './components/chatbot';

function App() {
  return (
    <>
     <Toaster position="top-right" reverseOrder={true} />
      <BrowserRouter>
        <Routes>
          <Route path="/editor/:roomId" element={<EditorPage />}></Route>
          <Route path="/" element={<Home />}></Route>
        </Routes>
      </BrowserRouter>
      <Chatbot />
    </>
  );
}

export default App;
