
import "./globals.css";
import Navigation from "../components/Navigation";
import ChatbotWidget from "../components/ChatbotWidget";

export const metadata = {
  title: "Quản lý tuyển sinh AGU",
  description: "Hệ thống quản lý tuyển sinh AGU",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif" }}>
        <Navigation />

        {children}

        <ChatbotWidget />
      </body>
    </html>
  );
}
