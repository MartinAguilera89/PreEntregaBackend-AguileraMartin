import express from 'express';
import productsRouter from './src/routes/products.js';
import cartsRouter from './src/routes/carts.js';


const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(port, () => {
  console.log(`Servidor escuchando el puerto: ${port}`);
});
