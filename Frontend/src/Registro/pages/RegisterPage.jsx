import { useState } from 'react';
import RegisterForm from "../components/RegisterForm";
import '../../Pages/AuthPages.css';

const RegisterPage = () => {
  

  return (
    <div className="auth-bg">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
       <RegisterForm/>
      
    </div>
  );
};

export default RegisterPage;
