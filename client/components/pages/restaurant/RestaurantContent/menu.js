import React from 'react';

const Menu = ({ items }) => {
  const groupedItems = items.reduce((acc, item) => {
    const { type } = item;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(item);
    return acc;
  }, {});

  return (
    <div className="my-4 flex flex-col">
      {Object.keys(groupedItems).map((type) => (
        <div key={type} className="mb-8">
          <h3 className="text-xl font-bold mb-2">
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </h3>
          <ul className="list-disc pl-5">
            {groupedItems[type].map((item, index) => (
              <li key={index} className="flex items-center mb-2">
                <img
                  src={item.photo}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded mr-3"
                />
                <span className="font-medium">{item.name}</span>
                <span className="ml-auto">{item.price}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Menu;
