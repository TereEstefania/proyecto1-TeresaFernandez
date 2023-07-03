// Cargar las variables de entorno del archivo .env
require("dotenv").config();

// Importar el módulo Express
const express = require("express");
const app = express();

// Importar las funciones del gestor de frutas
const { leerFrutas, guardarFrutas } = require("./src/frutasManager");

// Configurar el número de puerto para el servidor
const PORT = process.env.PORT || 3000;

// Crear un arreglo vacío para almacenar los datos de las frutas
let BD = [];

// Configurar el middleware para analizar el cuerpo de las solicitudes como JSON
app.use(express.json());

// Middleware para leer los datos de las frutas antes de cada solicitud
app.use((req, res, next) => {
  BD = leerFrutas(); // Leer los datos de las frutas desde el archivo
  next(); // Pasar al siguiente middleware o ruta
});

// Ruta principal que devuelve los datos de las frutas
app.get("/", (req, res) => {
   res.send(BD);
});

//Ruta para mostrar por id
app.get("/id/:id", (req, res) =>{ 
    let item = parseInt(req.params.id);
    const frutaI = BD.find(i => i.id === item);
    if(frutaI)
    {
        res.json(frutaI);
        res.status(200).send(`fruta encontrada:${item}.`);
    }else {
      res.send("Lo sentimos, id no encontrado.");  
    }  
});
// Ruta para manejar las solicitudes a rutas no existentes
app.get("*", (req, res) => {
  res.status(404).send("Lo sentimos, la página que buscas no existe.");
});

// Ruta para agregar una nueva fruta al arreglo y guardar los cambios
app.post("/", (req, res) => {
    const nuevaFruta = req.body;
    BD.push(nuevaFruta); // Agregar la nueva fruta al arreglo
    guardarFrutas(BD); // Guardar los cambios en el archivo
    res.status(201).send("Fruta agregada!"); // Enviar una respuesta exitosa
});

app.put("/id/:id", (req, res) =>{   
    let item = parseInt(req.params.id); 
    const frutaI = BD.find(i => i.id === item); 
    if(frutaI){
      //const find = elment => elment === result;
      const otraFruta = req.body;
      BD[frutaI] = { ...BD[frutaI], ...otraFruta };
      guardarFrutas(BD);
      res.status(200).send(`Valores remplazados:${item}.`)
    } else {
        res.send(`No existe fruta con id correspondente al id:${iten}.` )
      }
  });

  app.delete("/",(req,res) => { 
    BD.pop();
    guardarFrutas(BD);
    res.status(200).send('¡Ultima fruta eliminada!.');
  });

  app.delete('/id/:id',(req, res) =>{ 
    let iten = parseInt(req.params.id);
    const frutaI = BD.find(i => i.id === iten);
    if(frutaI){
        const frutaEliminada = BD.splice(frutaI, 1)[0];
      guardarFrutas(BD);
      res.status(200).send(`Se elimino el archivo con id:${iten} correctamente!. `)
    } else {
      res.send(`No existe fruta con id correspondente al id:${iten}.` )
    }
  });
  


// Iniciar el servidor y escuchar en el puerto especificado
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});