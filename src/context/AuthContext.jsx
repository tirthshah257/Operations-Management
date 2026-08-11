import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { roleService } from '../services/roleService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('ems_current_user');
    return saved ? JSON.parse(saved) : userService.getUsers()[0] || null;
  });

  const [activeRole, setActiveRole] = useState(() => {
    return currentUser ? currentUser.role : 'Super Admin';
  });

  const [locationFilter, setLocationFilter] = useState('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ems_current_user', JSON.stringify(currentUser));
      setActiveRole(currentUser.role);
    }
  }, [currentUser]);

  const switchUserRole = (newRole) => {
    setActiveRole(newRole);
    if (currentUser) {
      const updated = { ...currentUser, role: newRole };
      setCurrentUser(updated);
    }
  };

  const loginDemo = (email) => {
    const users = userService.getUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase()) || users[0];
    setCurrentUser(found);
    setActiveRole(found.role);
    return found;
  };

  const logoutDemo = () => {
    localStorage.removeItem('ems_current_user');
    setCurrentUser(null);
  };

  const hasPermission = (permission) => {
    if (activeRole === 'Super Admin') return true;
    const roles = roleService.getRoles();
    const currentRoleObj = roles.find(r => r.name === activeRole);
    if (!currentRoleObj) return true;
    return currentRoleObj.permissions.includes('all') || currentRoleObj.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        activeRole,
        switchUserRole,
        loginDemo,
        logoutDemo,
        hasPermission,
        locationFilter,
        setLocationFilter,
        departmentFilter,
        setDepartmentFilter
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
