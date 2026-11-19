import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HomePage from "./pages/HomePage";
import QuestionDetail from "./pages/QuestionDetail";
import Submissions from "./pages/Submissions";
import Questions from "./pages/Questions";
import ProtectedRoute from "./routes/ProtectedRoutes";
import Navbar from "./components/Navbar";
import SubmissionDetails from "./pages/SubmissionDetails";
import NewsArticle from "./pages/NewsArticle";
import toast, { Toaster } from 'react-hot-toast';
import Playground from "./pages/Playground";

const App = () => {
  return (
    <>
      <Toaster/>
      <Navbar/>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/questions"
          element={
            <ProtectedRoute>
              <Questions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/questions/:id"
          element={
            <ProtectedRoute>
              <QuestionDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/submissions"
          element={
            <ProtectedRoute>
              <Submissions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/submissions/:id"
          element={
            <ProtectedRoute>
              <SubmissionDetails/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/getnews"
          element={
            <ProtectedRoute>
              <NewsArticle/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/playground"
          element={
            <ProtectedRoute>
              <Playground/>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
