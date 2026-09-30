import "./globals.css";

export const metadata = {
  title: "Lanka Lingo",
  description: "A Chrome-first Sinhala conversation companion for a comprehension-strong heritage learner.",
  manifest: "/manifest.json"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
