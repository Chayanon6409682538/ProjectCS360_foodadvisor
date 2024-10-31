async function createMenu(params) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create menu item');
      }
  
      const newMenu = await response.json();
      return newMenu;
    } catch (error) {
      console.error('Error creating menu:', error);
      throw error;
    }
  }
  
async function connectRelation(menuId, restaurantsId) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/${restaurantsId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            menus: {
              connect: [menuId]
            }
          }
        }),
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('Error details:', errorResponse);
        throw new Error('Failed to connect relation');
      }
  
      const updatedMenu = await response.json();
      return updatedMenu;
    } catch (error) {
      console.error('Error connecting relation:', error);
      throw error;
    }
  }
  
async function updateMenu(menuID, items) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menus/${menuID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(items),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update menu item');
      }
  
      const newMenu = await response.json();
      return newMenu;
    } catch (error) {
      console.error('Error updating menu:', error);
      throw error;
    }
  }
  
async function deleteMenu(menuID) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menus/${menuID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete menu item');
      }
  
      const deletedMenu = await response.json();
      return deletedMenu;
    } catch (error) {
      console.error('Error deleting menu:', error);
      throw error;
    }
  }
  
async function changePhoto(file, itemID) {
    console.log('File to upload:', file);
  
    try {
      // 1. Retrieve the current menu item to check for an existing photo
      const getItemResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menus/${itemID}?populate=photo`);
  
      if (!getItemResponse.ok) {
        throw new Error('Failed to retrieve menu item. Status: ' + getItemResponse.status);
      }
  
      const itemData = await getItemResponse.json();
      const existingPhotoId = itemData.data?.attributes?.photo?.data?.id;
  
      // 2. Delete the old photo if it exists
      if (existingPhotoId) {
        const deletePhotoResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload/files/${existingPhotoId}`, {
          method: 'DELETE',
        });
  
        if (!deletePhotoResponse.ok) {
          throw new Error('Failed to delete old photo. Status: ' + deletePhotoResponse.status);
        }
      }
  
      // 3. Upload the new photo
      const formData = new FormData();
      formData.append('files', file);
  
      
  
      const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });
  
      if (!uploadResponse.ok) {
        throw new Error('Failed to upload new photo. Status: ' + uploadResponse.status);
      }
  
      const uploadedFiles = await uploadResponse.json();
      const newPhotoId = uploadedFiles[0]?.id;
  
      if (!newPhotoId) {
        throw new Error('Failed to retrieve uploaded photo ID');
      }
  
      // 4. Update the menu item with the new photo ID
      const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menus/${itemID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            photo: newPhotoId, // Use newPhotoId directly
          },
        }),
      });
  
      if (!updateResponse.ok) {
        throw new Error('Failed to update menu item with new photo. Status: ' + updateResponse.status);
      }
  
      const updatedItem = await updateResponse.json();
      return updatedItem;
  
    } catch (error) {
      console.error('Error changing photo:', error);
      throw error;
    }
  }
  module.exports = { createMenu, connectRelation, updateMenu, deleteMenu, changePhoto};
