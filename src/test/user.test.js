const { registerUser } = require('../services/user_service'); 
const User = require('../models/user_model');
const { createNewOrder, closeConnection } = require('../queque/order-queue');

jest.mock('../models/user_model'); 
jest.mock('../queque/order-queue'); 

describe('registerUser', () => {
  beforeEach(() => {
    User.findOne.mockClear();
    User.create.mockClear();
    User.findOne.mockResolvedValue(null);
    createNewOrder.mockClear();
  });

  afterEach(async () => {
    await closeConnection();
  });

  it('should register a new user and create an order', async () => {
    const payload = {
      first_name: 'John',
      last_name: 'Doe',
      birthday: '1990-01-01',
      location: 'Asia/Jakarta',
      type: 'Birthday',
    };
  
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({});
    const mockCreateNewOrder = jest.fn();
    createNewOrder.mockImplementation(mockCreateNewOrder);
  
    await registerUser(
      payload.first_name,
      payload.last_name,
      payload.birthday,
      payload.location,
      payload.type
    );
  
    expect(User.findOne).toHaveBeenCalledWith(
      {
        $and: [{ FIRST_NAME: payload.first_name }, { LAST_NAME: payload.last_name }],
      },
      { _id: false },
      { lean: true }
    );
  
    expect(User.create).toHaveBeenCalledWith({
      FIRST_NAME: payload.first_name,
      LAST_NAME: payload.last_name,
      BIRTHDAY: expect.any(Number),
      LOCATION: payload.location,
      TYPE: payload.type,
    });
  });

  it('should return an error response if the user is already registered', async () => {
    const payload = {
      first_name: 'John',
      last_name: 'Doe',
      birthday: '1990-01-01',
      location: 'New York',
      type: 'customer',
    };

    User.findOne.mockResolvedValue({});

    const result = await registerUser(
      payload.first_name,
      payload.last_name,
      payload.birthday,
      payload.location,
      payload.type
    );

    expect(User.findOne).toHaveBeenCalledWith({
      $and: [{ FIRST_NAME: payload.first_name }, { LAST_NAME: payload.last_name }],
    }, { _id: false }, { lean: true });

    expect(result).toEqual(expect.objectContaining({ code: 422 }));
    expect(result.message).toEqual('User already registered');
  });
});