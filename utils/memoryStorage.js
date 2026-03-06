// In-memory storage for development without MongoDB

let roles = [];
let users = [];
let categories = [];
let products = [];

// Counter for generating IDs
let roleIdCounter = 1;
let userIdCounter = 1;
let categoryIdCounter = 1;
let productIdCounter = 1;

module.exports = {
  // Roles
  roles: {
    getAll: () => roles.filter(r => !r.isDeleted),
    getById: (id) => roles.find(r => r._id === id && !r.isDeleted),
    create: (data) => {
      const newRole = {
        _id: String(roleIdCounter++),
        ...data,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      roles.push(newRole);
      return newRole;
    },
    update: (id, data) => {
      const index = roles.findIndex(r => r._id === id && !r.isDeleted);
      if (index !== -1) {
        roles[index] = {
          ...roles[index],
          ...data,
          updatedAt: new Date()
        };
        return roles[index];
      }
      return null;
    },
    delete: (id) => {
      const index = roles.findIndex(r => r._id === id);
      if (index !== -1) {
        roles[index].isDeleted = true;
        roles[index].updatedAt = new Date();
        return roles[index];
      }
      return null;
    }
  },

  // Users
  users: {
    getAll: () => {
      return users.filter(u => !u.isDeleted).map(u => ({
        ...u,
        role: u.role ? roles.find(r => r._id === u.role) : null
      }));
    },
    getById: (id) => {
      const user = users.find(u => u._id === id && !u.isDeleted);
      if (user) {
        return {
          ...user,
          role: user.role ? roles.find(r => r._id === user.role) : null
        };
      }
      return null;
    },
    create: (data) => {
      const newUser = {
        _id: String(userIdCounter++),
        username: data.username,
        password: data.password,
        email: data.email,
        fullName: data.fullName || "",
        avatarUrl: data.avatarUrl || "https://i.sstatic.net/l60Hf.png",
        status: data.status !== undefined ? data.status : false,
        role: data.role || null,
        loginCount: data.loginCount || 0,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      users.push(newUser);
      return newUser;
    },
    update: (id, data) => {
      const index = users.findIndex(u => u._id === id && !u.isDeleted);
      if (index !== -1) {
        users[index] = {
          ...users[index],
          ...data,
          updatedAt: new Date()
        };
        const user = users[index];
        return {
          ...user,
          role: user.role ? roles.find(r => r._id === user.role) : null
        };
      }
      return null;
    },
    delete: (id) => {
      const index = users.findIndex(u => u._id === id);
      if (index !== -1) {
        users[index].isDeleted = true;
        users[index].updatedAt = new Date();
        return users[index];
      }
      return null;
    },
    findByEmailAndUsername: (email, username) => {
      return users.find(u => u.email === email && u.username === username && !u.isDeleted);
    },
    updateStatus: (email, username, status) => {
      const user = users.find(u => u.email === email && u.username === username && !u.isDeleted);
      if (user) {
        user.status = status;
        user.updatedAt = new Date();
        return user;
      }
      return null;
    }
  },

  // Categories
  categories: {
    getAll: () => categories.filter(c => !c.isDeleted),
    getById: (id) => categories.find(c => c._id === id && !c.isDeleted),
    getBySlug: (slug) => categories.find(c => c.slug === slug),
    create: (data) => {
      const newCategory = {
        _id: String(categoryIdCounter++),
        ...data,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      categories.push(newCategory);
      return newCategory;
    },
    update: (id, data) => {
      const index = categories.findIndex(c => c._id === id && !c.isDeleted);
      if (index !== -1) {
        categories[index] = {
          ...categories[index],
          ...data,
          updatedAt: new Date()
        };
        return categories[index];
      }
      return null;
    },
    delete: (id) => {
      const index = categories.findIndex(c => c._id === id);
      if (index !== -1) {
        categories[index].isDeleted = true;
        categories[index].updatedAt = new Date();
        return categories[index];
      }
      return null;
    }
  },

  // Products
  products: {
    getAll: () => products.filter(p => !p.isDeleted),
    getById: (id) => products.find(p => p._id === id && !p.isDeleted),
    create: (data) => {
      const newProduct = {
        _id: String(productIdCounter++),
        ...data,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      products.push(newProduct);
      return newProduct;
    },
    update: (id, data) => {
      const index = products.findIndex(p => p._id === id && !p.isDeleted);
      if (index !== -1) {
        products[index] = {
          ...products[index],
          ...data,
          updatedAt: new Date()
        };
        return products[index];
      }
      return null;
    },
    delete: (id) => {
      const index = products.findIndex(p => p._id === id);
      if (index !== -1) {
        products[index].isDeleted = true;
        products[index].updatedAt = new Date();
        return products[index];
      }
      return null;
    }
  }
};
