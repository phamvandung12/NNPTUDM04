var express = require('express');
var router = express.Router();
let slugify = require('slugify')
const storage = require('../utils/memoryStorage');

// GET all categories (không lấy đã xoá mềm)
router.get('/', function (req, res, next) {
  try {
    let data = storage.categories.getAll();
    res.send(data);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// GET category by slug
router.get('/slug/:slug', function (req, res, next) {
  try {
    let slug = req.params.slug;
    let result = storage.categories.getBySlug(slug);
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

// GET category by id
router.get('/:id', function (req, res, next) {
  try {
    let result = storage.categories.getById(req.params.id);
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

// CREATE new category
router.post('/', function (req, res, next) {
  try {
    let newObj = storage.categories.create({
      name: req.body.name,
      slug: slugify(req.body.name, {
        replacement: '-', lower: true, locale: 'vi',
      }),
      description: req.body.description || "",
      images: req.body.images || ["https://smithcodistributing.com/wp-content/themes/hello-elementor/assets/default_product.png"]
    });
    res.status(201).send(newObj);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
})

// UPDATE category
router.put('/:id', function (req, res, next) {
  try {
    let result = storage.categories.update(req.params.id, req.body);
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

// DELETE category (soft delete)
router.delete('/:id', function (req, res, next) {
  try {
    let result = storage.categories.delete(req.params.id);
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
