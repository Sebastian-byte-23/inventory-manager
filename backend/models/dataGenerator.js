const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');
const Category = require('./Category'); // Importa tu modelo de categoría
const Product = require('./Product'); // Importa tu modelo de producto

// Función para generar un producto aleatorio con una categoría existente
const generateRandomProduct = async (categories) => {
    try {
        if (categories.length === 0) {
            throw new Error('No hay categorías disponibles en la base de datos.');
        }

        const randomCategory = categories[Math.floor(Math.random() * categories.length)]; // Selecciona una categoría al azar

        const product = new Product({
            name: faker.commerce.productName(),
            quantity: faker.datatype.number({ min: 1, max: 100 }),
            price: parseFloat(faker.commerce.price()),
            description: faker.commerce.productDescription(),
            dateAdded: faker.date.past(),
            barcode: faker.datatype.uuid(),
            provider: new mongoose.Types.ObjectId(), // Crear un nuevo ObjectId para el proveedor
            category: randomCategory._id, // Asigna la categoría existente
            lowStockThreshold: faker.datatype.number({ min: 1, max: 20 })
        });

        await product.save(); // Inserta el producto en la base de datos
        return product;
    } catch (error) {
        console.error('Error al generar el producto:', error.message);
        throw error;
    }
};

// Función para generar varios productos aleatorios
const generateRandomProducts = async (num) => {
    try {
        const categories = await Category.find(); // Obtén todas las categorías de la base de datos
        console.log(`Número de categorías encontradas: ${categories.length}`); // Depuración

        // Genera productos en paralelo usando `Promise.all`
        const productPromises = Array.from({ length: num }, () => generateRandomProduct(categories));
        const products = await Promise.all(productPromises);

        console.log(`Número total de productos generados: ${products.length}`); // Depuración
        return products;
    } catch (error) {
        console.error('Error al generar productos:', error.message);
        throw error;
    }
};

module.exports = { generateRandomProducts };
