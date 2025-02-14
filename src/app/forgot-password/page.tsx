"use client"

import { FormEvent, useState } from "react";
import styles from "@/styles/ForgotPassword.module.scss";
import About from "@/components/About";
import EmailVerify from "@/app/email-verify/page";
import { useRouter } from "next/navigation";
import { X } from 'lucide-react'
import Head from "next/head";
import axios, { AxiosError } from "axios";
import { BASE_URL } from "@/constant/constant";

export default function ForgotPassword() {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleBackToLogin = () => {
    router.push("/login");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${BASE_URL}/auth/forgot/password`, {
        email: email.trim(),
      });

      if (response.data.error === "emailNotExists" || response.status === 422) {
        setError(
          "We couldn't find an account with that email address. Please check your email or sign up for a new account.",
        );
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.status === 422) {
        setError(
          "We couldn't find an account with that email address. Please check your email or sign up for a new account.",
        );
      } else if (error.response?.status === 429) {
        setError("Too many attempts. Please try again later");
      } else {
        setError("Failed to send reset instructions. Please try again");
      }
      console.error("Password reset error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Bynd - Forgot Password</title>
        <meta name="description" content="Reset your Bynd account password" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/ByndLogoFavicon.svg" />
      </Head>

      <div className={styles.container}>
        <div className={styles.leftSection}>
          <About />
        </div>

        <div className={styles.rightSection}>
          <div className={styles.formContainer}>
            {isSuccess ? (
              <EmailVerify />
            ) : (
              <>
                <header className={styles.header}>
                  <h1 className={styles.heading}>Forgot Password</h1>
                  <p className={styles.subheading}>
                    Enter the email you used to create your account so we can
                    send you instructions on how to reset your password.
                  </p>
                </header>

                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.formGroup}>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={handleChange}
                      required
                      placeholder="Email"
                      autoComplete="email"
                      disabled={isLoading}
                    />
                  </div>

                  <div className={styles.buttonGroup}>
                    <button
                      type="submit"
                      className={styles.submitButton}
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending..." : "Send Reset Instructions"}
                    </button>

                    <button
                      type="button"
                      onClick={handleBackToLogin}
                      className={styles.backButton}
                      disabled={isLoading}
                    >
                      Back to Login
                    </button>
                  </div>

                  {error && (
                    <div className={styles.errorMessage}>
                      <div className={styles.errorIcon}>
                        <X className="h-5 w-5" />
                      </div>
                      <div className={styles.errorContent}>
                        <p className={styles.errorTitle}>Error</p>
                        <p className={styles.errorText}>{error}</p>
                      </div>
                    </div>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
