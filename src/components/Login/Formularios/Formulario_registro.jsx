import React, { useState, useRef, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import useControl from "../../../hooks/useControl";
import { useNavigate } from "react-router-dom";
import { Divider } from "primereact/divider";
import { InputSwitch } from "primereact/inputswitch";

export const FormularioRegistro = () => {
  const navigate = useNavigate();

  const { registro, loadingRegistro, vistaLog, setVistaLog, isLoggedIn } =
    useControl();
  useEffect(() => {
    if (vistaLog === 1) {
      setVistaLog(2);
    }
  }, []);
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn]);

  const toast = useRef(null);
  //se inicia el objeto vacio del usuario
  const [usuario, setUsuario] = useState({
    nombres: "",
    apellidos: "",
    correo: "",
    contrasena: "",
    confirmarContrasena: "",
    terms_accepted: false,
  });
  //Errores en el formulario
  const [errores, setErrores] = useState({
    nombres: "",
    apellidos: "",
    correo: "",
    contrasena: "",
    confirmarContrasena: "",
    terms_accepted: "",
  });

  //Funcion para manejar los cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prevUsuario) => ({
      ...prevUsuario,
      [name]: value,
    }));
    setErrores((prevErrores) => ({
      ...prevErrores,
      [name]: "", // Limpiar el error al cambiar el valor del campo
    }));
  };
//Funcion para manejar el envio del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    registro(usuario);
  };
//Funcion para validar el formulario
  const validarFormulario = () => {
    let valid = true;
    let nuevosErrores = {};

    // Validamos nombres y apellidos solo con letras y  para evitar ataques
    const regexNombres = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
    if (!regexNombres.test(usuario.nombres)) {
      nuevosErrores.nombres = "Los nombres solo deben contener letras.";
      valid = false;
    }
    if (!regexNombres.test(usuario.apellidos)) {
      nuevosErrores.apellidos = "Los apellidos solo deben contener letras.";
      valid = false;
    }

    // Validar formato de correo electrónico
    const regexCorreo = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!regexCorreo.test(usuario.correo)) {
      nuevosErrores.correo = "Por favor, ingrese un correo electrónico válido.";
      valid = false;
    }
    if (!usuario.terms_accepted) {
      nuevosErrores.terms_accepted = "Debe aceptar los términos y condiciones.";
      valid = false;
    }

    // Validar que las contraseñas coincidan
    if (usuario.contrasena !== usuario.confirmarContrasena) {
      nuevosErrores.contrasena = "Las contraseñas no coinciden.";
      nuevosErrores.confirmarContrasena = "Las contraseñas no coinciden.";
      valid = false;
    }

    // Validar campos vacíos
    Object.keys(usuario).forEach((campo) => {
      if (!usuario[campo]) {
        nuevosErrores[campo] = "Este campo es obligatorio.";
        valid = false;
      }
    });

    // Validar caracteres especiales peligrosos
    const regexCaracteresPeligrosos = /[$<>{}()'"`;%]/;
    if (
      regexCaracteresPeligrosos.test(usuario.nombres) ||
      regexCaracteresPeligrosos.test(usuario.apellidos)
    ) {
      showError(
        `No se permiten caracteres especiales como: <>{}()'";% en ningun campo.`
      );
      return false;
    }

    setErrores(nuevosErrores);
    return valid;
  };
//Funcion para mostrar errores
  const showError = (mensaje) => {
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: mensaje,
      life: 3000,
    });
  };
  
  //Footer de la contraseña
  const footer = (
    <>
      <Divider />
      <p className="mt-2">Requisitos</p>
      <ul className="pl-2 ml-2 mt-0 line-height-3">
        <li>Al menos una letra minúscula</li>
        <li>Al menos una letra mayúscula</li>
        <li>Al menos un caracter especial</li>
        <li>Al menos un número</li>
        <li>Un mínimo de 8 caracteres</li>
      </ul>
    </>
  );

  return (
    <div className="card flex flex-col justify-center items-center  w-full p-4 rounded-lg">
      <Toast ref={toast} />
      <form
        onSubmit={handleSubmit}
        className="grid  grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-lg"
      >
        {/* Nombres */}
        <div className="col-span-2 md:col-span-1">
          <FloatLabel>
            <InputText
              autoComplete="given-name"
              id="nombres"
              name="nombres"
              value={usuario.nombres}
              onChange={handleInputChange}
              keyfilter={/[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+/}
              style={{ width: "100%" }}
            />
            <label htmlFor="nombres">Nombres</label>
          </FloatLabel>
          {errores.nombres && (
            <small className="p-error">{errores.nombres}</small>
          )}
        </div>

        {/* Apellidos */}
        <div className="col-span-2 md:col-span-1">
          <FloatLabel>
            <InputText
              autoComplete="family-name"
              id="apellidos"
              name="apellidos"
              value={usuario.apellidos}
              onChange={handleInputChange}
              keyfilter={/[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+/}
              style={{ width: "100%" }}
            />
            <label htmlFor="apellidos">Apellidos</label>
          </FloatLabel>
          {errores.apellidos && (
            <small className="p-error">{errores.apellidos}</small>
          )}
        </div>

        {/* Correo Electrónico */}
        <div className="col-span-2">
          <FloatLabel>
            <InputText
              readonly
              onfocus="this.removeAttribute('readonly');"
              autoComplete="email"
              type="email"
              id="correo"
              name="correo"
              value={usuario.correo}
              onChange={handleInputChange}
              style={{ width: "100%" }}
            />
            <label htmlFor="email">Correo Electrónico</label>
          </FloatLabel>
          {errores.correo && (
            <small className="p-error">{errores.correo}</small>
          )}
        </div>

        {/* Contraseña */}
        <div className="col-span-2 md:col-span-1">
          <FloatLabel>
            <Password
              readonly
              onfocus="this.removeAttribute('readonly');"
              autoComplete="off"
              inputId="contrasena"
              name="contrasena"
              value={usuario.contrasena}
              onChange={handleInputChange}
              toggleMask
              className="contraseña-input "
              footer={footer}
            />
            <label htmlFor="contrasena">Contraseña</label>
          </FloatLabel>
          {errores.contrasena && (
            <small className="p-error">{errores.contrasena}</small>
          )}
        </div>

        {/* Confirmar Contraseña */}
        <div className="col-span-2 md:col-span-1">
          <FloatLabel>
            <Password
              readonly
              onfocus="this.removeAttribute('readonly');"
              autoComplete="off"
              inputId="confirmarContrasena"
              name="confirmarContrasena"
              value={usuario.confirmarContrasena}
              onChange={handleInputChange}
              className="contraseña-input"
              toggleMask
            />
            <label htmlFor="confirmarContrasena">Confirmar Contraseña</label>
          </FloatLabel>
          {errores.confirmarContrasena && (
            <small className="p-error min-w-full">
              {errores.confirmarContrasena}
            </small>
          )}
        </div>
        <div className="card col-span-2  flex justify-content-center">
          <div className="flex items-center gap-2">
            <InputSwitch
              id="terms_accepted"
              name="terms_accepted"
              checked={usuario.terms_accepted}
              onChange={handleInputChange}
            />

            <label htmlFor="terms_accepted" className="text-gray-100">
              Acepto los
              <span
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-100 mx-1"
                onClick={() => {
                  navigate("/terminos_y_condiciones");
                }}
              >
                términos y condiciones
              </span>
            </label>
          </div>
        </div>
        {errores.terms_accepted && (
          <small className="p-error min-w-full">{errores.terms_accepted}</small>
        )}
        {/* Botón de Registro */}
        <div className=" md:col-span-2 flex justify-center mt-4">
          <Button
            loading={loadingRegistro}
            type="submit"
            label="Registrarse"
            className="w-full focus:outline-none focus:ring-4 focus:ring-orange-300 focus:border-orange-500 bg-[#ff7d44] border-[#ff7d44] focus:bg-[#ff7d44] active:border hover:bg-orange-600 hover:border-orange-600 "
          />
        </div>
      </form>
    </div>
  );
};
