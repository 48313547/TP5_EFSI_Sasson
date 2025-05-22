
import React, { useState } from 'react';

function Formulario() {
  const [datosFormulario, setDatosFormulario] = useState({
    nombre: '',
    sector: '',
  });

  const [listaEmpanadas, setListaEmpanadas] = useState([
    { gusto: '', cantidad: '' }
  ]);

  const [listaPedidos, setListaPedidos] = useState([]);

  function cambiarDato(evento) {
    const nombreCampo = evento.target.name;
    const valor = evento.target.value;
    const nuevosDatos = {
      nombre: datosFormulario.nombre,
      sector: datosFormulario.sector
    };
    nuevosDatos[nombreCampo] = valor;
    setDatosFormulario(nuevosDatos);
  }

  function cambiarEmpanada(indice, evento) {
    const nombreCampo = evento.target.name;
    const valor = evento.target.value;
    const nuevasEmpanadas = listaEmpanadas.slice();
    const empanada = {
      gusto: nuevasEmpanadas[indice].gusto,
      cantidad: nuevasEmpanadas[indice].cantidad
    };
    empanada[nombreCampo] = valor;
    nuevasEmpanadas[indice] = empanada;
    setListaEmpanadas(nuevasEmpanadas);
  }

  function agregarEmpanada() {
    const nuevasEmpanadas = listaEmpanadas.slice();
    nuevasEmpanadas.push({ gusto: '', cantidad: '' });
    setListaEmpanadas(nuevasEmpanadas);
  }

  function enviarFormulario(evento) {
    evento.preventDefault();

    const empanadasValidas = [];
    for (let i = 0; i < listaEmpanadas.length; i++) {
      const e = listaEmpanadas[i];
      if (e.gusto && e.cantidad && Number(e.cantidad) > 0) {
        empanadasValidas.push({
          gusto: e.gusto,
          cantidad: Number(e.cantidad)
        });
      }
    }

    if (!datosFormulario.nombre || !datosFormulario.sector || empanadasValidas.length === 0) {
      alert('Por favor complete nombre, sector y al menos una empanada con cantidad válida.');
      return;
    }

    const nuevoPedido = {
      nombre: datosFormulario.nombre,
      sector: datosFormulario.sector,
      empanadas: empanadasValidas
    };

    const nuevosPedidos = listaPedidos.slice();
    nuevosPedidos.push(nuevoPedido);
    setListaPedidos(nuevosPedidos);

    setDatosFormulario({ nombre: '', sector: '' });
    setListaEmpanadas([{ gusto: '', cantidad: '' }]);
  }

  const totalPorGusto = {};
  for (let j = 0; j < listaPedidos.length; j++) {
    const pedido = listaPedidos[j];
    for (let k = 0; k < pedido.empanadas.length; k++) {
      const item = pedido.empanadas[k];
      if (totalPorGusto[item.gusto]) {
        totalPorGusto[item.gusto] += item.cantidad;
      } else {
        totalPorGusto[item.gusto] = item.cantidad;
      }
    }
  }

  return (
    <>
      <form onSubmit={enviarFormulario}>
        <label>Nombre:</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={datosFormulario.nombre}
          onChange={cambiarDato}
          placeholder="Ingresa tu nombre"
        />
        <br />
        <label>Sector:</label>
        <select
          id="sector"
          name="sector"
          value={datosFormulario.sector}
          onChange={cambiarDato}
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
        {listaEmpanadas.map(function(empanada, indice) {
          return (
            <div key={indice}>
              <label>Gusto:</label>
              <select
                name="gusto"
                value={empanada.gusto}
                onChange={function(e) { return cambiarEmpanada(indice, e); }}
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
                onChange={function(e) { return cambiarEmpanada(indice, e); }}
                placeholder="Cantidad"
              />
            </div>
          );
        })}
        <button type="button" onClick={agregarEmpanada}>Agregar otra empanada</button>
        <br />
        <button type="submit">Terminar pedido</button>
      </form>

      <h2>Resumen total de empanadas por gusto</h2>
      <ul>
        {(() => {
          let hasPedidos = false;
          const items = [];
          for (const gusto in totalPorGusto) {
            hasPedidos = true;
            items.push(<li key={gusto}>{gusto}: {totalPorGusto[gusto]}</li>);
          }
          if (!hasPedidos) {
            return <li>No hay pedidos aún.</li>;
          }
          return items;
        })()}
      </ul>

      <h2>Pedidos por persona</h2>
      <ul>
        {listaPedidos.length === 0 ? (
          <li>No hay pedidos aún.</li>
        ) : (
          listaPedidos.map(function(pedido, idx) {
            return (
              <li key={idx}>
                <strong>{pedido.nombre} ({pedido.sector}):</strong>
                <ul>
                  {pedido.empanadas.map(function(e, i) {
                    return <li key={i}>{e.cantidad} x {e.gusto}</li>;
                  })}
                </ul>
              </li>
            );
          })
        )}
      </ul>
    </>
  );
}

export default Formulario;
