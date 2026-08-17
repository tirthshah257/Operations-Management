import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { roleService } from '../services/roleService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ems_current_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Verify user still exists in userService
        const users = userService.getUsers();
        const found = users.find(u => u.id === parsed.id || u.email === parsed.email);
        if (found) return found;
      }
    } catch (e) {
      console.error('Error loading current user', e);
    }
    return userService.getUsers()[0] || null;
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

  // Switch to a specific user by ID or Email
  const switchActiveUser = (userIdOrEmail) => {
    const users = userService.getUsers();
    const target = users.find(
      u => u.id === userIdOrEmail || u.email.toLowerCase() === String(userIdOrEmail).toLowerCase()
    );

    if (target) {
      setCurrentUser(target);
      setActiveRole(target.role);
      localStorage.setItem('ems_current_user', JSON.stringify(target));
      return target;
    }
    return null;
  };

  // Switch role: preferably switch to a real user matching that role, or update current user's role
  const switchUserRole = (newRole) => {
    const users = userService.getUsers();
    const matchingUser = users.find(u => u.role === newRole);

    if (matchingUser) {
      setCurrentUser(matchingUser);
      setActiveRole(matchingUser.role);
      localStorage.setItem('ems_current_user', JSON.stringify(matchingUser));
    } else if (currentUser) {
      const updated = userService.updateUser(currentUser.id, { role: newRole }) || { ...currentUser, role: newRole };
      setCurrentUser(updated);
      setActiveRole(newRole);
      localStorage.setItem('ems_current_user', JSON.stringify(updated));
    } else {
      setActiveRole(newRole);
    }
  };

  const loginDemo = (email) => {
    return switchActiveUser(email) || (userService.getUsers()[0] || null);
  };

  const logoutDemo = () => {
    localStorage.removeItem('ems_current_user');
    const defaultUser = userService.getUsers()[0] || null;
    setCurrentUser(defaultUser);
    if (defaultUser) setActiveRole(defaultUser.role);
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
        switchActiveUser,
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
