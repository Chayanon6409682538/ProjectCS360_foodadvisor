const {
  createMenu,
  connectRelation,
  updateMenu,
  deleteMenu,
  changePhoto,
} = require('../services/menu-services');

const FormData = require('form-data');

// Mock the File object
global.File = class {
  constructor(fileBits, fileName, options) {
    this.fileBits = fileBits;
    this.fileName = fileName;
    this.options = options || {};
  }
};

//Mock FormData
global.FormData = class FormDataMock {
  constructor() {
    this.append = jest.fn();
  }
};

describe('Menu Services Tests', () => {
  // Mocking the global fetch and console.error
  beforeAll(() => {
    global.fetch = jest.fn();
    jest.spyOn(console, 'error').mockImplementation(() => {}); // Mock console.error
  });

  afterAll(() => {
    jest.restoreAllMocks(); // Restore original fetch and console.error after tests
  });

  describe('createMenu', () => {
    it('should create a menu item and return it', async () => {
      const mockResponse = {
        data: {
          id: 1,
          name: 'New Menu',
          price: 0.00,
          type: 'Main Menu',
          isAvailable: false,
          photo: {
            data: {
              id: 1,
            },
          },
        },
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const params = {
        name: 'New Menu',
        price: 0.00,
        type: 'Main Menu',
        isAvailable: false,
        photo: {
          data: {
            id: 1,
          },
        },
      };

      const result = await createMenu(params);

      expect(fetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/api/menus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error when the response is not ok', async () => {
      fetch.mockResolvedValueOnce({ ok: false });

      await expect(createMenu({ name: 'Pizza', price: 10 })).rejects.toThrow('Failed to create menu item');
    });
    
  });

  describe('connectRelation', () => {
    it('should connect menu to restaurant and return updated menu', async () => {
      const mockResponse = { data: { id: 1, name: 'Pizza' } };
      fetch.mockResolvedValueOnce({ ok: true, json: jest.fn().mockResolvedValueOnce(mockResponse) });

      const result = await connectRelation(1, 1);

      expect(fetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: 
                              { menus: 
                                { connect: [1] } 
                              } 
                            }),
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle fetch errors in connectRelation', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(connectRelation(1, 1)).rejects.toThrow('Network error');
    });
  });

  describe('updateMenu', () => {
    it('should update a menu item and return it', async () => {
      const mockResponse = { data: { id: 1, name: 'Not Updated Menu' } };
      fetch.mockResolvedValueOnce({ ok: true, json: jest.fn().mockResolvedValueOnce(mockResponse) });

      const result = await updateMenu(1, { name: 'Updated Menu' });

      expect(fetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/api/menus/1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Updated Menu' }),
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error when updating fails', async () => {
      fetch.mockResolvedValueOnce({ ok: false });

      await expect(updateMenu(1, { name: 'Updated Menu' })).rejects.toThrow('Failed to update menu item');
    });

  });

  describe('deleteMenu', () => {
    it('should delete a menu item and return it', async () => {
      const mockResponse = { data: { id: 1 } };
      fetch.mockResolvedValueOnce({ ok: true, json: jest.fn().mockResolvedValueOnce(mockResponse) });

      const result = await deleteMenu(1);

      expect(fetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/api/menus/1`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error when deletion fails', async () => {
      fetch.mockResolvedValueOnce({ ok: false });

      await expect(deleteMenu(1)).rejects.toThrow('Failed to delete menu item');
    });

  });
  
  describe('changePhoto', () => {
    const mockFile = new File([''], 'photo.jpg', { type: 'image/jpeg' });

    it('should upload a new photo and update the menu item', async () => {
      const mockResponse = { data: { id: 1, photo: { data: { id: 2 } } } };
      
      // Mock responses for fetching, deleting, and uploading
      fetch.mockResolvedValueOnce({ ok: true, json: jest.fn().mockResolvedValueOnce({ data: { attributes: { photo: { data: { id: 1 } } } } } ) });
      fetch.mockResolvedValueOnce({ ok: true }); // for delete photo
      fetch.mockResolvedValueOnce({ ok: true, json: jest.fn().mockResolvedValueOnce([{ id: 2 }]) }); // for upload new photo
      fetch.mockResolvedValueOnce({ ok: true, json: jest.fn().mockResolvedValueOnce(mockResponse) }); // for updating menu

      const result = await changePhoto(mockFile, 1);

      expect(fetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/api/menus/1?populate=photo`);
      expect(fetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, expect.any(Object));
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error when retrieval fails', async () => {
      fetch.mockResolvedValueOnce({ ok: false });

      await expect(changePhoto(mockFile, 1)).rejects.toThrow('Failed to retrieve menu item. Status: undefined');
    });

    it('should throw an error when deletion of old photo fails', async () => {
      fetch.mockResolvedValueOnce({ ok: true, json: jest.fn().mockResolvedValueOnce({ data: { attributes: { photo: { data: { id: 1 } } } } }) });
      fetch.mockResolvedValueOnce({ ok: false });

      await expect(changePhoto(mockFile, 1)).rejects.toThrow('Failed to delete old photo. Status: undefined');
    });

    it('should throw an error when upload fails', async () => {
      fetch.mockResolvedValueOnce({ ok: true, json: jest.fn().mockResolvedValueOnce({ data: { attributes: { photo: { data: { id: 1 } } } } }) });
      fetch.mockResolvedValueOnce({ ok: true });
      fetch.mockResolvedValueOnce({ ok: false });

      await expect(changePhoto(mockFile, 1)).rejects.toThrow('Failed to upload new photo. Status: undefined');
    });


    it('should handle the case where there is no existing photo', async () => {
      const mockFile = {}; // Replace with actual file mock if needed
      const mockResponse = { data: { attributes: { photo: { id: 2, url: "new-photo-url.jpg" } } } };
    
      // 1. Check for an existing photo and return null (indicating no existing photo)
      fetch.mockResolvedValueOnce({ ok: true, json: jest.fn().mockResolvedValueOnce({ data: { attributes: { photo: null } } }) });
    
      // 2. No deletion of old photo since there is no existing photo
      // 3. Mock successful upload response for the new photo
      fetch.mockResolvedValueOnce({ ok: true, json: jest.fn().mockResolvedValueOnce([{ id: 2 }]) });
    
      // 4. Mock response for updating the menu item with the new photo
      fetch.mockResolvedValueOnce({ ok: true, json: jest.fn().mockResolvedValueOnce(mockResponse) });
    
      // Run the function and verify it returns the expected result
      const result = await changePhoto(mockFile, 1);
      expect(result).toEqual(mockResponse);
    });

    
  
  });
});
