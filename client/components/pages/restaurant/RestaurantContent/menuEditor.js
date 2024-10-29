import React from 'react';

const MenuEditor = ({ items, onEdit }) => {
  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
        <thead>
          <tr>
            <th className="py-3 px-5 text-left bg-gray-100 text-gray-600 font-semibold uppercase tracking-wider">
              
            </th>
            <th className="py-3 px-5 text-left bg-gray-100 text-gray-600 font-semibold uppercase tracking-wider">
              Photo
            </th>
            <th className="py-3 px-5 text-left bg-gray-100 text-gray-600 font-semibold uppercase tracking-wider">
              Type
            </th>
            <th className="py-3 px-5 text-left bg-gray-100 text-gray-600 font-semibold uppercase tracking-wider">
              Name
            </th>
            <th className="py-3 px-5 text-left bg-gray-100 text-gray-600 font-semibold uppercase tracking-wider">
              Price
            </th><th className="py-3 px-5 text-left bg-gray-100 text-gray-600 font-semibold uppercase tracking-wider">
            </th><th className="py-3 px-5 text-left bg-gray-100 text-gray-600 font-semibold uppercase tracking-wider">
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="py-4 px-5">
                <button
                  onClick={() => updatePhoto(item)}
                  className="py-2 px-4 bg-secondary hover:bg-secondary-darker text-white text-sm font-semibold rounded-md shadow-sm"
                >
                  Change Photo
                </button>
              </td>
              <td className="py-4 px-5">
                <img
                  src={item.photo}
                  alt={item.name}
                  className="h-16 w-16 object-cover rounded-lg"
                />
              </td>
              <td className="py-4 px-5">
                <select
                  defaultValue={item.type}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
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
                  defaultValue={item.name}
                  placeholder={item.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                />
              </td>
              <td className="py-4 px-5">
                <input
                  type="text"
                  defaultValue={item.price}
                  placeholder={item.price}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                />
              </td>
              <td className="py-4 px-5">
                <button
                  onClick={() => onUpdate(item)}
                  className="py-2 px-4 bg-secondary hover:bg-secondary-darker text-white text-sm font-semibold rounded-md shadow-sm"
                >
                  Update
                </button>
              </td>
              <td className="py-4 px-5">
                <button
                  onClick={() => onDelete(item)}
                  className="py-2 px-4 bg-primary hover:bg-primary-darker text-white text-sm font-semibold rounded-md shadow-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MenuEditor;
