import apiService from './apiService';

// Local user database for testing
// WARNING: These are demo credentials only. In production, use environment variables or a secure configuration.
const LOCAL_USERS = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123', // Demo only - use proper password hashing in production
    email: 'admin@rmcbilling.com',
    role: 'admin',
    name: 'Admin User',
  },
  {
    id: 2,
    username: 'user',
    password: 'user123', // Demo only - use proper password hashing in production
    email: 'user@rmcbilling.com',
    role: 'user',
    name: 'Regular User',
  },
];

// Simulate a token generation
const generateToken = (user) => {
  return `local_token_${user.id}_${Date.now()}`;
};

// Local authentication (for testing)
const localAuth = async (username, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = LOCAL_USERS.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        const token = generateToken(user);
        resolve({
          user: userWithoutPassword,
          token,
        });
      } else {
        reject(new Error('Invalid username or password'));
      }
    }, 500); // Simulate network delay
  });
};

// Lambda authentication (for production)
const lambdaAuth = async (username, password) => {
  try {
    const response = await apiService.post('/auth/login', {
      username,
      password,
    });
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Authentication failed');
  }
};

// Main authentication service
const authService = {
  login: async (username, password, useLocal = true) => {
    if (useLocal) {
      // Use local authentication for testing
      return await localAuth(username, password);
    } else {
      // Use Lambda authentication for production
      return await lambdaAuth(username, password);
    }
  },

  logout: async () => {
    // If using Lambda, call the logout endpoint
    try {
      await apiService.post('/auth/logout');
    } catch {
      // Ignore logout errors, just clear local storage
    }
  },

  validateToken: async () => {
    try {
      // Token validation is handled by apiService interceptor
      const response = await apiService.get('/auth/validate');
      return response;
    } catch {
      return null;
    }
  },
};

export default authService;
