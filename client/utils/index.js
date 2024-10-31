var pluralize = require('pluralize');

export function getStrapiMedia(url) {
  if (url == null) {
    return null;
  }
  if (url.startsWith('http') || url.startsWith('//')) {
    return url;
  }
  return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'}${url}`;
}

export function getStrapiURL(path) {
  return `${
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'
  }/api${path}`;
}

export function handleRedirection(preview, custom) {
  if (preview) {
    return {
      redirect: {
        destination: `/api/exit-preview`,
        permanent: false,
      },
    };
  } else if (custom) {
    return {
      redirect: {
        destination: `/${custom}`,
        permanent: false,
      },
    };
  } else {
    return {
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };
  }
}

export function getData(slug, locale, apiID, kind, preview) {
  const previewParams = preview
    ? '&publicationState=preview&published_at_null=true'
    : '';

  if (kind == 'collectionType') {
    let prefix = `/${pluralize(apiID)}`;
    if (apiID == 'page') {
      prefix = ``;
    } else if (apiID == 'article') {
      prefix = `/blog`;
    }
    const slugToReturn = `${prefix}/${slug}?lang=${locale}`;
    const apiUrl = `/${pluralize(
      apiID
    )}?filters[slug][$eq]=${slug}&locale=${locale}${previewParams}&populate[blocks][populate]=members.picture,header,buttons.link,faq,featuresCheck,cards,pricingCards.perks,articles,restaurants,author.picture,images,cards.image,image&populate=localizations&populate[seo][populate]=metaSocial.image`;

    return {
      data: getStrapiURL(apiUrl),
      slug: slugToReturn,
    };
  } else {
    const apiUrl = `/${apiID}?locale=${locale}${previewParams}&populate[blocks][populate]=*,buttons.link&populate=localizations&populate[header]=*&populate[seo]=metaSocial`;

    if (apiID.includes('-page')) {
      const slugToReturn =
        apiID == 'blog-page'
          ? `/${apiID.replace('-page', '')}?lang=${locale}`
          : `/${apiID.replace('-page', 's')}?lang=${locale}`;
      return {
        data: getStrapiURL(apiUrl),
        slug: slugToReturn,
      };
    } else {
      return {
        data: getStrapiURL(apiUrl),
        slug: `/${apiID}?lang=${locale}`,
      };
    }
  }
}

export async function getRestaurants(key) {
  const categoryName = key.queryKey[1].category;
  const placeName = key.queryKey[2].place;
  const localeCode = key.queryKey[3].locale;
  const pageNumber = key.queryKey[4].page;
  const perPage = key.queryKey[5].perPage;
  const start = +pageNumber === 1 ? 0 : (+pageNumber - 1) * perPage;

  let baseUrl = getStrapiURL(
    `/restaurants?pagination[limit]=${perPage}&pagination[start]=${start}&pagination[withCount]=true&populate=images,category,place,information,seo`
  );

  if (categoryName) {
    baseUrl = `${baseUrl}&filters[category][name][$eq]=${categoryName}`;
  }

  if (placeName) {
    baseUrl = `${baseUrl}&filters[place][name][$eq]=${placeName}`;
  }

  if (localeCode) {
    baseUrl = `${baseUrl}&locale=${localeCode}`;
  }

  const res = await fetch(baseUrl);
  const restaurants = await res.json();

  return {
    restaurants: restaurants.data,
    count: restaurants.meta.pagination.total,
  };
}

export async function getArticles(key) {
  const categoryName = key.queryKey[1].category;
  const localeCode = key.queryKey[2].locale;
  const pageNumber = key.queryKey[3].page;
  const perPage = key.queryKey[4].perPage;

  const start = +pageNumber === 1 ? 0 : (+pageNumber - 1) * perPage;

  let baseUrl = getStrapiURL(
    `/articles?pagination[limit]=${perPage}&pagination[start]=${start}&pagination[withCount]=true&populate=image,category,author,seo`
  );

  if (categoryName) {
    baseUrl = `${baseUrl}&filters[category][name][$eq]=${categoryName}`;
  }

  if (localeCode) {
    baseUrl = `${baseUrl}&locale=${localeCode}`;
  }

  const res = await fetch(baseUrl);
  const articles = await res.json();

  return { articles: articles.data, count: articles.meta.pagination.total };
}

export async function createMenu(params) {
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

export async function connectRelation(menuId, restaurantsId) {
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

export async function updateMenu(menuID, items) {
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

export async function deleteMenu(menuID) {
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

export async function changePhoto(file, itemID) {
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
      const deletePhotoResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/files/${existingPhotoId}`, {
        method: 'DELETE',
      });
      if (!deletePhotoResponse.ok) {
        throw new Error('Failed to delete old photo. Status: ' + deletePhotoResponse.status);
      }
    }

    // 3. Upload the new photo
    const formData = new FormData();
    formData.append('files', file);

    const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
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
          photo: {
            data: {
              id: newPhotoId,
            },
          },
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
    throw error; // Rethrow the error for further handling
  }
}





