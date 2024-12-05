import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import speakeasy from 'speakeasy';

// Use the provided secret directly
const secretString = "EQZWM2BQN5RTGNSGLN4HMSJIEZDTY7KUOI3SYTTINYYHOMSSKISA";

export async function GET(req) {
    console.log('Received request:', req);

    try {
        const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")
        // const session = await auth();
        // console.log('Fetched session from generate OTP:', session);

        // const email = session?.user?.email;
        // const userId = session?.user?.id;
        // if (!email || !userId) {
        //     console.warn('User not authenticated. No email or ID found in session.');
        //     return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
        // }

        // Use the specified secret for this user
        const secret = {
            base32: secretString
        };

        // Create OTP auth URL and generate QR code
        const otpauthUrl = speakeasy.otpauthURL({
            secret: secret.base32,
            label: email,
            issuer: 'Dan',
            encoding: 'base32',
            algorithm: 'sha1',
            period: 30 // Google Authenticator uses 30-second intervals by default
        });

        const qrCodeUrl = await QRCode.toDataURL(otpauthUrl);

        // Generate current OTP
        const otp = speakeasy.totp({
            secret: secret.base32,
            encoding: 'base32',
            step: 30,
            window: 1
        });

        console.log('Generated OTP:', otp);
        console.log('OTP Secret:', secret.base32);
        return NextResponse.json({ otp, qrCodeUrl, secret: secret.base32 });
    } catch (error) {
        console.error('Error generating OTP:', error);
        return NextResponse.json({ error: 'Failed to generate OTP' }, { status: 500 });
    }
}

// import { auth } from '@/auth';
// import { NextResponse } from 'next/server';
// import QRCode from 'qrcode';
// import speakeasy from 'speakeasy';

// // Use the provided secret directly
// const secretString = "EQZWM2BQN5RTGNSGLN4HMSJIEZDTY7KUOI3SYTTINYYHOMSSKISA";

// export async function GET(req) {
//     console.log('Received request:', req);

//     try {
//         const session = await auth();
//         console.log('Fetched session from generate OTP:', session);

//         const email = session?.user?.email;
//         const userId = session?.user?.id;
//         if (!email || !userId) {
//             console.warn('User not authenticated. No email or ID found in session.');
//             return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
//         }

//         // Use the specified secret for this user
//         const secret = {
//             base32: secretString
//         };

//         // Create OTP auth URL and generate QR code
//         const otpauthUrl = speakeasy.otpauthURL({
//             secret: secret.base32,
//             label: email,
//             issuer: 'Dan',
//             encoding: 'base32',
//             algorithm: 'sha1',
//             period: 30 // Google Authenticator uses 30-second intervals by default
//         });

//         const qrCodeUrl = await QRCode.toDataURL(otpauthUrl);

//         // Generate current OTP
//         const otp = speakeasy.totp({
//             secret: secret.base32,
//             encoding: 'base32',
//             step: 30,
//             window: 1
//         });

//         console.log('Generated OTP:', otp);
//         console.log('OTP Secret:', secret.base32);
//         return NextResponse.json({ otp, qrCodeUrl, secret: secret.base32 });
//     } catch (error) {
//         console.error('Error generating OTP:', error);
//         return NextResponse.json({ error: 'Failed to generate OTP' }, { status: 500 });
//     }
// }
