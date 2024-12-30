import React,{useEffect} from 'react';
import useControl from '../../hooks/useControl'
import { Button } from "primereact/button";

export const Dashboard = () => {
    const{ usuario,logout, token,isLoggedIn,vistaprotected } = useControl();

 useEffect(() => {
    if (isLoggedIn && token && !usuario) {
      vistaprotected();
    }
 }, [usuario, isLoggedIn, token]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
          Bienvenido a Transportes EOM, {usuario} 
        </h1>
        <Button
          onClick={logout}
          className="mt-3 w-full focus:outline-none focus:ring-4 focus:ring-orange-300 focus:border-orange-500 bg-[#ff7d44] border-[#ff7d44] focus:bg-[#ff7d44] active:border hover:bg-orange-600 hover:border-orange-600 "
label='Cerrar Sesión'
        >
        </Button>
      </div>
    </div>
  );
};
