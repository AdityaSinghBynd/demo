import type { Metadata } from "next";
import "@/styles/globals.css";
import Header from "@/components/Header";
import Providers from "./providers";
import ReduxProvider from "@/lib/reduxProvider";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "Bynd Alerts",
  description: "Bynd fin-tech platform",
  icons: {
    icon: "/ByndLogoFavicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ReduxProvider>
            <Header />
            {children}
            <ToastContainer
              position="bottom-right"
              autoClose={2000}
              hideProgressBar={true}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </ReduxProvider>
        </Providers>
      </body>
    </html>
  );
}
