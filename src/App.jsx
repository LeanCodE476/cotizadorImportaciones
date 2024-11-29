import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, MenuItem } from "@mui/material";

function App() {
  const [nombreProducto, setNombreProducto] = useState("");
  const [precioUnitario, setPrecioUnitario] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [pesoProducto, setPesoProducto] = useState("");
  const [tipoEnvio, setTipoEnvio] = useState("");
  const [precioUnitarioPesos, setPrecioUnitarioPesos] = useState(0);
  const [precioTotal, setPrecioTotal] = useState(0);
  const [comprar, setComprar] = useState(false);
  const [dolarBlue, setDolarBlue] = useState(null);
  const [valorEnvio, setValorEnvio] = useState(0);
  const [pesoTotalEnvio, setPesoTotalEnvio] = useState(0);
  const [precioFinal, setPrecioFinal] = useState(0);
  const [sumaTotal, setSumaTotal] = useState(0);

  useEffect(() => {
    fetch("https://dolarapi.com/v1/dolares/blue")
      .then((response) => response.json())
      .then((data) => setDolarBlue(data))
      .catch((error) => console.error("Error fetching dolar blue:", error));
  }, []);

  const handleTipoEnvioChange = (event) => {
    setTipoEnvio(event.target.value);
  };

  const calcularPrecio = () => {
    const totalDolares = parseFloat(precioUnitario);
    const dolar = parseFloat(dolarBlue?.venta);
    const pesoUnitarioGramos = parseFloat(pesoProducto);
    const pesoTotalGramos = pesoUnitarioGramos * parseInt(cantidad);
    const pesoTotalKilogramos = pesoTotalGramos / 1000; // Convertir gramos a kilogramos
    setPesoTotalEnvio(pesoTotalKilogramos);

    let envioPorUnidad = 0;

    switch (tipoEnvio) {
      case "Regular":
        envioPorUnidad = pesoUnitarioGramos / 1000 * 60; // Convertir a kilogramos y multiplicar por la tarifa
        break;
      case "Express":
        envioPorUnidad = pesoUnitarioGramos / 1000 * 65;
        break;
      case "Economy":
        envioPorUnidad = pesoUnitarioGramos / 1000 * 55;
        break;
      default:
        break;
    }

    const envioEnPesos = envioPorUnidad * dolar * parseInt(cantidad); // Calcular el costo total de envío en pesos
    setValorEnvio(envioEnPesos);

    const precioUnitarioPesos = totalDolares * dolar;
    setPrecioUnitarioPesos(precioUnitarioPesos);

    const totalEnPesos = precioUnitarioPesos * parseInt(cantidad);
    setPrecioTotal(totalEnPesos);

    const precioFinalConEnvio = precioUnitarioPesos + envioPorUnidad * dolar; // Precio unitario + costo de envío por unidad
    setPrecioFinal(precioFinalConEnvio);

    const sumaTotalConEnvio = totalEnPesos + envioEnPesos;
    setSumaTotal(sumaTotalConEnvio);

    setComprar(true); // Asumimos que siempre es una buena compra ya que no comparamos con el precio de mercado.
  };

  const formatCurrency = (value) => {
    return value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
  };

  return (
    <>
      <Box
        sx={{
          m: "2rem auto",
          maxWidth: "35rem",
          minHeight: "30rem",
          width: "90%",
          outline: "2px solid white",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          borderRadius: '.5rem',
          background: '#e0e0e0',
          boxShadow: "20px 20px 60px #bebebe, -20px -20px 60px #ffffff"
        }}
      >
        <Typography
          variant="h1"
          textAlign={"center"}
          fontSize={"1.5rem"}
          fontStyle={'italic'}
        >
          Cotizador de Importaciones
        </Typography>
        <TextField
          id="nombreProducto"
          label="Nombre del Producto"
          variant="outlined"
          color="secondary"
          value={nombreProducto}
          onChange={(e) => setNombreProducto(e.target.value)}
        />
        <TextField
          id="precioUnitario"
          label="Precio Unitario ($)"
          variant="outlined"
          color="secondary"
          value={precioUnitario}
          onChange={(e) => setPrecioUnitario(e.target.value)}
        />
        <TextField
          id="cantidad"
          label="Cantidad"
          variant="outlined"
          color="secondary"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
        />
        <TextField
          id="pesoProducto"
          label="Peso del Producto (gramos)"
          variant="outlined"
          color="secondary"
          value={pesoProducto}
          onChange={(e) => setPesoProducto(e.target.value)}
        />
        <TextField
          id="tipoEnvio"
          select
          label="Tipo de Envío"
          variant="outlined"
          color="secondary"
          value={tipoEnvio}
          onChange={handleTipoEnvioChange}
        >
   
          <MenuItem value="Economy">Economy ( $55 USD)</MenuItem>
        </TextField>

        <Button variant="contained" onClick={calcularPrecio}>
          Calcular
        </Button>
        {precioTotal !== 0 && (
          <Box>
            <Typography fontWeight={'bold'} mt={'1rem'} textTransform={'capitalize'}>Nombre de producto: {nombreProducto}</Typography>
            <Typography fontWeight={'bold'} mt={'1rem'}>
              Precio Unitario <span style={{ color: 'blue' }}>SIN ENVIO</span> en Pesos: <span style={{color:'red'}}>{formatCurrency(precioUnitarioPesos)}</span> 
            </Typography>
            <Typography fontWeight={'bold'} mt={'1rem'}>Cantidad: <span style={{color:'red'}}>{cantidad}</span>  unidad(es)</Typography>
            <Typography fontWeight={'bold'} mt={'1rem'}>Tipo de envío: <span style={{color:'red'}}>{tipoEnvio}</span> </Typography>
            <Typography fontWeight={'bold'} mt={'1rem'}>Valor del envío en pesos: <span style={{color:'red'}}>{formatCurrency(valorEnvio)}</span> </Typography>
            <Typography fontWeight={'bold'} mt={'1rem'}>Peso total del envío:<span style={{color:'red'}}> {pesoTotalEnvio.toFixed(3)}</span>  kg</Typography>
            <Typography fontWeight={'bold'} mt={'1rem'}>Suma Total por x Unidades en Pesos: <span style={{color:'red'}}>{formatCurrency(precioTotal)}</span> </Typography>
            <Typography fontWeight={'bold'} mt={'1rem'}>Precio Final Unitario Con Envio en Pesos: <span style={{color:'red'}}>{formatCurrency(precioFinal)}</span></Typography>
          </Box>
        )}
      </Box>
    </>
  );
}

export default App;
