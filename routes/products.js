var express = require('express');
var router = express.Router();
let slugify = require('slugify')
const storage = require('../utils/memoryStorage');

// GET all products with filters
router.get('/', function (req, res, next) {
  try {
    let titleQ = req.query.title ? req.query.title : '';
    let maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : 1E4;
    let minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : 0;
    
    let data = storage.products.getAll();
    let result = data.filter(function (e) {
      return e.title.toLowerCase().includes(titleQ.toLowerCase())
        && e.price > minPrice
        && e.price < maxPrice
    })
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// GET product by slug
router.get('/slug/:slug', function (req, res, next) {
  try {
    let slug = req.params.slug;
    let allProducts = storage.products.getAll();
    let result = allProducts.find(p => p.slug === slug);
    if (result) {
      res.status(200).send(result)
    } else {
      res.status(404).send({
        message: "SLUG NOT FOUND"
      })
    }
  } catch (error) {
    res.status(404).send({
      message: "SLUG NOT FOUND"
    })
  }
});

// GET product by id
router.get('/:id', function (req, res, next) {
  try {
    let result = storage.products.getById(req.params.id);
    if (result) {
      res.status(200).send(result)
    } else {
      res.status(404).send({
        message: "ID NOT FOUND"
      })
    }
  } catch (error) {
    res.status(404).send({
      message: "ID NOT FOUND"
    })
  }
});

// CREATE new product
router.post('/', function (req, res, next) {
  try {
    let newObj = storage.products.create({
      title: req.body.title,
      slug: slugify(req.body.title, {
        replacement: '-', lower: true, locale: 'vi',
      }),
      price: req.body.price,
      description: req.body.description || "",
      category: req.body.categoryId,
      images: req.body.images || []
    });
    res.status(201).send(newObj);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
})

// UPDATE product
router.put('/:id', function (req, res, next) {
  try {
    let result = storage.products.update(req.params.id, req.body);
    if (result) {
      res.status(200).send(result)
    } else {
      res.status(404).send({
        message: "ID NOT FOUND"
      })
    }
  } catch (error) {
    res.status(404).send({
      message: "ID NOT FOUND"
    })
  }
})

// DELETE product (soft delete)
router.delete('/:id', function (req, res, next) {
  try {
    let result = storage.products.delete(req.params.id);
    if (result) {
      res.status(200).send({
        message: "Deleted successfully",
        data: result
      })
    } else {
      res.status(404).send({
        message: "ID NOT FOUND"
      })
    }
  } catch (error) {
    res.status(404).send({
      message: "ID NOT FOUND"
    })
  }
})

module.exports = router;
