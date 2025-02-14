import { FormEvent, FormEventHandler, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/RegisterPage.module.scss";
import About from "../About";
import { AUTH_URL } from "@/constant/constant";
import successTickSVGIcon from "../../../public/images/successTickSVGIcon.svg";
import eyeImage from "../../../public/images/closeEyeSVGIcon.svg";
import closedEyeImage from "../../../public/images/closeEyeSVGIcon.svg";
import crossImage from "../../../public/Images/errorCrossSVGIcon.svg";
import Head from "next/head";
import PasswordProgress from "@/components/ui/PasswordProgress";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  const togglePasswordVisibility = (field: string) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else if (field === "confirmPassword") {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [password, setPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    number: false,
    symbol: false,
  });
  const [passwordStrength, setPasswordStrength] = useState(0);

  const validatePassword = (password: string) => {
    const errors = {
      length: password.length >= 8,
      number: /\d/.test(password),
      symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPasswordErrors(errors);

    const strength = Object.values(errors).filter(Boolean).length;
    setPasswordStrength(strength);

    const allValidationsPassed = Object.values(errors).every(Boolean);
    if (allValidationsPassed) {
      setTimeout(() => {
        setShowValidation(false);
      }, 500);
    } else {
      setShowValidation(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (name === "password") {
      setPassword(value);
      validatePassword(value);
      setShowValidation(true);
    }
    if (name === "firstName" || name === "lastName") {
      const firstName = name === "firstName" ? value : formData.firstName;
      const lastName = name === "lastName" ? value : formData.lastName;
      const username = `${firstName.toLowerCase()}_${lastName.toLowerCase()}`;
      setFormData((prevFormData) => ({
        ...prevFormData,
        username,
        [name]: type === "checkbox" ? checked : value,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`${AUTH_URL}/auth/email/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        window.location.href = "/email-verify";
      } else {
        console.error("Registration failed:", data);
        alert(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("An error occurred while registering the user:", error);
      alert("An error occurred during registration. Please try again later.");
    }
  };

  return (
    <>
      <Head>
        <title>Bynd - Create Account</title>
        <meta name="description" content="Create your Bynd account" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/ByndLogoFavicon.svg" />
      </Head>

      <div className="flex min-h-screen w-full">
        <div className="w-1/2 flex-shrink-0 bg-white">
          <About />
        </div>

        <div className="w-1/2 bg-[#f0f2f5] p-10 overflow-y-auto flex flex-col scrollbar scrollbar-thin scrollbar-track-[#f7fafc] scrollbar-thumb-[#cbd5e0] scrollbar-thumb-rounded">
          <div className="max-w-[600px] w-full mx-auto py-10">
            <header className="mb-8">
              <h1 className="text-[30px] font-bold leading-[38px] text-[#101828] m-0 mb-2">
                Create account
              </h1>
              <p className="text-base font-medium leading-6 text-black m-0">
                Already have an account?
                <Link
                  href="/login"
                  className="text-[#0047cb] font-semibold no-underline ml-1 hover:underline"
                >
                  Login
                </Link>
              </p>
            </header>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="First Name"
                    className="w-full h-[54px] px-3.5 py-2.5 bg-white border border-[#e4e7ec] rounded text-base leading-6 text-[#101828] transition-all duration-200 placeholder:text-[#667085] focus:border-[#0047cb] focus:ring-1 focus:ring-[#0047cb] focus:ring-opacity-100 focus:outline-none"
                  />
                </div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Last Name"
                    className="w-full h-[54px] px-3.5 py-2.5 bg-white border border-[#e4e7ec] rounded text-base leading-6 text-[#101828] transition-all duration-200 placeholder:text-[#667085] focus:border-[#0047cb] focus:ring-1 focus:ring-[#0047cb] focus:ring-opacity-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Email"
                  className="w-full h-[54px] px-3.5 py-2.5 bg-white border border-[#e4e7ec] rounded text-base leading-6 text-[#101828] transition-all duration-200 placeholder:text-[#667085] focus:border-[#0047cb] focus:ring-1 focus:ring-[#0047cb] focus:ring-opacity-100 focus:outline-none"
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Password"
                  className="w-full h-[54px] px-3.5 py-2.5 pr-11 bg-white border border-[#e4e7ec] rounded text-base leading-6 text-[#101828] transition-all duration-200 placeholder:text-[#667085] focus:border-[#0047cb] focus:ring-1 focus:ring-[#0047cb] focus:ring-opacity-100 focus:outline-none"
                  onFocus={() => {
                    setIsPasswordFocused(true);
                    setShowValidation(true);
                  }}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("password")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none p-1 cursor-pointer flex items-center justify-center hover:opacity-80"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <Image
                    src={showPassword ? eyeImage : closedEyeImage}
                    alt={showPassword ? "Hide password" : "Show password"}
                    width={20}
                    height={20}
                  />
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm Password"
                  className="w-full h-[54px] px-3.5 py-2.5 pr-11 bg-white border border-[#e4e7ec] rounded text-base leading-6 text-[#101828] transition-all duration-200 placeholder:text-[#667085] focus:border-[#0047cb] focus:ring-1 focus:ring-[#0047cb] focus:ring-opacity-100 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none p-1 cursor-pointer flex items-center justify-center hover:opacity-80"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  <Image
                    src={showConfirmPassword ? eyeImage : closedEyeImage}
                    alt={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    width={20}
                    height={20}
                  />
                </button>
              </div>
              <div className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="agreeTerms">
                  I agree to Bynd&apos;s{" "}
                  <Link href="/" className={styles.termsLink}>
                    Terms of service
                  </Link>{" "}
                  and{" "}
                  <Link href="/" className={styles.termsLink}>
                    Privacy policy
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                className="h-[54px] w-full bg-[#0047cb] text-white border-none rounded font-semibold text-base cursor-pointer transition-colors duration-200 hover:bg-[#003bb3] active:translate-y-[1px]"
              >
                Create account
              </button>

              {showValidation && (
                <div className={styles.passwordValidation}>
                  <PasswordProgress strength={passwordStrength} />
                  <div className={styles.passwordErrors}>
                    <p>
                      <Image
                        src={
                          passwordErrors.length
                            ? successTickSVGIcon
                            : crossImage
                        }
                        alt={passwordErrors.length ? "Valid" : "Invalid"}
                        className={styles.icon}
                        width={20}
                        height={20}
                      />
                      <span>8 characters minimum</span>
                    </p>
                    <p>
                      <Image
                        src={
                          passwordErrors.number
                            ? successTickSVGIcon
                            : crossImage
                        }
                        alt={passwordErrors.number ? "Valid" : "Invalid"}
                        className={styles.icon}
                        width={20}
                        height={20}
                      />
                      <span>a number</span>
                    </p>
                    <p>
                      <Image
                        src={
                          passwordErrors.symbol
                            ? successTickSVGIcon
                            : crossImage
                        }
                        alt={passwordErrors.symbol ? "Valid" : "Invalid"}
                        className={styles.icon}
                        width={20}
                        height={20}
                      />
                      <span>a symbol</span>
                    </p>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
