import React from 'react';
import { getStrapiMedia } from '../../../../utils/index';

const Menu = ({ items }) => {
  const groupedItems = items.reduce((acc, item) => {
    const { attributes } = item;
    if (attributes) {
      const { type, isAvaliable } = attributes;

      if (isAvaliable) {
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(item);
      }
    }
    return acc;
  }, {});

  const hasAvailableItems = Object.keys(groupedItems).length > 0;

  return (
    <div className="my-4 flex flex-col">
      {hasAvailableItems ? (
        Object.keys(groupedItems).map((type) => (
          <div key={type} className="mb-8">
            <h3 className="text-xl font-bold mb-2">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </h3>
            <ul className="list-disc pl-5">
              {groupedItems[type].map((item, index) => {
                const { name, price, photo } = item.attributes;
                const photoUrl = photo?.data
                  ? getStrapiMedia(photo.data.attributes.url)
                  : 'default-image-url';

                return (
                  <li key={index} className="flex items-center mb-2">
                    <img
                      src={photoUrl}
                      alt={photo?.data?.attributes?.alternativeText || name}
                      className="w-20 h-20 object-cover rounded mr-3"
                    />
                    <span className="font-medium">{name}</span>
                    <span className="ml-auto">{`$${price}`}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-600 font-semibold py-8">
          No available menu items at the moment.
        </div>
      )}
    </div>
  );
};

export default Menu;
