import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {Formulario_Login} from '../Login/Formularios/Formulario_Login'
import {FooterLogin} from '../Login/Formularios/FooterLogin'
import logo from '../../img/LOGO.png'
const HomePage = () => {
  const navigate = useNavigate();

 
  return (
    <div className="w-full h-screen  flex items-center justify-center bg-gray-100">
      <div className="w-11/12 2xl:max-w-[90rem] h-auto md:h-5/6  2xl:h-4/6 flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Sección de imagen y texto */}
        <div className="p-6 md:p-0 w-full md:w-2/5 bg-[#1c264a] flex flex-col items-center justify-center relative">
         
          <img
            src={logo} 
            alt="Transportes EOM"
            className="z-10 w-40 h-40 md:w-48 md:h-48 object-contain"
          />
         
         <h1 className="text-white text-center text-xl md:text-2xl ">
            Bienvenido a Transportes EOM
          </h1>
        </div>

        {/* Sección de inicio de sesion */}
        <div className="w-full md:w-3/5 p-8 flex flex-col justify-center items-center ">
          <h2 className="text-2xl xl:text-6xl font-bold text-gray-800 mb-6">Iniciar Sesión</h2>
          <Formulario_Login />
          <FooterLogin />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
