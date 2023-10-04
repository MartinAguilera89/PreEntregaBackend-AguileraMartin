import express from 'express';
import fs from 'fs';

const cartsRouter = express.Router();

const carts =[]

// Ruta para crear un nuevo carrito (POST)
cartsRouter.post('/', (req, res) => {
    try {
      // Genera un ID único para el nuevo carrito (puedes usar una biblioteca como 'uuid')
      const newCartId = Date.now().toString();
  
      // Crea un nuevo carrito con la estructura requerida
    const newCart = {
      id: newCartId,
      products: [],
    };
      
      let carts;

      // Lee el archivo carts.json
      try {
      carts = JSON.parse(fs.readFileSync('src/data/carts.json', 'utf-8'));
    } catch (readError) {
        res.status(500).json({ error: 'Error interno del servidor al leer carts.json' });
        return;
      }
      // Agrega el nuevo carrito al array de carrito
      carts.push(newCart);
      // Escribe los datos actualizados en carts.json
      try {
      fs.writeFileSync('src/data/carts.json', JSON.stringify(carts, null, 2));
    } catch (writeError) {
        res.status(500).json({ error: 'Error interno del servidor al escribir en carts.json' });
        return;
      }
      res.status(201).json(newCart);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear un carrito' });
    }
  });
  
    // Ruta para listar productos en un carrito
    cartsRouter.get('/:cid', (req, res) => {
      // Implementa la lógica para obtener los productos en un carrito por su ID desde carrito.json
      const cartId = req.params.cid;
      const carts = JSON.parse(fs.readFileSync('src/data/carts.json', 'utf-8'));
      const cart = carts.find((c) => c.id === cartId);
      if (cart) {
        res.json(cart.products);
      } else {
        res.status(404).json({ message: 'Carrito no encontrado' });
      }
    });
    
    // Ruta para agregar un producto a un carrito
    cartsRouter.post('/:cid/product/:pid', (req, res) => {
      // Implementa la lógica para agregar un producto a un carrito en carrito.json
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const carts = JSON.parse(fs.readFileSync('src/data/carts.json', 'utf-8'));
      const cart = carts.find((c) => c.id === cartId);
      if (cart) {
        // Verifica si el producto ya existe en el carrito
        const existingProduct = cart.products.find((p) => p.product === productId);
        if (existingProduct) {
          // Si existe, incrementa la cantidad
          existingProduct.quantity++;
        } else {
          // Si no existe, agrega el producto al carrito
          cart.products.push({ product: productId, quantity: 1 });
        }
        fs.writeFileSync('src/data/carts.json', JSON.stringify(carts, null, 2));
        res.status(200).json(cart.products);
      } else {
        res.status(404).json({ message: 'Carrito no encontrado' });
      }
    });
    
    export default cartsRouter;
    