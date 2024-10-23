"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function TwoFAStep() {
  const { data: session } = useSession(); // Get the session
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Log the session for debugging
  useEffect(() => {
    console.log("Session:", session);
  }, [session]);

  useEffect(() => {
    async function fetchQRCode() {
      try {
        const res = await fetch("/api/auth/generate-totp", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch QR code");
        const data = await res.json();
        if (data.qrCodeUrl) {
          setQrCodeUrl(data.qrCodeUrl);
        }
      } catch (error) {
        console.error("Error fetching QR code:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchQRCode();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpCode) {
      alert("Please enter the OTP.");
      return;
    }

    // Send only the OTP to the verify-totp API
    const response = await fetch('/api/auth/verify-totp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ otp: otpCode }), // Send only the OTP
    });

    const data = await response.json();

    if (data.success) {
      router.push('/'); // Redirect on success
    } else {
      alert(data.message || "An unknown error occurred.");
    }
  };

  return (
    <div>
      <h1>2FA Setup</h1>
      <div className="flex justify-center">
        {loading ? (
          <p>Loading QR Code...</p>
        ) : (
          qrCodeUrl ? (
            <Image src={qrCodeUrl} alt="QR Code for 2FA" width={300} height={300} />
          ) : (
            <p>Failed to load QR Code</p>
          )
        )}
      </div>
      <input
        type="text"
        placeholder="Enter the OTP from your app"
        value={otpCode}
        onChange={(e) => setOtpCode(e.target.value)}
      />
      <button onClick={handleSubmit}>Verify OTP</button>
    </div>
  );
}
