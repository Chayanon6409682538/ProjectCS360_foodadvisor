import React from 'react';
import { getStrapiMedia, createMenu, connectRelation, updateMenu, deleteMenu } from '../../../../utils/index';

const MenuEditor = ({ items, onEdit, restaurantId }) => {

  const handleAddNewItem = () => {
    const newMenuItem = {
      data: {
        name: 'New Menu',
        price: 0.00,
        type: 'Main Menu',
        isAvaliable: false,
        photo: {
          data: {
            id: 1 // Assuming the photo already exists in your Strapi media library
          }
        }
      }
    };
    
    createMenu(newMenuItem)
      .then((createdMenu) => {
        console.log('Menu item created:', createdMenu);
        const newMenuId = createdMenu.data.id;
        onEdit((prevItems) => [
          ...prevItems,
          {
            ...createdMenu.data,
            attributes: {
              ...createdMenu.data.attributes,
              isAvaliable: false,
            },
          },
        ]);
        return connectRelation(newMenuId, restaurantId);
      })
      .then((connectRelation) => {
        console.log('Relation connected:', connectRelation);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const updateDetail = (item, index) => {
    const updatedItem = {
      data: {
        name: document.getElementById(`name-${index}`).value,
        price: parseFloat(document.getElementById(`price-${index}`).value),
        type: document.getElementById(`type-${index}`).value,
        isAvaliable: document.getElementById(`availability-${index}`).value === 'true',
      },
    };
  
    updateMenu(item.id, updatedItem)
      .then((updatedData) => {
        console.log('Menu item updated:', updatedData);
        onEdit((prevItems) => {
          const updatedItems = [...prevItems];
          updatedItems[index] = {
            ...updatedItems[index],
            attributes: updatedData.data.attributes,
          };
          return updatedItems;
        });
      })
      .catch((error) => {
        console.error('Error updating item:', error);
      });
  };
  

  const onDelete = (index) => {
    const itemToDelete = items[index];
    const itemId = itemToDelete.id;
  
    deleteMenu(itemId)
      .then(() => {
        onEdit((prevItems) => prevItems.filter((_, i) => i !== index));
        console.log(`Menu item with ID ${itemId} deleted successfully`);
      })
      .catch((error) => {
        console.error('Error deleting menu item:', error);
      });
  };
  

  const handleAvailabilityChange = (index, isAvailable) => {
    onEdit((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index].attributes.isAvaliable = isAvailable;
      return updatedItems;
    });
  };

  return (
    <div className="overflow-x-auto mt-6">
      {items.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead>
            <tr>
              <th className="py-3 px-5 bg-gray-100 font-semibold uppercase"></th>
              <th className="py-3 px-5 bg-gray-100 font-semibold uppercase">Photo</th>
              <th className="py-3 px-5 bg-gray-100 font-semibold uppercase">Type</th>
              <th className="py-3 px-5 bg-gray-100 font-semibold uppercase">Name</th>
              <th className="py-3 px-5 bg-gray-100 font-semibold uppercase">Price</th>
              <th className="py-3 px-5 bg-gray-100 font-semibold uppercase">Is Available</th>
              <th className="py-3 px-5 bg-gray-100 font-semibold uppercase"></th>
              <th className="py-3 px-5 bg-gray-100 font-semibold uppercase"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const { attributes } = item;
              const photoUrl = attributes.photo?.data
                ? getStrapiMedia(attributes.photo.data.attributes.url)
                : 'default-image-url';

              return (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-4 px-5">
                    <button
                      onClick={() => updatePhoto(item)} // Assuming updatePhoto is defined elsewhere
                      className="py-2 px-4 bg-secondary text-white font-semibold rounded-md"
                    >
                      Change Photo
                    </button>
                  </td>
                  <td className="py-4 px-5">
                    <img
                      src={photoUrl}
                      alt={attributes.photo?.data?.attributes?.alternativeText || attributes.name}
                      className="h-16 w-16 object-cover rounded-lg"
                    />
                  </td>
                  <td className="py-4 px-5">
                    <select
                      id={`type-${index}`}
                      defaultValue={attributes.type}
                      className="w-full border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring focus:ring-blue-300"
                    >
                      <option value="Appetizer">Appetizer</option>
                      <option value="Main Menu">Main Menu</option>
                      <option value="Dessert">Dessert</option>
                      <option value="Drinks">Drinks</option>
                    </select>
                  </td>
                  <td className="py-4 px-5">
                    <input
                      type="text"
                      id={`name-${index}`}
                      defaultValue={attributes.name}
                      className="w-full border border-gray-300 rounded-md bg-gray-100 text-gray-700 px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                      placeholder="Enter name"
                    />
                  </td>
                  <td className="py-4 px-5">
                    <input
                      type="text"
                      id={`price-${index}`}
                      defaultValue={attributes.price}
                      className="w-full border border-gray-300 rounded-md bg-gray-100 text-gray-700 px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                      placeholder="Enter price"
                    />
                  </td>
                  <td className="py-4 px-5">
                    <select
                      id={`availability-${index}`}
                      value={attributes.isAvaliable}
                      onChange={(e) => handleAvailabilityChange(index, e.target.value === 'true')}
                      className="w-full border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring focus:ring-blue-300"
                    >
                      <option value="true">Available</option>
                      <option value="false">Not Available</option>
                    </select>
                  </td>
                  <td className="py-4 px-5">
                    <button
                      onClick={() => updateDetail(item, index)}
                      className="py-2 px-4 bg-secondary text-white font-semibold rounded-md"
                    >
                      Update
                    </button>
                  </td>
                  <td className="py-4 px-5">
                    <button
                      onClick={() => onDelete(index)}
                      className="py-2 px-4 bg-primary text-white font-semibold rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            <tr>
              <td colSpan="8" className="text-center py-4">
                <button
                  onClick={handleAddNewItem}
                  className="py-2 px-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-md"
                >
                  New Menu
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <div className="flex flex-col text-center text-gray-600 font-semibold py-8">
          No menu items available.
          <button
            onClick={handleAddNewItem}
            className="py-2 px-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-md w-[120px] self-center mt-4"
          >
            New Menu
          </button>
        </div>
      )}
    </div>
  );  
};

export default MenuEditor;
