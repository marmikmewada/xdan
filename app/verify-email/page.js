'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifyEmail() {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setStatus('error');
        setMessage('No verification token provided');
        return;
      }

      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (data.success) {
          setStatus('success');
          setMessage(data.message);
          setTimeout(() => {
              router.push('/');
              router.refresh()
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.message);
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred during verification');
      }
    };

    verifyEmail();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        {status === 'loading' && (
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
        )}
        {status === 'success' && (
          <div className="text-green-600">
            <svg className="h-12 w-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h2 className="text-2xl font-bold mb-4">Email Verified</h2>
            <p>{message}</p>
            <p className="mt-4 text-sm text-gray-600">Redirecting to home page...</p>
          </div>
        )}
        {status === 'error' && (
          <div className="text-red-600">
            <svg className="h-12 w-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <h2 className="text-2xl font-bold mb-4">Verification Failed</h2>
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

