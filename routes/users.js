var express = require('express');
var router = express.Router();
const storage = require('../utils/memoryStorage');

// GET all users (không lấy các user đã xoá mềm)
router.get('/', function (req, res, next) {
  try {
    let data = storage.users.getAll();
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// GET user by id
router.get('/:id', function (req, res, next) {
  try {
    let result = storage.users.getById(req.params.id);
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

// CREATE new user
router.post('/', function (req, res, next) {
  try {
    // Check if username or email already exists
    const allUsers = storage.users.getAll();
    const existingUsername = allUsers.find(u => u.username === req.body.username);
    const existingEmail = allUsers.find(u => u.email === req.body.email);
    
    if (existingUsername) {
      return res.status(400).send({ message: "Username already exists" });
    }
    if (existingEmail) {
      return res.status(400).send({ message: "Email already exists" });
    }

    let newObj = storage.users.create({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      status: req.body.status,
      role: req.body.role,
      loginCount: req.body.loginCount
    });
    res.status(201).send(newObj);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
})

// UPDATE user
router.put('/:id', function (req, res, next) {
  try {
    let result = storage.users.update(req.params.id, req.body);
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

// DELETE user (soft delete)
router.delete('/:id', function (req, res, next) {
  try {
    let result = storage.users.delete(req.params.id);
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

// ENABLE user - set status to true
router.post('/enable', function (req, res, next) {
  try {
    const { email, username } = req.body;
    
    if (!email || !username) {
      return res.status(400).send({
        message: "Email and username are required"
      })
    }

    let user = storage.users.updateStatus(email, username, true);

    if (user) {
      res.status(200).send({
        message: "User enabled successfully",
        data: user
      })
    } else {
      res.status(404).send({
        message: "User not found or information is incorrect"
      })
    }
  } catch (error) {
    res.status(500).send({
      message: error.message
    })
  }
})

// DISABLE user - set status to false
router.post('/disable', function (req, res, next) {
  try {
    const { email, username } = req.body;
    
    if (!email || !username) {
      return res.status(400).send({
        message: "Email and username are required"
      })
    }

    let user = storage.users.updateStatus(email, username, false);

    if (user) {
      res.status(200).send({
        message: "User disabled successfully",
        data: user
      })
    } else {
      res.status(404).send({
        message: "User not found or information is incorrect"
      })
    }
  } catch (error) {
    res.status(500).send({
      message: error.message
    })
  }
})

module.exports = router;
