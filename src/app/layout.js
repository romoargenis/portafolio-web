import { IBM_Plex_Sans, IBM_Plex_Mono, Pirata_One, Bebas_Neue } from "next/font/google";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const pirataOne = Pirata_One({
  variable: "--font-pirata-one",
  weight: "400",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  weight: "400",
  subsets: ["latin"],
});

export const metadata = {
  title: "Argenis Romo Portfolio",
  description: "Communication Designer Portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} ${pirataOne.variable} ${bebasNeue.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
