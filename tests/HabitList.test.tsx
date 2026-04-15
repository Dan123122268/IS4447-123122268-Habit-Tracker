import React from 'react';
import { render } from '@testing-library/react-native';
import IndexScreen from '../app/(tabs)/index';

const mockUseTrackify = jest.fn();

jest.mock('@/context/TrackifyContext', () => ({
  useTrackify: () => mockUseTrackify(),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return { SafeAreaView: View };
});

describe('IndexScreen', () => {
  beforeEach(() => {
    mockUseTrackify.mockReturnValue({
      activeUser: { id: 1, username: 'demo', passwordHash: 'hash', createdAt: '2026-04-08' },
      categories: [
        { id: 1, userId: 1, name: 'Fitness', colour: '#0F766E', icon: 'activity' },
      ],
      habits: [
        {
          id: 1,
          userId: 1,
          categoryId: 1,
          name: 'Morning Run',
          notes: 'Track every run.',
          metricType: 'count',
          createdAt: '2026-04-08',
          isArchived: false,
        },
      ],
      logs: [
        {
          id: 1,
          habitId: 1,
          userId: 1,
          date: '2026-04-08',
          value: 1,
          completed: true,
          notes: null,
        },
      ],
      targets: [
        {
          id: 1,
          userId: 1,
          habitId: 1,
          categoryId: null,
          period: 'weekly',
          targetValue: 4,
          startsOn: '2026-04-01',
        },
      ],
      settings: [],
      isLoading: false,
      refreshData: jest.fn(),
    });
  });

  it('renders seeded habit data and the add button', () => {
    const { getAllByText, getByText } = render(<IndexScreen />);

    expect(getByText('Morning Run')).toBeTruthy();
    expect(getAllByText('Fitness').length).toBeGreaterThan(0);
    expect(getByText('Add Habit')).toBeTruthy();
  });
});
