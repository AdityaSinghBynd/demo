"use client"

import { useState, useEffect } from "react";
import Head from "next/head";
import About from '@/components/About'
export default function EmailVerify() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("registeredEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleCheckEmail = () => {
    window.open("https://mail.google.com/mail/u/0/#inbox", "_blank");
  };

  return (
    <>
      <Head>
        <title>Bynd - Email Verification</title>
        <meta name="description" content="Verify your Bynd account email" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/ByndLogoFavicon.svg" />
      </Head>

      <div className="flex min-h-screen w-full">
      <div className="w-1/2 flex-shrink-0 bg-white">
          <About />
        </div>
        <div className="w-full bg-[#f0f2f5] flex items-start justify-center overflow-y-auto scrollbar scrollbar-thin scrollbar-track-[#f7fafc] scrollbar-thumb-[#cbd5e0] scrollbar-thumb-rounded">
          <div className="max-w-[600px] w-full mx-auto">
            <header className="mb-8 text-left">
              <h1 className="text-[32px] font-bold leading-[40px] text-[#101828] m-0 mb-1.5">
                Check your Email
              </h1>
              <div>
                <p className="text-base leading-6 text-[#344054] font-normal mb-2">
                  We have sent an email for verification to{" "}
                  <span className="text-[#0047cb] font-medium">
                    {email || "your email"}
                  </span>
                </p>
                <p className="text-base leading-6 text-[#344054] font-normal m-0">
                  Didn&apos;t receive the email yet? Check your spam folder.
                </p>
              </div>
            </header>
            <div className="mt-8">
              <button
                onClick={handleCheckEmail}
                className="h-[54px] px-6 w-full bg-[#0047cb] text-white border-none rounded hover:bg-[#003bb3] active:translate-y-[1px] focus:outline-none font-semibold text-base cursor-pointer transition-all duration-200 ease-in-out disabled:bg-[#e4e7ec] disabled:cursor-not-allowed disabled:hover:bg-[#e4e7ec] disabled:hover:transform-none"
                aria-label="Open email client"
              >
                Check Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
