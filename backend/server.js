const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 5000;
const { faker } = require('@faker-js/faker');

// Importar rutas
const productHistoryRoutes = require('./routes/productHistory');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const providerRoutes = require('./routes/providers');

// Importar modelos
const Product = require('./models/Product');
const User = require('./models/User');
const Provider = require('./models/Provider');
const ProductHistory = require('./models/ProductHistory'); // Usa una única ruta
const { generateRandomProducts } = require('./models/dataGenerator'); // Ajusta la ruta según tu estructura de archivos

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/inventory', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.once('open', () => console.log('Conectado a MongoDB'));

// Función para insertar productos en la base de datos
const insertProducts = async () => {
  try {
      await Product.deleteMany(); // Elimina todos los productos existentes
      const products = generateRandomProducts(100); // Genera 10 productos aleatorios
      await Product.insertMany(products); // Inserta los productos en la base de datos
      console.log('Productos insertados correctamente');
  } catch (error) {
      console.error('Error al insertar productos:', error);
  }
};

// Llama a la función para insertar productos
insertProducts();
// Usar las rutas
app.use('/api/product-history', productHistoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/providers', providerRoutes);

// Ruta para obtener productos por categoría
app.get('/api/products/category/:category', async (req, res) => {
  const { category } = req.params;
  try {
      const products = await Product.find({ category });
      res.status(200).json(products);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});



// Ruta para obtener productos con stock bajo
app.get('/api/low-stock-alerts', async (req, res) => {
  try {
      const threshold = 10; // O el valor que consideres para stock bajo
      const lowStockProducts = await Product.find({ quantity: { $lt: threshold } });
      res.json(lowStockProducts);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching low stock products' });
  }
});

// Ruta para registrar nuevos usuarios
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const newUser = new User({ email, password });
    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Ruta para inicio de sesión
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && user.password === password) {
      res.status(200).json({ message: 'Inicio de sesión exitoso' });
    } else {
      res.status(401).json({ message: 'Correo electrónico o contraseña inválidos' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para eliminar un producto por ID
app.delete('/api/products/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const result = await Product.findByIdAndDelete(id);
      if (!result) {
          return res.status(404).json({ message: 'Producto no encontrado' });
      }
      res.status(200).json({ message: 'Producto eliminado con éxito' });
  } catch (error) {
      console.error('Error eliminando producto:', error);
      res.status(500).json({ message: 'Error en el servidor' });
  }
});


app.delete('/api/categories/:id', async (req, res) => {
  try {
      const categoryId = req.params.id;
      // Aquí deberías agregar la lógica para eliminar la categoría de la base de datos
      await Category.findByIdAndDelete(categoryId);
      res.status(200).json({ message: 'Categoría eliminada con éxito' });
  } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ message: 'Error al eliminar la categoría' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
