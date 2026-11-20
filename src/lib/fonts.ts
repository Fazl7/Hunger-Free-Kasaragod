import { Fraunces, Poppins, Noto_Sans_Malayalam } from "next/font/google";

/** Headings (English): characterful variable serif. */
export const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

/** Body (English): brochure uses a Poppins-like face. */
export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

/** Malayalam body + headings. Only preloaded on /ml routes. */
export const notoMalayalam = Noto_Sans_Malayalam({
  subsets: ["malayalam"],
  variable: "--font-malayalam",
  display: "swap",
  preload: false,
});
