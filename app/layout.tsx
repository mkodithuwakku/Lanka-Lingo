import "./globals.css";

export const metadata = {
  title: "Lanka Lingo",
  description: "Conversation-first Sinhala learning with AI tutor support.",
  manifest: "/manifest.json"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
