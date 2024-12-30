import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./Home_login";
import RegistroPage from "./Registro";
import useControl from "../../hooks/useControl";
import {Dashboard} from "./Dashboard";
export const Router_Home = () => {
  const { isLoggedIn } = useControl();

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Contenido principal */}
        <main className="flex-grow">
          <Routes>
            {/* Si está logueado, redirige al Dashboard */}
            <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <HomePage />} />
            <Route path="/registro" element={<RegistroPage />} />
            {/* Ruta para el dashboard o página para usuarios logueados */}
            <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};
