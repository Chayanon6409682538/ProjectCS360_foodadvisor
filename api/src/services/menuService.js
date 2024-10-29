// Replace with your Strapi domain
const API_URL = 'http://<YOUR_STRAPI_DOMAIN>/api/menu-items'; 

// Get all menu
export const getAllMenuItems = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch menu items');
  }
  return await response.json();
};

// Get single menu
export const getMenuItemById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch menu item');
  }
  return await response.json();
};

// Create new menu
export const createMenuItem = async (menuItem) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: menuItem }), // Wrap data in a "data" object
  });
  
  if (!response.ok) {
    throw new Error('Failed to create menu item');
  }
  return await response.json();
};

// Update menu
export const updateMenuItem = async (id, menuItem) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: menuItem }), // Wrap data in a "data" object
  });
  
  if (!response.ok) {
    throw new Error('Failed to update menu item');
  }
  return await response.json();
};

// Delete menu 
export const deleteMenuItem = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete menu item');
  }
  return await response.json();
};
