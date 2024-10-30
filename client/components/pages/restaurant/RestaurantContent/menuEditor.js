import React from 'react';

const MenuEditor = ({ items, onEdit }) => {
  // Group items by type, filtering only available ones
  const groupedItems = items.reduce((acc, item) => {
    const { attributes } = item;
    if (attributes && attributes.isAvaliable) {
      const { type } = attributes;
      if (!acc[type]) acc[type] = [];
      acc[type].push(item);
    }
    return acc;
  }, {});

  const hasAvailableItems = Object.keys(groupedItems).length > 0;

  const handleAddNewItem = () => {
    // Logic to add a new menu item
  };

  const onDelete = (index, type) => {
    onEdit((prevItems) =>
      prevItems.filter((item, i) => i !== index || item.attributes.type !== type)
    );
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
          {hasAvailableItems ? (
            Object.keys(groupedItems).map((type) => (
              <React.Fragment key={type}>
                <tr>
                  <td colSpan="7" className="text-left font-bold py-4 px-5 bg-gray-200">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </td>
                </tr>
                {groupedItems[type].map((item, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-4 px-5">
                      <button
                        onClick={() => updatePhoto(item)}
                        className="py-2 px-4 bg-secondary text-white font-semibold rounded-md"
                      >
                        Change Photo
                      </button>
                    </td>
                    <td className="py-4 px-5">
                      <img
                        src={item.attributes.photo}
                        alt={item.attributes.name}
                        className="h-16 w-16 object-cover rounded-lg"
                      />
                    </td>
                    <td className="py-4 px-5">
                      <select
                        defaultValue={item.attributes.type}
                        className="w-full border-gray-300 rounded-md"
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
                        defaultValue={item.attributes.name}
                        className="w-full border-gray-300 rounded-md"
                      />
                    </td>
                    <td className="py-4 px-5">
                      <input
                        type="text"
                        defaultValue={item.attributes.price}
                        className="w-full border-gray-300 rounded-md"
                      />
                    </td>
                    <td className="py-4 px-5">
                      <button
                        onClick={() => updateDetail(item)}
                        className="py-2 px-4 bg-secondary text-white font-semibold rounded-md"
                      >
                        Update
                      </button>
                    </td>
                    <td className="py-4 px-5">
                      <button
                        onClick={() => onDelete(index, type)}
                        className="py-2 px-4 bg-primary text-white font-semibold rounded-md"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center text-gray-600 py-8 font-semibold">
                No available menu items at the moment.
              </td>
            </tr>
          )}
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
