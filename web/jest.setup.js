require('@testing-library/jest-dom');

jest.mock('@/app/hooks/useUser', () => ({
  __esModule: true,
  default: () => ({
    user: {
      is_anonymous: true,
      access: 'test-token',
    },
  }),
}));

jest.mock('@/app/hooks/useSchedules', () => ({
  __esModule: true,
  default: () => ({
    localSchedules: [],
    setCloudSchedules: jest.fn(),
    setLocalSchedules: jest.fn(),
    cloudSchedules: [],
  }),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: () => require('react').createElement('div'),
}));

jest.mock('@/app/utils/toast', () => ({
  errorToast: jest.fn(),
  successToast: jest.fn(),
}));

jest.mock('@/app/utils/api/saveSchedule');
jest.mock('@/app/utils/api/getSchedules');
jest.mock('@/app/utils/api/deleteSchedule');

jest.mock('html2canvas', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({
    toDataURL: jest.fn(() => 'data:image/png;base64,test'),
  }),
}));
