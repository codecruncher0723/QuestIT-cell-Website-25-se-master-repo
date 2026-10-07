"use client";

// Next's Imports
import Link from "next/link";

// React's Imports
import { useRef } from "react";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { FlipWords } from "@/components/ui/flip-words";
import { LinkPreview } from "@/components/ui/link-preview";
import { Icon, EvervaultCard } from "@/components/ui/evervault-card";

// App's External Imports
import { Mail } from "lucide-react";
import { FaGithub as Github, FaLinkedin as Linkedin } from "react-icons/fa";
import team from "@/constants/team";

const Team = () => {
  const accordion_ref = useRef({});
  const sub_accordion_ref = useRef({});
  const container_ref = useRef(null);
  const words = ["Visionary", "Passionate", "Innovative", "Collaborative"];

  const handle_scroll_to_top = (value) => {
    const keys = Object.keys(accordion_ref.current);
    const current_index = keys.indexOf(value);

    if (current_index === 0) {
      container_ref.current?.scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
    } else {
      const previous_value = keys[current_index - 1];
      const element = accordion_ref.current[previous_value];

      setTimeout(() => {
        element?.scrollIntoView({
          block: "start",
          behavior: "smooth",
        });
      }, 100);
    }
  };

  const handle_sub_scroll = (subValue, parentValue) => {
    if (!subValue) return;

    const element = sub_accordion_ref.current[`${parentValue}-${subValue}`];

    setTimeout(() => {
      element?.scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
    }, 150);
  };

  return (
    <div
      ref={container_ref}
      className="w-full max-w-none px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto"
    >
      <div className="mx-auto text-center mb-10 lg:mb-14 pt-40">
        <div className="text-2xl md:text-3xl mx-auto font-normal text-neutral-400">
          Meet the&nbsp;
          <FlipWords words={words} />
          minds behind QuestIT
        </div>
      </div>

      <Accordion
        type="single"
        defaultValue="Faculty In-Charges"
        className="w-full flex flex-col gap-12"
        onValueChange={handle_scroll_to_top}
      >
          {team.map(({ value, title, members, subGroups }, index) => (
            <AccordionItem
              key={index}
              value={value}
              className="text-xl"
              ref={(element) => (accordion_ref.current[value] = element)}
            >
              <AccordionTrigger className="team-accordion-trigger">{title}</AccordionTrigger>

              <AccordionContent className="py-8">
                {/* If it has subGroups (nested structure), render nested accordion */}
                {subGroups && subGroups.length > 0 ? (
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full flex flex-col gap-8"
                    onValueChange={(subValue) => handle_sub_scroll(subValue, value)}
                  >
                    {subGroups.map(({ value: subValue, title: subTitle, members: subMembers }, subIndex) => (
                      <AccordionItem
                        key={subIndex}
                        value={subValue}
                        className="text-lg border-l-2 border-neutral-700 pl-4"
                        ref={(element) => (sub_accordion_ref.current[`${value}-${subValue}`] = element)}
                      >
                        <AccordionTrigger className="team-sub-accordion-trigger">{subTitle}</AccordionTrigger>

                        <AccordionContent className="py-8 relative z-10">
                          <div className="flex flex-wrap justify-center gap-10 w-full max-w-none mx-auto team-card-container-mobile">
                            {subMembers
                              .sort((a, b) => a.name.localeCompare(b.name))
                              .map(
                                (
                                  {
                                    name,
                                    image,
                                    designation,
                                    email = "questit@ves.ac.in",
                                    github = "https://github.com/QuestIT-Cell",
                                    linkedin = "https://www.linkedin.com/company/questit-vesit",
                                  },
                                  memberIndex
                                ) => (
                                  <div
                                    key={memberIndex}
                                    className="border border-white/[0.2] flex flex-col items-start w-full max-w-[17rem] sm:max-w-[19rem] md:max-w-[22rem] mx-auto p-4 relative h-[30rem]"
                                  >
                                    <Icon className="absolute h-6 w-6 -top-3 -left-3 text-white" />
                                    <Icon className="absolute h-6 w-6 -bottom-3 -left-3 text-white" />
                                    <Icon className="absolute h-6 w-6 -top-3 -right-3 text-white" />
                                    <Icon className="absolute h-6 w-6 -bottom-3 -right-3 text-white" />

                                    <EvervaultCard image={image} />

                                    <h2 className="text-white mt-4 text-lg font-semibold">
                                      {name}
                                    </h2>

                                    <p className="text-sm absolute right-[1.75rem] border font-light border-white/[0.2] rounded-full mt-4 text-white px-2 py-1 team-designation-mobile">
                                      {designation}
                                    </p>

                                    <div className="mt-4 flex gap-2">
                                      <Link
                                        aria-label="Email"
                                        href={`mailto:${email}`}
                                        className="inline-flex justify-center items-center size-8 text-sm font-semibold rounded-lg border border-neutral-700 text-neutral-400 hover:bg-neutral-700 focus:outline-none focus:bg-neutral-700 disabled:opacity-50 disabled:pointer-events-none"
                                      >
                                        <Mail className="h-4 w-4 transition text-white" />
                                      </Link>

                                      <LinkPreview
                                        url={github}
                                        aria-label="GitHub"
                                        className="inline-flex justify-center items-center size-8 text-sm font-semibold rounded-lg border border-neutral-700 text-neutral-400 hover:bg-neutral-700 focus:outline-none focus:bg-neutral-700 disabled:opacity-50 disabled:pointer-events-none"
                                      >
                                        <Github className="h-4 w-4 transition text-white" />
                                      </LinkPreview>

                                      <LinkPreview
                                        url={linkedin}
                                        aria-label="LinkedIn"
                                        className="inline-flex justify-center items-center size-8 text-sm font-semibold rounded-lg border border-neutral-700 text-neutral-400 hover:bg-neutral-700 focus:outline-none focus:bg-neutral-700 disabled:opacity-50 disabled:pointer-events-none"
                                      >
                                        <Linkedin className="h-4 w-4 transition text-white" />
                                      </LinkPreview>
                                    </div>
                                  </div>
                                )
                              )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  /* Regular members display for Faculty In-Charges */
                  <div className="flex flex-col md:grid md:grid-cols-2 gap-y-16 team-card-container-mobile">
                    {members && members.length > 0 ? (
                      members
                        .sort((a, b) =>
                          value === "Faculty In-Charges"
                            ? 0
                            : a.name.localeCompare(b.name)
                        )
                        .map(
                          (
                            {
                              name,
                              image,
                              designation,
                              email = "questit@ves.ac.in",
                              github = "https://github.com/QuestIT-Cell",
                              linkedin = "https://www.linkedin.com/company/questit-vesit",
                            },
                            memberIndex
                          ) => (
                            <div
                              key={memberIndex}
                              className="border border-white/[0.2] flex flex-col items-start w-full max-w-[17rem] sm:max-w-[19rem] md:max-w-[22rem] mx-auto p-4 relative h-[30rem]"
                            >
                              <Icon className="absolute h-6 w-6 -top-3 -left-3 text-white" />
                              <Icon className="absolute h-6 w-6 -bottom-3 -left-3 text-white" />
                              <Icon className="absolute h-6 w-6 -top-3 -right-3 text-white" />
                              <Icon className="absolute h-6 w-6 -bottom-3 -right-3 text-white" />

                              <EvervaultCard image={image} />

                              <h2 className="text-white mt-4 text-lg font-semibold">
                                {name}
                              </h2>

                              <p className="text-sm absolute right-[1.75rem] border font-light border-white/[0.2] rounded-full mt-4 text-white px-2 py-1 team-designation-mobile">
                                {designation}
                              </p>

                              <div className="mt-4 flex gap-2">
                                <Link
                                  aria-label="Email"
                                  href={`mailto:${email}`}
                                  className="inline-flex justify-center items-center size-8 text-sm font-semibold rounded-lg border border-neutral-700 text-neutral-400 hover:bg-neutral-700 focus:outline-none focus:bg-neutral-700 disabled:opacity-50 disabled:pointer-events-none"
                                >
                                  <Mail className="h-4 w-4 transition text-white" />
                                </Link>

                                {value != "Faculty In-Charges" && (
                                  <LinkPreview
                                    url={github}
                                    aria-label="GitHub"
                                    className="inline-flex justify-center items-center size-8 text-sm font-semibold rounded-lg border border-neutral-700 text-neutral-400 hover:bg-neutral-700 focus:outline-none focus:bg-neutral-700 disabled:opacity-50 disabled:pointer-events-none"
                                  >
                                    <Github className="h-4 w-4 transition text-white" />
                                  </LinkPreview>
                                )}

                                <LinkPreview
                                  url={linkedin}
                                  aria-label="LinkedIn"
                                  className="inline-flex justify-center items-center size-8 text-sm font-semibold rounded-lg border border-neutral-700 text-neutral-400 hover:bg-neutral-700 focus:outline-none focus:bg-neutral-700 disabled:opacity-50 disabled:pointer-events-none"
                                >
                                  <Linkedin className="h-4 w-4 transition text-white" />
                                </LinkPreview>
                              </div>
                            </div>
                          )
                        )
                    ) : (
                      <div className="text-center text-neutral-400 col-span-full">
                        <p>No members found in this section.</p>
                      </div>
                    )}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
    </div>
  );
};

export { Team };