// Next's Imports
import Link from "next/link";
import { Phone } from "lucide-react";

// App's Internal Imports
import { Vortex } from "@/components/ui/vortex";

const secretaries = [
  {
    name: "Varun Rahatgaonkar",
    role: "Secretary",
    phone: "9372148550",
  },
  {
    name: "Tanaya Jain",
    role: "Secretary",
    phone: "9594622999",
  },
];

const Contact = () => {
  return (
    <div
      id="contact"
      className="w-[90%] mx-auto rounded-md min-h-[34rem] md:min-h-[32rem] overflow-hidden -mt-20 md:-mt-10"
    >
      <Vortex
        backgroundColor="black"
        className="flex items-center flex-col justify-center px-2 md:px-10 py-8 w-full h-full"
      >
        <h2 className="text-white text-2xl md:text-5xl font-bold text-center">
          Connect with Quest IT
        </h2>

        <p className="text-white text-sm md:text-xl max-w-xl mt-4 text-center">
          Reach out or meet our team.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <Link
            href="mailto:questit@ves.ac.in"
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset]"
          >
            Contact Us
          </Link>

          <Link href="/team" className="px-4 py-2 text-white hover:text-cyan-400 transition duration-200">
            Meet the Team
          </Link>
        </div>

        <h3 className="text-white text-xl md:text-3xl font-bold text-center mt-10 mb-6">
          Contact Our Secretaries
        </h3>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-3xl px-4">
          {secretaries.map((secretary, index) => (
            <div
              key={index}
              className="bg-neutral-900/60 border border-neutral-800 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center justify-center w-full sm:w-72 transition duration-300 hover:border-cyan-500/40"
            >
              <h4 className="text-white text-lg md:text-xl font-bold text-center">
                {secretary.name}
              </h4>
              <p className="text-cyan-400 text-sm font-medium mt-1">
                {secretary.role}
              </p>
              <a
                href={`tel:${secretary.phone}`}
                className="mt-4 px-6 py-2 bg-cyan-600 hover:bg-cyan-700 transition duration-200 rounded-xl text-white flex items-center gap-2 text-sm font-medium shadow-md"
              >
                <Phone className="w-4 h-4 text-pink-400 fill-pink-400/20" />
                <span>{secretary.phone}</span>
              </a>
            </div>
          ))}
        </div>
      </Vortex>
    </div>
  );
};

export default Contact;