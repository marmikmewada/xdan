import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import speakeasy from 'speakeasy';

// Use the same secret as in the generation file
const OTP_SECRET = "EQZWM2BQN5RTGNSGLN4HMSJIEZDTY7KUOI3SYTTINYYHOMSSKISA";

export async function POST(req) {
    try {
        const { otp } = await req.json();
        const session = await auth();
        console.log('Fetched session for OTP verification:', session);

        if (!session || !session.user) {
            throw new Error('User not authenticated');
        }

        const userId = session.user.id;
        const email = session.user.email;

        if (!userId || !email) {
            throw new Error('User ID or email not found');
        }

        console.log('OTP being checked:', otp);
        console.log('OTP secret:', OTP_SECRET);

        const isOtpValid = speakeasy.totp.verify({
            secret: OTP_SECRET,
            encoding: 'base32',
            token: otp,
            window: 1,
            step: 30 // 30-second interval to match Google Authenticator
        });

        console.log('Is OTP valid:', isOtpValid);

        if (!isOtpValid) {
            throw new Error('Invalid OTP');
        }

        return NextResponse.json({ success: true, user: { id: userId, email } });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return NextResponse.json({ success: false, message: error.message || 'Invalid OTP' }, { status: 401 });
    }
}