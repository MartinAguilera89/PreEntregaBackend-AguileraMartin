import express from 'express';
import fs from 'fs';

const productsRouter  = express.Router();

const product =[]

// Ruta para agregar un nuevo producto (POST)
productsRouter.post('/', (req, res) => {

    // Genera un ID único
    let id=Date.now().toString();

    const {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
    } = req.body;

    // Valida que todos los campos obligatorios estén presentes
    if (
        !title || !description || !code || !price || !status || !stock || !category
        ){
        return res.status(400).json({ error: 'Campos obligatorios faltantes' });
        }

    // Lee el archivo productos.json
    const products = JSON.parse(fs.readFileSync('src/data/products.json', 'utf-8'));

    // Crea un nuevo producto con los campos requeridos
    const newProduct = {
        id: Date.now().toString(),
        title,
        description,
        code,
        price,
        status : true,
        stock,
        category,
        thumbnails,
    };

    // Agrega el nuevo producto al array de productos
    products.push(newProduct);
    // Escribe los datos actualizados en productos.json
    fs.writeFileSync('src/data/products.json', JSON.stringify(products, null, 2));
    res.status(201).json(newProduct);
  });

  
// Ruta para listar todos los productos
productsRouter.get('/', (req, res) => {
  try {
    // Lee el archivo productos.json y lo convierte en un objeto JavaScript
    const products = JSON.parse(fs.readFileSync('src/data/products.json', 'utf-8'));
    res.json(products);
  } catch (error) {
    // Maneja cualquier error que pueda ocurrir durante la lectura del archivo
    res.status(500).json({ error: 'Error al leer products.json' });
  }
});

// Ruta para obtener un producto por ID
productsRouter.get('/:pid', (req, res) => {
  // Implementa la lógica para obtener un producto por su ID desde productos.json
  const productId = req.params.pid;
  const products = JSON.parse(fs.readFileSync('src/data/products.json', 'utf-8'));
  const product = products.find((p) => p.id === productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
});

// Otras rutas según tus requerimientos
// Ruta para actualizar un producto por ID (PUT)
productsRouter.put('/:pid', (req, res) => {
    try {
      const productId = req.params.pid;
      const updatedProductData = req.body;
  
      // Lee el archivo productos.json
      let products = JSON.parse(fs.readFileSync('src/data/products.json', 'utf-8'));
  
      // Busca el producto por su ID
      const existingProduct = products.find((p) => p.id === productId);
  
      if (existingProduct) {
        // Actualiza los campos del producto (excepto el ID)
        Object.assign(existingProduct, updatedProductData);
  
        // Escribe los datos actualizados en productos.json
        fs.writeFileSync('src/data/products.json', JSON.stringify(products, null, 2));
  
        res.json(existingProduct);
      } else {
        res.status(404).json({ message: 'Producto no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar producto:' });
    }
  });
  
  // Ruta para eliminar un producto por ID (DELETE)
  productsRouter.delete('/:pid', (req, res) => {
    try {
      const productId = req.params.pid;
  
      // Lee el archivo productos.json
      let products = JSON.parse(fs.readFileSync('src/data/products.json', 'utf-8'));
  
      // Encuentra el índice del producto en el array
      const productIndex = products.findIndex((p) => p.id === productId);
  
      if (productIndex !== -1) {
        // Elimina el producto del array
        products.splice(productIndex, 1);
  
        // Escribe los datos actualizados en productos.json
        fs.writeFileSync('src/data/products.json', JSON.stringify(products, null, 2));
  
        res.status(204).send(); // Respuesta sin contenido (producto eliminado)
      } else {
        res.status(404).json({ message: 'Producto no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar producto' });
    }
  });

export default productsRouter;
