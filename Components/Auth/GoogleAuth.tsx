'use client'
import React, { useState } from 'react'
import api from "@/api"
import { useGoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';

const GoogleAuth = () => {
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<any>(false)
  const router = useRouter()

  const verifyGoogle = async (token: any) => {
    try {
      setLoading(true)
      setError(null)
      const result = await api.post("/core/google/", {
        token: token,
      });
      if (result?.data?.access && result?.data?.refresh) {
        localStorage.setItem("tokens", JSON.stringify(result.data));
        router.push('/');
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      setError('Can\'t Authenticate. Please Try Again!');
    }
  };

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => verifyGoogle(tokenResponse?.access_token),
    onError: () => setError("Google Authentication Failed!"),
  });

  return (
    <div className="w-full flex items-center justify-center p-4">
      <div className="max-w-md w-full backdrop-blur-sm bg-black/30 rounded-xl shadow-2xl p-8 border border-gray-700/50">
        <div className="flex flex-col items-center">
          <button
            onClick={() => login()}
            disabled={loading}
            className={`flex items-center justify-center gap-3 px-6 py-3 rounded-lg font-medium transition-all
              ${
                loading
                  ? 'bg-gray-600/50 cursor-not-allowed'
                  : 'bg-white hover:bg-gray-100 text-gray-800 shadow-lg hover:shadow-xl'
              }`}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="mt-6 text-center text-sm text-white/50">
            Secure authentication with Google
          </div>
        </div>
      </div>
    </div>
  )
}

export default GoogleAuth