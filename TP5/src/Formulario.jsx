import { useState } from 'react';

function Formulario() {
  const [formData, setFormData] = useState({
    nombre: '',
    sector: '',
  });

  const [empanadas, setEmpanadas] = useState([
    { gusto: '', cantidad: '' }
  ]);

  const [orders, setOrders] = useState([]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEmpanadaChange = (index, event) => {
    const { name, value } = event.target;
    setEmpanadas((prevEmpanadas) => {
      const newEmpanadas = [...prevEmpanadas];
      newEmpanadas[index] = {
        ...newEmpanadas[index],
        [name]: value,
      };
      return newEmpanadas;
    });
  };

  const addEmpanada = () => {
    setEmpanadas((prevEmpanadas) => [...prevEmpanadas, { gusto: '', cantidad: '' }]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Filter out empanadas with empty gusto or cantidad
    const filteredEmpanadas = empanadas.filter(e => e.gusto && e.cantidad && Number(e.cantidad) > 0);

    if (!formData.nombre || !formData.sector || filteredEmpanadas.length === 0) {
      alert('Por favor complete nombre, sector y al menos una empanada con cantidad válida.');
      return;
    }

    const newOrder = {
      nombre: formData.nombre,
      sector: formData.sector,
      empanadas: filteredEmpanadas.map(e => ({ ...e, cantidad: Number(e.cantidad) })),
    };

    setOrders((prevOrders) => [...prevOrders, newOrder]);

    // Reset form
    setFormData({ nombre: '', sector: '' });
    setEmpanadas([{ gusto: '', cantidad: '' }]);
  };

  // Aggregate total empanadas by gusto
  const totalByGusto = orders.reduce((acc, order) => {
    order.empanadas.forEach(({ gusto, cantidad }) => {
      acc[gusto] = (acc[gusto] || 0) + cantidad;
    });
    return acc;
  }, {});

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="nombre">Nombre:</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Ingresa tu nombre"
        />
        <br />
        <label htmlFor="sector">Sector:</label>
        <select
          id="sector"
          name="sector"
          value={formData.sector}
          onChange={handleChange}
        >
          <option value="">Selecciona tu sector</option>
          <option value="Sistemas">Sistemas</option>
          <option value="Finanzas">Finanzas</option>
          <option value="Ventas">Ventas</option>
          <option value="Recursos Humanos">Recursos Humanos</option>
          <option value="Soporte">Soporte</option>
          <option value="Depositos">Depositos</option>
        </select>
        <br />
        <h3>Empanadas</h3>
        {empanadas.map((empanada, index) => (
          <div key={index}>
            <label>Gusto:</label>
            <select
              name="gusto"
              value={empanada.gusto}
              onChange={(e) => handleEmpanadaChange(index, e)}
            >
              <option value="">Selecciona un gusto</option>
              <option value="Carne">Carne</option>
              <option value="Pollo">Pollo</option>
              <option value="Jamón y Queso">Jamón y Queso</option>
              <option value="Verdura">Verdura</option>
              <option value="Queso y Cebolla">Queso y Cebolla</option>
            </select>
            <label>Cantidad:</label>
            <input
              type="number"
              name="cantidad"
              min="1"
              value={empanada.cantidad}
              onChange={(e) => handleEmpanadaChange(index, e)}
              placeholder="Cantidad"
            />
          </div>
        ))}
        <button type="button" onClick={addEmpanada}>Agregar otra empanada</button>
        <br />
        <button type="submit">Terminar pedido</button>
      </form>

      <h2>Resumen total de empanadas por gusto</h2>
      <ul>
        {Object.entries(totalByGusto).map(([gusto, cantidad]) => (
          <li key={gusto}>{gusto}: {cantidad}</li>
        ))}
        {Object.keys(totalByGusto).length === 0 && <li>No hay pedidos aún.</li>}
      </ul>

      <h2>Pedidos por persona</h2>
      <ul>
        {orders.length === 0 && <li>No hay pedidos aún.</li>}
        {orders.map((order, idx) => (
          <li key={idx}>
            <strong>{order.nombre} ({order.sector}):</strong>
            <ul>
              {order.empanadas.map((e, i) => (
                <li key={i}>{e.cantidad} x {e.gusto}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </>
  );
}

export default Formulario;
