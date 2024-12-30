import React from "react";
import { useNavigate } from "react-router-dom";
import { FormularioRegistro } from "../Login/Formularios/Formulario_registro";
import { FooterLogin } from "../Login/Formularios/FooterLogin";
import logo from "../../img/LOGO.png";

const RegistroPage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      {/* Contenedor principal */}
      <div className="w-11/12 max-w-3xl bg-[#1c264a] rounded-xl shadow-lg p-8 flex flex-col items-center">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={logo}
            alt="Transportes EOM"
            className="w-32 h-32 md:w-40 md:h-40 object-contain"
          />
        
        </div>

        {/* Título de registro */}
        <h2 className="text-4xl md:text-4xl font-bold text-white mb-6">
          Registro
        </h2>

        {/* Formulario de registro */}
        <FormularioRegistro />

        {/* Footer */}
        <FooterLogin />
      </div>
    </div>
  );
};

export default RegistroPage;
