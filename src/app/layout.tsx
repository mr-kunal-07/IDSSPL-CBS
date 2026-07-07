import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const metadata = {
  title: "IDSSPL",
  description: "Core Banking Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
        {children}
        <ToastContainer theme="dark" />
      </body>
    </html>
  );
}

