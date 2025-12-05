/// <reference types="@types/jest" />
import { useAuthStore } from '../../../store/authStore';
import { User } from '../../../types/user';
import { act } from '@testing-library/react';

const mockUser: User = {
  id: 'user-1',
  name: 'Juan Pérez',
  email: 'juan@example.com',
  role: 'USER',
};

const mockAdminUser: User = {
  id: 'admin-1',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'ADMIN',
};

describe('Auth Store', () => {
  beforeEach(() => {
    // Reset the store before each test
    act(() => {
      useAuthStore.setState({
        user: null,
        token: null,
        rememberMe: true,
        _hasHydrated: false,
      });
    });
  });

  describe('setAuth', () => {
    it('should set user and token', () => {
      const token = 'jwt-token-123';
      
      act(() => {
        useAuthStore.getState().setAuth(mockUser, token, true);
      });

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe(token);
      expect(state.rememberMe).toBe(true);
    });

    it('should set rememberMe to false when specified', () => {
      act(() => {
        useAuthStore.getState().setAuth(mockUser, 'token', false);
      });

      expect(useAuthStore.getState().rememberMe).toBe(false);
    });

    it('should handle admin user role', () => {
      act(() => {
        useAuthStore.getState().setAuth(mockAdminUser, 'admin-token', true);
      });

      expect(useAuthStore.getState().user?.role).toBe('ADMIN');
    });
  });

  describe('logout', () => {
    it('should clear user and token', () => {
      act(() => {
        useAuthStore.getState().setAuth(mockUser, 'token', true);
        useAuthStore.getState().logout();
      });

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
    });

    it('should reset rememberMe to true after logout', () => {
      act(() => {
        useAuthStore.getState().setAuth(mockUser, 'token', false);
        useAuthStore.getState().logout();
      });

      expect(useAuthStore.getState().rememberMe).toBe(true);
    });
  });

  describe('updateUser', () => {
    it('should update user data without affecting token', () => {
      const token = 'jwt-token-123';
      
      act(() => {
        useAuthStore.getState().setAuth(mockUser, token, true);
      });

      const updatedUser: User = {
        ...mockUser,
        name: 'Juan Carlos Pérez',
      };

      act(() => {
        useAuthStore.getState().updateUser(updatedUser);
      });

      const state = useAuthStore.getState();
      expect(state.user?.name).toBe('Juan Carlos Pérez');
      expect(state.token).toBe(token);
    });

    it('should update user email', () => {
      act(() => {
        useAuthStore.getState().setAuth(mockUser, 'token', true);
      });

      const updatedUser: User = {
        ...mockUser,
        email: 'nuevoemail@example.com',
      };

      act(() => {
        useAuthStore.getState().updateUser(updatedUser);
      });

      expect(useAuthStore.getState().user?.email).toBe('nuevoemail@example.com');
    });
  });

  describe('setHasHydrated', () => {
    it('should set hydration state', () => {
      expect(useAuthStore.getState()._hasHydrated).toBe(false);

      act(() => {
        useAuthStore.getState().setHasHydrated(true);
      });

      expect(useAuthStore.getState()._hasHydrated).toBe(true);
    });
  });

  describe('authentication state checks', () => {
    it('should correctly identify unauthenticated state', () => {
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
    });

    it('should correctly identify authenticated state', () => {
      act(() => {
        useAuthStore.getState().setAuth(mockUser, 'valid-token', true);
      });

      const state = useAuthStore.getState();
      expect(state.user).not.toBeNull();
      expect(state.token).not.toBeNull();
    });

    it('should identify user role as USER', () => {
      act(() => {
        useAuthStore.getState().setAuth(mockUser, 'token', true);
      });

      expect(useAuthStore.getState().user?.role).toBe('USER');
    });

    it('should identify user role as ADMIN', () => {
      act(() => {
        useAuthStore.getState().setAuth(mockAdminUser, 'token', true);
      });

      expect(useAuthStore.getState().user?.role).toBe('ADMIN');
    });
  });
});
