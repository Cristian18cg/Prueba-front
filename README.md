# Proyecto Frontend React

Este proyecto es un frontend desarrollado en React para interactuar con una API REST de autenticacion en JWT.

## Requisitos

- **Node.js**: Versión 14 o superior.
- **npm** o **yarn**: Gestor de paquetes.

## Instalación y Configuración

1. **Clonar el repositorio:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd <NOMBRE_DEL_REPOSITORIO>

2. **Instalar dependendencias:**
    npm install
    
3. **Configurar variables de entorno:**

    Si no esta en el repositorio crea un archivo .env en la raíz del proyecto.

    Agrega las siguientes variables según la configuración de tu API backend:

    env

    REACT_APP_API_URL=http://localhost:8000

4. **Iniciar el servidor de desarrollo:**

    npm start   

5. **Estructura del Proyecto**
La estructura principal del proyecto es la siguiente:

src/
├── components/       # Componentes y paginas de la app
├── context/          # Contextos globales 
├── hooks/            # Custom Hooks 
├── img/              # Recursos estáticos como imágenes y estilos
├── App.js            # Componente principal
├── index.js          # Punto de entrada de la aplicación    