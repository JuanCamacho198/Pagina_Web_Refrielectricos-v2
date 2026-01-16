'use client';

import { GoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google';
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

  const handleGoogleResponse = async (credentialResponse: any) => {
    if (!credentialResponse.credential) {
      const errorMsg = 'No se recibió credencial de Google';
      console.error(errorMsg);
      onError?.(errorMsg);
      return;
    }

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

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/');
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      const errorMsg =
        error.response?.data?.message || 'Error al iniciar sesión con Google';
      onError?.(errorMsg);
    }
  };

  useGoogleOneTapLogin({
    onSuccess: handleGoogleResponse,
    onError: () => console.log('Google One Tap Failed'),
    auto_select: true,
  });

  return (
    <div className={`${className} flex justify-center w-full`}>
      <GoogleLogin
        onSuccess={handleGoogleResponse}
        onError={() => onError?.('Error al iniciar sesión con Google')}
        text={text}
        theme="outline"
        shape="rectangular"
        size="large"
        width="100%"
      />
    </div>
  );
}
