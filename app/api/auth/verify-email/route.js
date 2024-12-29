import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { signIn } from '@/auth';


export async function GET(request) {
    const { searchParams } = new URL(request.url);

  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ success: false, message: 'No token provided' }, { status: 400 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if token is expired
    if (Date.now() >= decoded.exp * 1000) {
      return NextResponse.json({ success: false, message: 'Link expired' }, { status: 400 });
    }

    // Sign in the user
    const result = await signIn('credentials', {
      redirect: false,
      email: decoded.email,
      password: decoded.password,
    });

    if (result?.error) {
      return NextResponse.json({ success: false, message: 'Authentication failed' }, { status: 401 });
    }

    return NextResponse.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    console.error('Token verification failed:', error);
    return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 400 });
  }
}

