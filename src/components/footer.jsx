// Next's Imports
import Link from "next/link";
import Image from "next/image";

// App's Internal Imports
import menu from "@/constants/menu";
import { fetch_current_year } from "@/modules/utils";
import { LinkPreview } from "@/components/ui/link-preview";

// App's External Imports
import { FaGithub as Github, FaLinkedin as Linkedin, FaInstagram as Instagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative z-10 clear-both block w-full shrink-0 overflow-hidden bg-neutral-900">
      <div
        className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 sm:px-6 lg:px-8"
        style={{ paddingBlock: "clamp(1.5rem, 4vw, 3rem)" }}
      >
        <Link
          href="/#home"
          className="block w-full"
          style={{ maxWidth: "clamp(180px, 28vw, 460px)" }}
        >
          <Image
            width={460}
            height={242}
            loading="lazy"
            alt="Footer Icon"
            src="/images/logo-460.webp"
            className="h-auto w-full"
          />
        </Link>

        <ul className="mt-[clamp(1rem,2.5vw,1.5rem)] flex w-full flex-wrap items-center justify-center gap-x-[clamp(1rem,3vw,3rem)] gap-y-2 text-center text-sm sm:text-base">
          {menu.map(({ name, path, dropdown, external }, index) => (
            <li key={index} className="relative group">
              {dropdown ? (
                <>
                  <span className="text-white transition hover:text-[#00A3FF] cursor-pointer">
                    {name}
                  </span>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-32 bg-neutral-800 rounded-md shadow-lg py-1 z-50">
                    {dropdown.map((item, subIndex) => (
                      <Link
                        key={subIndex}
                        href={item.path}
                        className="block px-4 py-2 text-sm text-gray-200 hover:bg-neutral-700 hover:text-[#00A3FF] transition"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </>
              ) : external ? (
                <a
                  href={path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white transition hover:text-[#00A3FF]"
                >
                  {name}
                </a>
              ) : (
                <Link
                  href={path}
                  className="text-white transition hover:text-[#00A3FF]"
                >
                  {name}
                </Link>
              )}
            </li>
          ))}

        </ul>

        <ul className="mt-[clamp(1.25rem,3vw,2.5rem)] flex w-full flex-wrap items-center justify-center gap-x-[clamp(1rem,2.5vw,2rem)] gap-y-3 px-0 text-center text-sm sm:text-base">
          <li className="basis-full text-[#C7C7C7] sm:basis-auto">
            &copy; {fetch_current_year()}{" "}
            <Link href="/#home" className="hover:!text-[#00A3FF] transition">
              QuestIT
            </Link>
          </li>

          <li>
            <LinkPreview
              aria-label="GitHub"
              url="https://github.com/QuestIT-Cell"
            >
              <Github className="h-6 w-6 transition text-white hover:text-[#00A3FF]" />
            </LinkPreview>
          </li>

          <li>
            <LinkPreview
              aria-label="LinkedIn"
              url="https://www.linkedin.com/company/questit-vesit"
            >
              <Linkedin className="h-6 w-6 transition text-white hover:text-[#00A3FF]" />
            </LinkPreview>
          </li>

          <li>
            <LinkPreview
              aria-label="Instagram"
              url="https://www.instagram.com/questit_cell?igsh=MWgzNGdzYnUxanF5Yg=="
            >
              <Instagram className="h-6 w-6 transition text-white hover:text-[#00A3FF]" />
            </LinkPreview>
          </li>

          <li className="text-[#C7C7C7] flex gap-2 sm:gap-2">v1.2.1</li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;