import React, { useState } from "react";
import { useForm } from "react-hook-form";

export const Login = () => {

  const { register, handleSubmit, formState: { errors },} = useForm();

  const login = async (data) => {
    try {
      const response = await fetch("http://localhost:3000/users");
      const usuarios = await response.json();
      const usuario = usuarios.find((user) => user.email === data.email);

      if (!usuario) {
        alert("Usuario no encontrado");
        return;
      }

      if (usuario.password !== data.password) {
        alert("Contraseña incorrecta");
        return;
      }

      
      localStorage.setItem("usuario", JSON.stringify(usuario));

      alert("Login exitoso");
      window.location.href = "/";
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Hubo un error al iniciar sesión.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="col-md-6 col-lg-4">
        <div className="card shadow-lg border-0 rounded-4">
          <div className="card-body p-4">
            <h3 className="card-title text-center mb-4 fw-bold">Login</h3>
            <form onSubmit={handleSubmit(login)}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  className="form-control rounded-3"
                  placeholder="Introduce tu email"
                  {...register("email", { required: "El email es obligatorio" })}
                />
                {errors.email && <p className="text-danger small">{errors.email.message}</p>}
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Contraseña</label>
                <input
                  type="password"
                  className="form-control rounded-3"
                  placeholder="Password"
                  {...register("password", { required: "La contraseña es obligatoria" })}
                />
                {errors.password && <p className="text-danger small">{errors.password.message}</p>}
              </div>
              <button type="submit" className="btn btn-dark btn-lg rounded-3 w-100">
                Login
              </button>
            </form>
            <div className="text-center mt-3">
              <a href="/registro" className="text-decoration-none text-danger small">
                ¿No tienes cuenta?
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
