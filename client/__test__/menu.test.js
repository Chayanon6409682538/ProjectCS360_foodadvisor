const { createMenu } = require('../services/menu-services');

describe('Unit Tests for createMenu Function', () => {
  // Mocking the global fetch
  beforeAll(() => {
    global.fetch = jest.fn();
  });

  afterAll(() => {
    jest.restoreAllMocks(); // Restore original fetch after tests
  });

  it('should create a menu item and return it', async () => {
    const mockResponse = { id: 1, name: 'Pizza', price: 10 };

    // Mocking fetch response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const params = { name: 'Pizza', price: 10 };
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