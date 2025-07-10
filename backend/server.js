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
  const {
    search,
    brand,
    category,
    price_min,
    price_max,
    sort_by = 'id',
    sort_order = 'asc',
    page = 1,
    pageSize = 66,
    color,
    material
  } = req.query;

  let where = [];
  let params = [];

  if (brand) {
    const brands = brand.split(',');
    if (brands.length > 1) {
      where.push(`brand IN (${brands.map(() => '?').join(',')})`);
      params.push(...brands);
    } else {
      where.push('brand = ?');
      params.push(brand);
    }
  }
  if (category) {
    const categories = category.split(',');
    if (categories.length > 1) {
      where.push(`category IN (${categories.map(() => '?').join(',')})`);
      params.push(...categories);
    } else {
      where.push('category = ?');
      params.push(category);
    }
  }
  if (color) {
    const colors = color.split(',');
    if (colors.length > 1) {
      where.push(`(${colors.map(() => 'LOWER(TRIM(color)) = ?').join(' OR ')})`);
      params.push(...colors.map(c => c.trim().toLowerCase()));
    } else {
      where.push('LOWER(TRIM(color)) = ?');
      params.push(color.trim().toLowerCase());
    }
  }
  if (material) {
    const materials = material.split(',');
    if (materials.length > 1) {
      where.push(`(${materials.map(() => 'LOWER(TRIM(material)) = ?').join(' OR ')})`);
      params.push(...materials.map(m => m.trim().toLowerCase()));
    } else {
      where.push('LOWER(TRIM(material)) = ?');
      params.push(material.trim().toLowerCase());
    }
  }
  if (price_min) {
    where.push('price >= ?');
    params.push(Number(price_min));
  }
  if (price_max) {
    where.push('price <= ?');
    params.push(Number(price_max));
  }

  // LIKE-based search for compatibility (without description)
  if (search) {
    where.push('(' +
      'name LIKE ? OR ' +
      'brand LIKE ? OR ' +
      'material LIKE ? OR ' +
      'category LIKE ?' +
    ')');
    params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  }

  const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';
  const allowedSort = ['id', 'name', 'price', 'brand', 'category'];
  const sortCol = allowedSort.includes(sort_by) ? sort_by : 'id';
  const sortDir = sort_order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
  const limit = Math.max(1, parseInt(pageSize));
  const offset = (Math.max(1, parseInt(page)) - 1) * limit;

  const countSql = `SELECT COUNT(*) as count FROM products_clean ${whereClause}`;
  db.query(countSql, params, (err, countResult) => {
    if (err) {
      console.error('SQL error in countSql:', err);
      return res.status(500).json({ error: err.code + ': ' + err.message });
    }
    const totalCount = countResult[0].count;

    const facetQueries = [
      new Promise((resolve, reject) => {
        db.query(`SELECT brand as value, COUNT(*) as count FROM products_clean ${whereClause} GROUP BY brand`, params, (err, rows) => {
          if (err) reject(err); else resolve(rows);
        });
      }),
      new Promise((resolve, reject) => {
        db.query(`SELECT category as value, COUNT(*) as count FROM products_clean ${whereClause} GROUP BY category`, params, (err, rows) => {
          if (err) reject(err); else resolve(rows);
        });
      }),
      new Promise((resolve, reject) => {
        db.query(`SELECT color as value, COUNT(*) as count FROM products_clean ${whereClause} GROUP BY color`, params, (err, rows) => {
          if (err) reject(err); else resolve(rows);
        });
      }),
      new Promise((resolve, reject) => {
        db.query(`SELECT material as value, COUNT(*) as count FROM products_clean ${whereClause} GROUP BY material`, params, (err, rows) => {
          if (err) reject(err); else resolve(rows);
        });
      })
    ];

    const allFacetQueries = [
      new Promise((resolve, reject) => {
        db.query('SELECT DISTINCT brand FROM products_clean', [], (err, rows) => {
          if (err) reject(err); else resolve(rows.map(r => r.brand));
        });
      }),
      new Promise((resolve, reject) => {
        db.query('SELECT DISTINCT category FROM products_clean', [], (err, rows) => {
          if (err) reject(err); else resolve(rows.map(r => r.category));
        });
      }),
      new Promise((resolve, reject) => {
        db.query('SELECT DISTINCT color FROM products_clean', [], (err, rows) => {
          if (err) reject(err); else resolve(rows.map(r => r.color));
        });
      }),
      new Promise((resolve, reject) => {
        db.query('SELECT DISTINCT material FROM products_clean', [], (err, rows) => {
          if (err) reject(err); else resolve(rows.map(r => r.material));
        });
      })
    ];

    Promise.all(facetQueries).then(([brands, categories, colors, materials]) => {
      Promise.all(allFacetQueries).then(([allBrands, allCategories, allColors, allMaterials]) => {
        const sql = `
          SELECT * FROM products_clean
          ${whereClause}
          ORDER BY ${sortCol} ${sortDir}
          LIMIT ? OFFSET ?
        `;
        db.query(sql, [...params, limit, offset], (err, results) => {
          if (err) {
            console.error('SQL error in main product query:', err);
            return res.status(500).json({ error: err.code + ': ' + err.message });
          }
          res.json({
            products: results,
            totalCount,
            brands,
            categories,
            colors,
            materials,
            allBrands,
            allCategories,
            allColors,
            allMaterials
          });
        });
      }).catch(err => {
        console.error('SQL error in allFacetQueries:', err);
        res.status(500).json({ error: 'Database error (all facets): ' + err.message });
      });
    }).catch(err => {
      console.error('SQL error in facetQueries:', err);
      res.status(500).json({ error: 'Database error (facets): ' + err.message });
    });
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

// Diagnostic endpoint to check table columns
app.get('/api/products/diagnose', (req, res) => {
  db.query('DESCRIBE products_clean', [], (err, results) => {
    if (err) {
      console.error('SQL error in diagnose:', err);
      return res.status(500).json({ error: err.code + ': ' + err.message });
    }
    res.json({ columns: results });
  });
});

// Start the server on port 5000
app.listen(5000, () => console.log('Server running on port 5000'));