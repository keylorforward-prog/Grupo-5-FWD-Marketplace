import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../Pages/Login';
import AdminProfile from '../Pages/AdminProfile';

/**
 * Orquestador de enrutamiento de la aplicación.
 * Define un comportamiento declarativo para la gestión de rutas públicas, 
 * privadas y la resolución de excepciones (404 fallback).
 */
export default function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirección imperativa inicial hacia el login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Contexto Público */}
        <Route path="/login" element={<Login />} />
        
        {/* Contexto Administrativo */}
        <Route path="/admin" element={<AdminProfile />} />
        
        {/* Captura de rutas no parametrizadas (Fallback de seguridad) */}
        <Route path="*" element={
          <div className="flex h-screen w-full items-center justify-center bg-ink-strong text-canvas">
            <h1 className="text-2xl font-bold text-magenta">404 - Ruta no encontrada</h1>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}