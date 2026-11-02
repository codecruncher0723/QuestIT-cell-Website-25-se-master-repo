// App's External Imports
import { Poppins } from "next/font/google";

const poppins = Poppins({
  display: "swap",
  preload: false,
  style: ["normal"],
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default poppins;
