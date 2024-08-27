const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const ProductHistory = require('../models/ProductHistory'); // Importa el modelo de historial de cambios
const { parse } = require('json2csv'); // Importa parse una sola vez
const multer = require('multer');
const { parse: csvParse } = require('csv-parse/sync'); // Renombra parse para evitar conflicto
const upload = multer({ dest: 'uploads/' });


// Backend - Express
router.get('/product-history/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Aquí podrías realizar validaciones adicionales sobre el formato del ID
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error fetching product history:', error);
        res.status(500).json({ message: 'Error fetching product history' });
    }
});



// Ruta para exportar productos a CSV
router.get('/export', async (req, res) => {
    try {
        const products = await Product.find().populate('category');
        const csv = parse(products.map(product => ({
            name: product.name,
            quantity: product.quantity,
            price: product.price,
            category: product.category ? product.category.name : 'Desconocida',
            dateAdded: new Date(product.dateAdded).toLocaleString()
        })));
        res.header('Content-Type', 'text/csv');
        res.attachment('products.csv');
        res.send(csv);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Ruta para importar productos desde CSV
router.post('/import', upload.single('file'), async (req, res) => {
    try {
        const csvData = req.file.buffer.toString('utf-8');
        const records = csvParse(csvData, { columns: true });
        const products = records.map(record => ({
            name: record.name,
            quantity: parseInt(record.quantity, 10),
            price: parseFloat(record.price),
            category: record.category,
            dateAdded: record.dateAdded ? new Date(record.dateAdded) : new Date(),  // Utiliza la fecha del CSV si está presente
            barcode: record.barcode,
            provider: record.provider,
            description: record.description,
            lowStockThreshold: parseInt(record.lowStockThreshold, 10) || 10
        }));
        await Product.insertMany(products);
        res.status(200).json({ message: 'Productos importados con éxito' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Crear un producto
router.post('/', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).send(product);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Ruta para agregar un nuevo producto
router.post('/', async (req, res) => {
    const { name, quantity, price, category, barcode, description, provider, lowStockThreshold } = req.body;

    try {
        const newProduct = new Product({
            name,
            quantity,
            price,
            category,
            barcode,
            description,
            provider,
            lowStockThreshold,
            dateAdded: new Date()  // Asegura que se establezca la fecha de creación
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error agregando producto:', error);
        res.status(500).json({ message: 'Error agregando producto' });
    }
});


// Ruta para obtener todos los productos con búsqueda y ordenamiento
router.get('/', async (req, res) => {
    const { category, search, sortBy } = req.query;
    const filter = {};
    if (category) {
        filter.category = category;
    }
    if (search) {
        filter.name = new RegExp(search, 'i'); // Búsqueda insensible a mayúsculas y minúsculas
    }
    const sortOptions = {};
    if (sortBy) {
        sortOptions[sortBy] = 1; // Orden ascendente
    } else {
        sortOptions.name = 1; // Orden por defecto
    }

    try {
        const products = await Product.find(filter).sort(sortOptions).populate('category');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Ruta para obtener un producto por ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Actualizar un producto
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const product = await Product.findById(id);
        
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Guarda el historial antes de actualizar
        await ProductHistory.create({
            productId: id,
            action: 'updated',
            changes: {
                old: product.toObject(),
                new: updatedData
            }
        });

        const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });
        res.status(200).send(updatedProduct);
    } catch (err) {
        res.status(400).send(err);
    }
});




// Obtener detalles del producto por ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error fetching product details:', error);
        res.status(500).json({ message: 'Error fetching product details' });
    }
});

// Ruta para obtener un producto por código de barras
router.get('/barcode/:barcode', async (req, res) => {
    try {
        const product = await Product.findOne({ barcode: req.params.barcode });
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Buscar producto por código de barras
router.get('/barcode/:barcode', async (req, res) => {
    try {
        const product = await Product.findOne({ barcode: req.params.barcode });
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error fetching product by barcode:', error);
        res.status(500).json({ message: 'Error fetching product' });
    }
});





// Eliminar múltiples productos
router.delete('/', async (req, res) => {
    const { ids } = req.body;
    try {
        const products = await Product.find({ _id: { $in: ids } });

        // Guarda el historial antes de eliminar
        await ProductHistory.insertMany(products.map(product => ({
            productId: product._id,
            action: 'deleted',
            changes: { product: product.toObject() }
        })));

        await Product.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ message: 'Productos eliminados con éxito' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
