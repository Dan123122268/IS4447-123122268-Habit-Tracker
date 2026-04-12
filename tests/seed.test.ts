import { seedTrackifyIfEmpty } from '../db/seed';
import { db } from '../db/client';
import {
  categories,
  habitLogs,
  habits,
  settings,
  targets,
  users,
} from '../db/schema';

jest.mock('../db/client', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
  },
}));

const mockDb = db as unknown as {
  select: jest.Mock;
  insert: jest.Mock;
};

describe('seedTrackifyIfEmpty', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('inserts sample data into all Trackify tables when habits are empty', async () => {
    const mockValues = jest.fn().mockResolvedValue(undefined);
    const mockFrom = jest.fn().mockResolvedValue([]);
    mockDb.select.mockReturnValue({ from: mockFrom });
    mockDb.insert.mockReturnValue({ values: mockValues });

    await seedTrackifyIfEmpty();

    expect(mockFrom).toHaveBeenCalledWith(habits);
    expect(mockDb.insert).toHaveBeenCalledTimes(6);
    expect(mockDb.insert).toHaveBeenNthCalledWith(1, users);
    expect(mockDb.insert).toHaveBeenNthCalledWith(2, categories);
    expect(mockDb.insert).toHaveBeenNthCalledWith(3, habits);
    expect(mockDb.insert).toHaveBeenNthCalledWith(4, habitLogs);
    expect(mockDb.insert).toHaveBeenNthCalledWith(5, targets);
    expect(mockDb.insert).toHaveBeenNthCalledWith(6, settings);
    expect(mockValues).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Fitness' }),
        expect.objectContaining({ name: 'Learning' }),
        expect.objectContaining({ name: 'Wellbeing' }),
      ])
    );
    expect(mockValues).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Morning Run' }),
        expect.objectContaining({ name: 'Read 20 Pages' }),
        expect.objectContaining({ name: 'Evening Reflection' }),
      ])
    );
    expect(mockValues).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ period: 'weekly', targetValue: 4 }),
        expect.objectContaining({ period: 'monthly', targetValue: 20 }),
      ])
    );
  });

  it('does not duplicate seed data when habits already exist', async () => {
    const mockFrom = jest.fn().mockResolvedValue([
      { id: 1, name: 'Existing Habit', categoryId: 1, userId: 1 },
    ]);
    mockDb.select.mockReturnValue({ from: mockFrom });

    await seedTrackifyIfEmpty();

    expect(mockDb.insert).not.toHaveBeenCalled();
  });
});
