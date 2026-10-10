"use client";

// React's Hook Imports
import { useState, useEffect } from "react";

// App's Internal Imports
import menu from "@/constants/menu";
import { InstallPromptButton } from "./utils";

// App's External Imports
// App's External Imports
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X, ExternalLink } from "lucide-react";

const Header = () => {
  const [is_sticky, set_is_sticky] = useState(false);
  const [is_hidden, set_is_hidden] = useState(false);
  const [is_sidebar_open, set_is_sidebar_open] = useState(false);
  const [open_dropdown, set_open_dropdown] = useState(null);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Make sticky once scrolled past top threshold
      if (currentScrollY >= 60) {
        set_is_sticky(true);
      } else {
        set_is_sticky(false);
      }

      // Hide/push back navbar when scrolling down, show when scrolling up
      if (currentScrollY > 70 && currentScrollY > lastScrollY + 4) {
        set_is_hidden(true);
      } else if (currentScrollY < lastScrollY - 4 || currentScrollY <= 30) {
        set_is_hidden(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Prevent scroll when sidebar is open
  useEffect(() => {
    if (is_sidebar_open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      set_open_dropdown(null); // Reset dropdown when closing sidebar
    }
  }, [is_sidebar_open]);

  const toggle_dropdown = (name) => {
    set_open_dropdown(open_dropdown === name ? null : name);
  };

  return (
    <>
      <header
        className={`flex left-0 top-0 w-full items-center z-[10000] transition-all duration-300 ease-in-out ${
          is_hidden && !is_sidebar_open
            ? "-translate-y-full opacity-0 pointer-events-none"
            : "translate-y-0 opacity-100"
        } ${
          is_sticky
            ? "fixed w-full border-b border-white/10 py-2 backdrop-blur-[12px] bg-black/85 shadow-[0_4px_25px_rgba(0,0,0,0.8)]"
            : "absolute bg-black py-4"
        }`}
      >
        <div className="w-full px-4 md:px-8 lg:px-12">
          <div className="relative w-full flex items-center justify-between min-h-[60px]">
            {/* Mobile Hamburger Button - Left */}
            <div className="lg:hidden z-20">
              <button
                onClick={() => set_is_sidebar_open(true)}
                className="p-2 text-white hover:text-cyan-400 transition-colors"
                aria-label="Open Menu"
              >
                <Menu size={32} />
              </button>
            </div>

            {/* Logo - Centered on mobile, Left on desktop */}
            <div className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 w-[210px] md:w-[220px] lg:w-[240px] max-w-full z-10 flex-shrink-0">
              <Link href="/" className="block w-full">
                <Image
                  priority
                  width={240}
                  height={80}
                  unoptimized
                  alt="Header Icon"
                  className="w-full h-auto"
                  src="/images/logo.png"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="flex items-center justify-end flex-1 pr-4 lg:pr-0">
              <nav className="invisible absolute right-5 top-[120%] z-30 rounded border-[0.5px] bg-white px-6 py-4 duration-300 lg:visible lg:static lg:w-auto lg:border-none lg:p-0 lg:opacity-100 lg:bg-transparent">
                <ul className="block lg:flex lg:gap-x-4 xl:gap-x-8 items-center">
                  {menu.map((item, index) => (
                    <li key={index} className="relative group">
                      {item.dropdown ? (
                        <>
                          <button className="relative overflow-hidden group/btn flex items-center py-2 text-base lg:text-base font-medium hover:text-cyan-300 lg:inline-flex lg:px-2 lg:py-6 text-white border-b-0 cursor-pointer">
                            <span className="absolute inset-0 bg-cyan-500/20 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300 ease-in-out"></span>
                            <span className="relative z-10 flex items-center gap-1">
                              {item.name}
                              <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                            </span>
                          </button>
                          <ul className="absolute left-0 top-full pt-2 w-48 hidden group-hover:block transition-all duration-300 ease-in-out z-50">
                            <div className="bg-black border border-neutral-800 rounded-md overflow-hidden shadow-xl">
                              {item.dropdown.map((subItem, subIndex) => (
                                <li key={subIndex} className="border-b border-neutral-800 last:border-none">
                                  <Link
                                    href={subItem.path}
                                    className="block px-4 py-3 text-sm text-gray-300 hover:text-cyan-300 hover:bg-neutral-900 transition-colors relative overflow-hidden group/link"
                                  >
                                    <span className="absolute inset-0 bg-cyan-500/10 -translate-x-full group-hover/link:translate-x-0 transition-transform duration-300 ease-in-out"></span>
                                    <span className="relative z-10">{subItem.name}</span>
                                  </Link>
                                </li>
                              ))}
                            </div>
                          </ul>
                        </>
                      ) : (
                        <Link
                          href={item.path}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noopener noreferrer" : undefined}
                          className={`relative overflow-hidden group/link flex py-2 text-base lg:text-base font-medium hover:text-cyan-300 lg:inline-flex items-center text-white border-b-0 ${item.special ? "lg:px-3 lg:py-1.5 bg-neutral-800 rounded-[1.5rem] border border-neutral-700 hover:border-cyan-500/50 ml-1" : "lg:px-1.5 lg:py-6"}`}
                        >
                          {!item.special && <span className="absolute inset-0 bg-cyan-500/20 -translate-x-full group-hover/link:translate-x-0 transition-transform duration-300 ease-in-out"></span>}
                          <span className="relative z-10 flex items-center gap-1.5">
                            {item.special && <span className="text-cyan-500 group-hover/link:text-cyan-400 transition-colors">{item.icon}</span>}
                            <span className={item.special ? "group-hover/link:text-cyan-300 transition-colors text-sm" : ""}>{item.name}</span>
                          </span>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Menu */}
      <div
        className={`fixed inset-0 z-[10001] lg:hidden transition-all duration-500 ease-in-out ${is_sidebar_open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      >
        {/* Backdrop - Click to close */}
        <div
          className="absolute inset-0 bg-black/80"
          onClick={() => set_is_sidebar_open(false)}
        />

        {/* Sidebar Content */}
        <div
          className={`absolute top-0 left-0 h-full w-[310px] bg-gradient-to-b from-black via-zinc-950 to-black border-r border-neutral-800 shadow-2xl transition-transform duration-500 ease-in-out ${is_sidebar_open ? "translate-x-0" : "-translate-x-full"
            } flex flex-col p-6 overflow-y-auto`}
        >
          <div className="flex justify-between items-center mb-2">
            <div className="w-[190px]">
              <Image
                src="/images/logo.png"
                width={190}
                height={65}
                alt="Logo"
                unoptimized
              />
            </div>
            <button
              onClick={() => set_is_sidebar_open(false)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X size={28} />
            </button>
          </div>

          <div className="h-px w-full bg-white/20 mb-2" />

          <nav className="flex-1">
            <ul className="space-y-1">
              {menu.map((item, index) => (
                <li key={index} className="overflow-hidden">
                  {index !== 0 && <div className="h-px w-full bg-white/5 my-1" />}
                  {item.dropdown ? (
                    <div className="space-y-2">
                      <button
                        onClick={() => toggle_dropdown(item.name)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${open_dropdown === item.name ? "bg-cyan-500/10 text-cyan-400" : "text-gray-200 hover:bg-neutral-900"
                          }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg transition-colors text-cyan-500 ${open_dropdown === item.name ? "bg-cyan-500/20" : "bg-neutral-900"
                            }`}>
                            {item.icon}
                          </div>
                          <span className="text-xl font-semibold tracking-tight">{item.name}</span>
                        </div>
                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${open_dropdown === item.name ? "rotate-180" : ""}`} />
                      </button>

                      <div
                        className={`grid transition-all duration-300 ease-in-out ${open_dropdown === item.name ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"
                          }`}
                      >
                        <div className="overflow-hidden">
                          <ul className="pl-6 space-y-2 border-l-2 border-neutral-800 ml-6">
                            {item.dropdown.map((subItem, subIndex) => (
                              <li key={subIndex}>
                                <Link
                                  href={subItem.path}
                                  onClick={() => set_is_sidebar_open(false)}
                                  className="flex items-center gap-3 py-2 text-gray-400 hover:text-cyan-400 transition-colors"
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-700 group-hover:bg-cyan-500"></div>
                                  <span className="text-lg font-medium">{subItem.name}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.path}
                      onClick={() => set_is_sidebar_open(false)}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      className="flex items-center gap-4 p-3 text-gray-200 hover:text-cyan-400 hover:bg-neutral-900 rounded-xl transition-all group"
                    >
                      <div className="p-2 bg-neutral-900 text-cyan-500 rounded-lg group-hover:bg-cyan-500/20 transition-all">
                        {item.icon}
                      </div>
                      <span className="text-xl font-semibold tracking-tight flex-1">
                        {item.name}
                      </span>
                      {item.external && <ExternalLink size={14} className="opacity-40" />}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto pt-4 border-t border-neutral-800/50 flex flex-col items-center">
            <p className="text-neutral-500 text-sm mb-2">© {new Date().getFullYear()} QuestIT</p>
            <div className="flex gap-4">
              {/* Social icons could go here if available */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;