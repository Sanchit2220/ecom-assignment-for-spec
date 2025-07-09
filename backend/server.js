// Import required modules
const express = require('express'); // Web framework for Node.js
const cors = require('cors'); // Middleware to enable Cross-Origin Resource Sharing
const mysql = require('mysql2'); // MySQL client for Node.js
const multer = require('multer'); // Middleware for handling file uploads
const csv = require('csv-parser'); // For parsing CSV files (not used in current code)
const fs = require('fs'); // File system module (not used in current code)

const app = express();
app.use(cors()); // Allow requests from other origins (frontend)
app.use(express.json()); // Parse incoming JSON requests

// MySQL connection configuration
const db = mysql.createConnection({
  host: 'localhost', // Database host
  user: 'root',      // MySQL username
  password: 'root',  // MySQL password
  database: 'ecom'   // Database name
});

// Connect to MySQL and log status
// If connection fails, throw error and stop server
// If successful, print confirmation
// This connection is used for all queries below
//
db.connect(err => {
  if (err) throw err;
  console.log('MySQL connected!');
});

// Configure multer for file uploads (CSV import, not implemented yet)
const upload = multer({ dest: 'uploads/' }); // Files will be stored in 'uploads/'

// =====================
// GET /api/products
// =====================
// Returns a list of products with support for:
// - Filtering by brand, category, price range
// - Full-text search (name, description, brand, material, category)
// - Sorting by id, name, price, brand, category
// - Pagination (page, pageSize)
//
app.get('/api/products', (req, res) => {
  // Extract query parameters for filtering, search, sorting, and pagination
  const {
    search,      // Search term for full-text search
    brand,       // Filter by brand
    category,    // Filter by category
    price_min,   // Minimum price
    price_max,   // Maximum price
    sort_by = 'id',      // Sort column (default: id)
    sort_order = 'asc',  // Sort order (asc/desc)
    page = 1,            // Page number (default: 1)
    pageSize = 12        // Items per page (default: 12)
  } = req.query;

  let where = [];   // Array to build WHERE conditions
  let params = [];  // Array for parameterized query values

  // Filtering by brand
  if (brand) {
    where.push('brand = ?');
    params.push(brand);
  }
  // Filtering by category
  if (category) {
    where.push('category = ?');
    params.push(category);
  }
  // Filtering by minimum price
  if (price_min) {
    where.push('price >= ?');
    params.push(Number(price_min));
  }
  // Filtering by maximum price
  if (price_max) {
    where.push('price <= ?');
    params.push(Number(price_max));
  }

  // Full-text search and LIKE search on multiple fields
  if (search) {
    where.push('(' +
      'MATCH(name, description) AGAINST (? IN NATURAL LANGUAGE MODE) OR ' +
      'brand LIKE ? OR ' +
      'material LIKE ? OR ' +
      'category LIKE ?' +
    ')');
    // Add search term for full-text and LIKE queries
    params.push(search, `%${search}%`, `%${search}%`, `%${search}%`);
  }

  // Build WHERE clause for SQL query
  const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';

  // Validate and set sorting column and direction
  const allowedSort = ['id', 'name', 'price', 'brand', 'category'];
  const sortCol = allowedSort.includes(sort_by) ? sort_by : 'id';
  const sortDir = sort_order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

  // Pagination: calculate LIMIT and OFFSET
  const limit = Math.max(1, parseInt(pageSize));
  const offset = (Math.max(1, parseInt(page)) - 1) * limit;

  // Main SQL query to fetch products
  const sql = `
    SELECT * FROM products_clean
    ${whereClause}
    ORDER BY ${sortCol} ${sortDir}
    LIMIT ? OFFSET ?
  `;
  // Add pagination params
  params.push(limit, offset);

  // Execute query and return results as JSON
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// =====================
// GET /api/products/:id
// =====================
// Returns a single product by its ID
//
app.get('/api/products/:id', (req, res) => {
  const productId = req.params.id; // Extract product ID from URL
  db.query('SELECT * FROM products_clean WHERE id = ?', [productId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(results[0]); // Return the product object
  });
});


// Start the server on port 5000
app.listen(5000, () => console.log('Server running on port 5000'));