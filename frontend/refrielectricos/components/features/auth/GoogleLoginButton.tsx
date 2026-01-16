'use client';

import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface GoogleLoginButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  text?: 'signin_with' | 'signup_with' | 'continue_with';
  className?: string;
}

export default function GoogleLoginButton({
  onSuccess,
  onError,
  text = 'signin_with',
  className = '',
}: GoogleLoginButtonProps) {
  const router = useRouter();
  const { login: setAuthUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const buttonText = {
    signin_with: 'Iniciar sesión con Google',
    signup_with: 'Registrarse con Google',
    continue_with: 'Continuar con Google',
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    if (!credentialResponse.credential) {
      const errorMsg = 'No se recibió credencial de Google';
      console.error(errorMsg);
      onError?.(errorMsg);
      return;
    }

    setIsLoading(true);

    try {
      // Send credential to backend
      const response = await axios.post(`${API_URL}/auth/google/login`, {
        credential: credentialResponse.credential,
      });

      const { access_token, refresh_token } = response.data;

      // Decode JWT to get user info
      const base64Url = access_token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));

      // Fetch full user profile
      const userResponse = await axios.get(`${API_URL}/users/${payload.sub}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      // Save to auth store
      setAuthUser(
        {
          id: userResponse.data.id,
          email: userResponse.data.email,
          name: userResponse.data.name,
          role: userResponse.data.role,
          avatar: userResponse.data.avatar,
          provider: userResponse.data.provider,
          emailVerified: userResponse.data.emailVerified,
        },
        access_token,
        refresh_token
      );

      onSuccess?.();
      router.push('/');
    } catch (error: any) {
      console.error('Google login error:', error);
      const errorMsg =
        error.response?.data?.message || 'Error al iniciar sesión con Google';
      onError?.(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize Google Sign-In button
  useEffect(() => {
    if (typeof window === 'undefined' || !window.google) return;

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: handleGoogleLogin,
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    // Render the button
    const buttonDiv = document.getElementById('google-signin-button');
    if (buttonDiv) {
      window.google.accounts.id.renderButton(buttonDiv, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: text,
        shape: 'rectangular',
        logo_alignment: 'left',
        width: buttonDiv.offsetWidth,
      });
    }

    // Show One Tap if on login page
    if (window.location.pathname === '/login') {
      window.google.accounts.id.prompt();
    }
  }, [text]);

  return (
    <div className={className}>
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center rounded-md z-10">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      )}
      <div id="google-signin-button" className="w-full"></div>
    </div>
  );
}

// TypeScript declarations for Google Identity Services
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}
