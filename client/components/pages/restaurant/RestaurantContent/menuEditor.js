import React from 'react';
import { getStrapiMedia, createMenu } from '../../../../utils/index';

const MenuEditor = ({ items, onEdit }) => {
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
      })
      .catch((error) => {
        console.error('Error creating menu item:', error);
      });
    
  };

  const onDelete = (index) => {
    // Filter out the item based on its index
    onEdit((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
        <thead>
          <tr>
            <th className="py-3 px-5 bg-gray-100 font-semibold uppercase"></th>
            <th className="py-3 px-5 bg-gray-100 font-semibold uppercase">Photo</th>
            <th className="py-3 px-5 bg-gray-100 font-semibold uppercase">Type</th>
            <th className="py-3 px-5 bg-gray-100 font-semibold uppercase">Name</th>
            <th className="py-3 px-5 bg-gray-100 font-semibold uppercase">Price</th>
            <th className="py-3 px-5 bg-gray-100 font-semibold uppercase"></th>
            <th className="py-3 px-5 bg-gray-100 font-semibold uppercase"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const { attributes } = item;
            const photoUrl = attributes.photo?.data
              ? getStrapiMedia(attributes.photo.data.attributes.url)
              : 'default-image-url'; // Use a default image URL if none exists

            return (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-4 px-5">
                  <button
                    onClick={() => updatePhoto(item)} // Add your updatePhoto logic
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
                    defaultValue={attributes.name}
                    className="w-full border border-gray-300 rounded-md bg-gray-100 text-gray-700 px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Enter name"
                  />
                </td>
                <td className="py-4 px-5">
                  <input
                    type="text"
                    defaultValue={attributes.price}
                    className="w-full border border-gray-300 rounded-md bg-gray-100 text-gray-700 px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Enter price"
                  />
                </td>
                <td className="py-4 px-5">
                  <button
                    onClick={() => updateDetail(item)} // Add your updateDetail logic
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
            <td colSpan="7" className="text-center py-4">
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
    </div>
  );
};

export default MenuEditor;
