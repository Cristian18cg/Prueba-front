import { useState, createContext, useMemo, useCallback } from "react";
import clienteAxios from "../../config/url";
import Swal from "sweetalert2";

const ContextControl = createContext();

const LoginProvider = ({ children }) => {
  const [vistaLog, setVistaLog] = useState(1);

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [jsonlogin, setJsonlogin] = useState({});
  const [usuario, setUsuario] = useState("");
  const [admin, setAdmin] = useState(false);
  const [dataadicional, setdataadicional] = useState({});
  const [token, setToken] = useState(null);
  const [refresh_token, setrefresh_Token] = useState("");
  const [loadingRegistro, setloadingRegistro] = useState(false);
  const [loadingLogin, setloadingLogin] = useState(false);
  const [user, setUser] = useState(null);
//mensaje exito
  const showSuccess = (mensaje) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      background: "#f3f2e8",
      color: "black",
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "success",
      title: mensaje ? mensaje : "",
      buttonsStyling: false,
    });
  };
  //mensaje error
  const showError = (error) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 5000,
      background: "#f3f2e8f1",
      color: "black",
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "error",
      title: error ? error : "¡Ha ocurrido un error!",
      buttonsStyling: false,
    });
  };  //Funcion protected
  const refreshAccessToken = async () => {
    try {
      const response = await clienteAxios.post("users/token/refresh/", {
        refresh: refresh_token,
      });
      setToken(response.data.access);
      return response.data.access;
    } catch (error) {
      console.error("Error al refrescar el token:", error);
      throw error;
    }
  };
  const vistaprotected = useCallback(async (Token) => {
    try {
      setloadingLogin(true);
      const currentToken = token || (await refreshAccessToken());
      const response = await clienteAxios.get("users/protected/", {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });
  
      if (response.status === 200) {
        const dataLogin = response.data;
  
        // Actualizar estado con datos del usuario
        setJsonlogin(dataLogin);
        setAdmin(dataLogin.is_superuser);
       /*  setLoggedIn(true); */
  
        // Nombre del usuario (con fallback)
        const usuarioNombre = `${dataLogin?.first_name} ${dataLogin?.last_name}`.trim() || "usuario";
        setUsuario(usuarioNombre);
  
        // Mostrar mensaje de bienvenida
        showSuccess(`¡Bienvenido, ${usuarioNombre}!`);
  
        // Manejar tokens (si los envía el endpoint protegido, aunque normalmente no deberían)
        if (dataLogin.access) setToken(dataLogin.access);
        if (dataLogin.refresh) setrefresh_Token(dataLogin.refresh);
      } else {
        Swal.fire({
          icon: "error",
          title: "Ha ocurrido un error obteniendo datos del usuario",
          text: `Código de estado: ${response.status}`,
        });
      }
    } catch (error) {
      console.error("Error en vistaprotected:", error);
  
      if (error.message === "Network Error") {
        Swal.fire({
          icon: "error",
          title: "Error de red",
          text: "No se pudo conectar con el servidor. Verifica tu conexión.",
        });
      } else if (error.response) {
        // Errores provenientes del servidor
        Swal.fire({
          icon: "error",
          title: "Error del servidor",
          text: error.response.data?.detail || "Ha ocurrido un error inesperado.",
        });
      } else if (error.request) {
        // Errores sin respuesta del servidor
        Swal.fire({
          icon: "error",
          title: "Sin respuesta del servidor",
          text: "El servidor no respondió. Intenta nuevamente más tarde.",
        });
      } else {
        // Otros errores desconocidos
        Swal.fire({
          icon: "error",
          title: "Error desconocido",
          text: error.message || "Ha ocurrido un error inesperado.",
        });
      }
    } finally {
      // Asegurarse de que el loading siempre termine
      setloadingLogin(false);
    }
  }, [token]);

  //Funcion login
  const login = useCallback(async (correo, contraseña) => {
    try {
      setloadingLogin(true);
      const response = await clienteAxios.post("users/login/", {
        username: correo,
        password: contraseña,
      });
      const dataLogin = response.data;

      if (response.status !== 200) {
        return Swal.fire({
          icon: "error",
          title: "Contraseña incorrecta",
        });
      } else {

    
        setLoggedIn(true);
        setloadingLogin(false);
        /* tokens */
        setToken(dataLogin.access);
        setrefresh_Token(dataLogin.refresh);
     /*    vistaprotected(dataLogin.access); */
      }
    } catch (error) {
      setloadingLogin(false);
      console.log(error);

      if (error.message === "Network Error") {
        return Swal.fire({
          icon: "error",
          title: "Error de respuesta del servidor",
          text: error.message,
        });
      }

      if (error.request) {
        Swal.fire({
          icon: "error",
          title: "Error en autenticacion o servidor ",
          text: error?.response?.data?.detail,
        });
      } else if (error.response) {
        Swal.fire({
          icon: "error",
          title: "No se recibió respuesta del servidor",
          text: error.response.data.error,
        });
        console.error(
          "No se recibió respuesta del servidor" + error.response.data
        );
      } else {
        Swal.fire({
          icon: "error",
          title: "Error de respuesta del servidor",
          text: error.message.error,
        });
      }
    }
  }, [vistaprotected]);

  //Funcion crear registro
  const registro = useCallback(
    async (usuario) => {
      try {
        setloadingRegistro(true);

        const response = await clienteAxios.post(
          "users/register/",
          {
            username: usuario.correo,
            password: usuario.contrasena,
            password2: usuario.confirmarContrasena,
            first_name: usuario.nombres,
            last_name: usuario.apellidos,
            email: usuario.correo,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 201) {
          Swal.fire({
            icon: "success",
            title: "Registro exitoso",
            text: `Has sido registrado con exito ${usuario.nombres} ${usuario.apellidos}`,
          });

          login(usuario.correo, usuario.contrasena);
          setloadingRegistro(false);
        }
      } catch (error) {
        setloadingRegistro(false);
        console.log(error);
        if (error.message === "Network Error") {
          return Swal.fire({
            icon: "error",
            title: "Error de red",
            text: "No se puede conectar al servidor. Por favor, verifica tu conexión.",
          });
        }

        if (error.response) {
          // Inicializa una variable para el mensaje de error consolidado
          let mensajeError = "";
          // Recorre todos los errores
          for (const campo in error.response.data) {
            if (error.response.data.hasOwnProperty(campo)) {
              const erroresCampo = error.response.data[campo];
              if (Array.isArray(erroresCampo)) {
                mensajeError += erroresCampo.join(", ") + "\n";
              } else {
                mensajeError += erroresCampo + "\n";
              }
            }
          }

          // Mostrar el mensaje de errorconsolidado
          Swal.fire({
            icon: "error",
            title: "Error de registro",
            text: mensajeError || "Hubo un error en el registro.",
          });

          console.error("Error de respuesta del servidor:", error.response);
        } else if (error.request) {
          Swal.fire({
            icon: "error",
            title: "No se recibió respuesta del servidor",
            text: "Por favor, inténtelo de nuevo más tarde.",
          });
          console.error("No se recibió respuesta del servidor", error.request);
        } else {
          Swal.fire({
            icon: "error",
            title: "Error inesperado",
            text: error.message || "Ocurrió un error inesperado.",
          });
        }
      }
    },
    [login]
  );
  //Funcion cerrar sesion
  const logout = useCallback(
    async (id) => {
      setLoggedIn(false);
      setToken(null);
      setAdmin(false);

      window.location.replace("/");
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        const datos = {
          refresh: refresh_token,
        };
        const respuesta = await clienteAxios.post("users/logout/", datos, {
          headers,
        });
        if (respuesta.status !== 205) {
          return Swal.fire({
            icon: "error",
            title: "Error al cerrar sesión",
          });
        }

        setLoggedIn(false);
        setToken(null);
        setAdmin(false);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        localStorage.removeItem("is_superuser");
      } catch (error) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        localStorage.removeItem("is_superuser");

        console.error(error);
      }
    },
    [refresh_token, token]
  );

  const contextValue = useMemo(() => {
    return {
      setAdmin,
      login,
      logout,
      setVistaLog,
      registro,
      setLoggedIn,
      setToken,
      setUsuario,
      setJsonlogin,
      setloadingLogin,
      setUser,
      vistaprotected,
      loadingRegistro,
      user,
      loadingLogin,
      admin,
      isLoggedIn,
      vistaLog,
      usuario,
      jsonlogin,
      token,
      dataadicional,
    };
  }, [
    setAdmin,
    login,
    logout,
    setVistaLog,
    registro,
    setLoggedIn,
    setToken,
    setUsuario,
    setJsonlogin,
    setloadingLogin,
    setUser,
    vistaprotected,
    loadingRegistro,
    user,
    loadingLogin,
    admin,
    isLoggedIn,
    usuario,
    jsonlogin,
    token,
    dataadicional,
    vistaLog,
  ]);

  return (
    <ContextControl.Provider value={contextValue}>
      {children}
    </ContextControl.Provider>
  );
};
export { ContextControl, LoginProvider };
