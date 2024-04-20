// auth.ts
export const isAuthenticated = () => {
    // Your authentication logic here, e.g., check for a valid token
    const token = localStorage.getItem('token');
    return !!token;
  };