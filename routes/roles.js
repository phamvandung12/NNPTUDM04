var express = require('express');
var router = express.Router();
const storage = require('../utils/memoryStorage');

// GET all roles (không lấy các role đã xoá mềm)
router.get('/', function (req, res, next) {
  try {
    let data = storage.roles.getAll();
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// GET role by id
router.get('/:id', function (req, res, next) {
  try {
    let result = storage.roles.getById(req.params.id);
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

// CREATE new role
router.post('/', function (req, res, next) {
  try {
    // Check if name already exists
    const existing = storage.roles.getAll().find(r => r.name === req.body.name);
    if (existing) {
      return res.status(400).send({ message: "Role name already exists" });
    }

    let newObj = storage.roles.create({
      name: req.body.name,
      description: req.body.description || ""
    });
    res.status(201).send(newObj);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
})

// UPDATE role
router.put('/:id', function (req, res, next) {
  try {
    let result = storage.roles.update(req.params.id, req.body);
    if (result) {
      res.status(200).send(result)
    } else {
      res.status(404).send({
        message: "ID NOT FOUND"
      })
    }
  } catch (error) {
    res.status(400).send({
      message: error.message
    })
  }
})

// DELETE role (soft delete)
router.delete('/:id', function (req, res, next) {
  try {
    let result = storage.roles.delete(req.params.id);
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
