import User from '../models/User.js';

export const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Get user from database to fetch role
      const user = await User.findById(req.userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if user's role is in allowed roles
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ 
          message: 'Access denied. Admin privileges required.',
          userRole: user.role,
          requiredRoles: allowedRoles
        });
      }

      // Attach user to request for later use
      req.user = user;
      next();
    } catch (error) {
      res.status(500).json({ message: 'Server error during authorization' });
    }
  };
};

// Specific role checkers
export const isAdmin = authorizeRoles('admin', 'super_admin');
export const isSuperAdmin = authorizeRoles('super_admin');
