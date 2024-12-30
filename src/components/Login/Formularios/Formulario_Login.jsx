import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import useControl from "../../../hooks/useControl";
export const Formulario_Login = () => {
  const { login, loadingLogin } = useControl();
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [errores, setErrores] = useState({ correo: "", contraseña: "" });

  const validarCorreo = (email) => {
    const regexCorreo = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regexCorreo.test(email);
  };

  const handleCorreoChange = (e) => {
    const value = e.target.value;
    setUsuario(value);

    if (!validarCorreo(value)) {
      setErrores((prev) => ({
        ...prev,
        correo: "Ingrese un correo electrónico válido.",
      }));
    } else {
      setErrores((prev) => ({ ...prev, correo: "" }));
    }
  };

  const handleContraseñaChange = (e) => {
    const value = e.target.value;
    setContraseña(value);

    // Validación de caracteres especiales en la contraseña
    const regexCaracteresEspeciales = /[$<>{}()'"`;%]/;
    if (regexCaracteresEspeciales.test(value)) {
      setErrores((prev) => ({
        ...prev,
        contraseña: "La contraseña no puede contener caracteres especiales.",
      }));
    } else {
      setErrores((prev) => ({ ...prev, contraseña: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let hayErrores = false;
    // Validación adicional antes de enviar el formulario
    if (!usuario || !validarCorreo(usuario)) {
      setErrores((prev) => ({
        ...prev,
        correo: "Ingrese un correo electrónico válido.",
      }));
      hayErrores = true;
    }

    if (!contraseña) {
      setErrores((prev) => ({
        ...prev,
        contraseña: "La contraseña es obligatoria.",
      }));
      hayErrores = true;
    }

    if (errores.correo || errores.contraseña  || hayErrores) {
      return; // No enviar el formulario si hay errores
    }
    login(usuario, contraseña);
  };

  return (
    <div className="flex flex-col justify-center items-center w-full  rounded-lg">
      <form onSubmit={handleSubmit} className="w-full">
        {/* Campo de Correo Electrónico */}
        <div className=" flex flex-col items-center">
          <FloatLabel>
            <InputText
              id="username"
              className="min-w-[19rem] md:min-w-[17.5rem]"
              value={usuario}
              onChange={handleCorreoChange}
            />
            <label className="w-full" htmlFor="username">
              Correo electrónico
            </label>
          </FloatLabel>
          {errores.correo && (
            <small className="p-error ">{errores.correo}</small>
          )}
        </div>

        {/* Campo de Contraseña */}
        <div className=" flex flex-col items-center mt-5">
          <FloatLabel>
            <Password
              inputId="password"
              value={contraseña}
              onChange={handleContraseñaChange}
              feedback={false}
              keyfilter={/[^$<>{}()'"`;%]/} // No permite caracteres especiales
              toggleMask
            />
            <label htmlFor="password">Contraseña</label>
          </FloatLabel>
          {errores.contraseña && (
            <small className="p-error">{errores.contraseña}</small>
          )}
        </div>

        {/* Botón de Enviar */}
        <div className="flex justify-center">
          <Button
            loading={loadingLogin}
            label="Iniciar Sesión"
            className="mt-3 focus:outline-none focus:ring-4 focus:ring-orange-300 focus:border-orange-500 bg-[#ff7d44] border-[#ff7d44] focus:bg-[#ff7d44] active:border hover:bg-orange-600 hover:border-orange-600 "
            type="submit"
          />
        </div>
      </form>
    </div>
  );
};
