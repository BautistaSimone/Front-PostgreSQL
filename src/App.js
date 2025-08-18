import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [edad, setEdad] = useState("");
  const [fechaRegistro, setFechaRegistro] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error al obtener usuarios:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = {
      name,
      email,
      edad: parseInt(edad),
      fechaRegistro
    };

    if (editId) {
      fetch(`http://localhost:8080/users/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      }).then(() => {
        setEditId(null);
        limpiarFormulario();
        recargarUsuarios();
      });
    } else {
      fetch("http://localhost:8080/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      }).then(() => {
        limpiarFormulario();
        recargarUsuarios();
      });
    }
  };

  const handleEdit = (user) => {
    setEditId(user.id);
    setName(user.name);
    setEmail(user.email || "");
    setEdad(user.edad || "");
    setFechaRegistro(user.fechaRegistro || "");
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:8080/users/${id}`, { method: "DELETE" })
      .then(() => recargarUsuarios());
  };

  const limpiarFormulario = () => {
    setName("");
    setEmail("");
    setEdad("");
    setFechaRegistro("");
  };

  const recargarUsuarios = () => {
    fetch("http://localhost:8080/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4 text-center">📋 Gestión de Usuarios</h1>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="border p-4 rounded shadow-sm bg-light mb-4"
      >
        <div className="row g-3">
          <div className="col-md-3">
            <input
              placeholder="Esto es otro test"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              placeholder="Email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="col-md-2">
            <input
              placeholder="Edad"
              type="number"
              className="form-control"
              value={edad}
              onChange={(e) => setEdad(e.target.value)}
              required
            />
          </div>
          <div className="col-md-2">
            <input
              type="date"
              className="form-control"
              value={fechaRegistro}
              onChange={(e) => setFechaRegistro(e.target.value)}
              required
            />
          </div>
          <div className="col-md-2 d-grid">
            <button className="btn btn-primary" type="submit">
              {editId ? "Actualizar" : "Agregar"}
            </button>
          </div>
        </div>
      </form>

      {/* Tabla */}
      {users.length === 0 ? (
        <p className="text-center">No hay usuarios cargados</p>
      ) : (
        <table className="table table-bordered table-hover text-center align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Edad</th>
              <th>Fecha Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.edad}</td>
                <td>{u.fechaRegistro}</td>
                <td>
                  <button
                    onClick={() => handleEdit(u)}
                    className="btn btn-warning btn-sm me-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
