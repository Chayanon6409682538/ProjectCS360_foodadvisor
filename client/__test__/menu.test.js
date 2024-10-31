const { createMenu } = require('../services/menu-services');

describe('Unit Tests for createMenu Function', () => {
  // Mocking the global fetch
  beforeAll(() => {
    global.fetch = jest.fn();
    jest.spyOn(console, 'error').mockImplementation(() => {}); // Mock console.error
  });

  afterAll(() => {
    jest.restoreAllMocks(); // Restore original fetch after tests
  });

  it('should create a menu item and return it', async () => {
    const mockResponse = {
      data: {
        id: 1,
        name: 'New Menu',
        price: 0.00,
        type: 'Main Menu',
        isAvailable: false, // Correcting the typo from 'isAvaliable' to 'isAvailable'
        photo: {
          data: {
            id: 1 // Assuming the photo already exists in your Strapi media library
          }
        }
      }
    };

    // Mocking fetch response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const params = {
      name: 'New Menu',
      price: 0.00,
      type: 'Main Menu',
      isAvailable: false, // Correcting the typo here too
      photo: {
        data: {
          id: 1 // Mocking the existing photo ID
        }
      }
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

  it('should handle fetch errors', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(createMenu({ name: 'Pizza', price: 10 })).rejects.toThrow('Network error');
  });
});
