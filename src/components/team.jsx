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
import { Icon, EvervaultCard } from "@/components/ui/evervault-card";
import { PolaroidClothesline } from "@/components/polaroid-clothesline";

// App's External Imports
import { motion, MotionConfig } from "framer-motion";
import { Mail, Github, Linkedin } from "lucide-react";
import team from "@/constants/team";

// Only the current council gets the card animations
const CURRENT_COUNCIL = "Quest IT Council 2026-27";

// Cards fade and slide up one after another when the dropdown opens
const card_entrance = (index) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut", delay: Math.min(index, 8) * 0.06 },
});

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
    <MotionConfig reducedMotion="user">
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
                          {value === CURRENT_COUNCIL ? (
                            <PolaroidClothesline members={subMembers} title={subTitle} subtitle={title} />
                          ) : (
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
                                  <motion.div
                                    key={memberIndex}
                                    {...(value === CURRENT_COUNCIL ? card_entrance(memberIndex) : {})}
                                    className="border border-white/[0.2] flex flex-col items-start w-full max-w-[17rem] sm:max-w-[19rem] md:max-w-[22rem] mx-auto p-4 relative h-[30rem]"
                                  >
                                    <Icon className="absolute h-6 w-6 -top-3 -left-3 text-white" />
                                    <Icon className="absolute h-6 w-6 -bottom-3 -left-3 text-white" />
                                    <Icon className="absolute h-6 w-6 -top-3 -right-3 text-white" />
                                    <Icon className="absolute h-6 w-6 -bottom-3 -right-3 text-white" />

                                    <EvervaultCard image={image} zoom={value === CURRENT_COUNCIL} />

                                    <h2 className="text-white mt-4 text-lg font-semibold">
                                      {name}
                                    </h2>

                                    <p className={`${value === CURRENT_COUNCIL ? "text-base team-designation-current" : "text-sm"} absolute right-[1.75rem] border font-light border-white/[0.2] rounded-full mt-4 text-white px-2 py-1 team-designation-mobile`}>
                                      {designation}
                                    </p>

                                    <div className="mt-4 flex items-center divide-x divide-white/20">
                                      <Link
                                        aria-label="Email"
                                        href={`mailto:${email}`}
                                        className="inline-flex justify-center items-center h-6 px-3 first:pl-0 text-white transition hover:text-cyan-300 focus:outline-none focus-visible:text-cyan-300"
                                      >
                                        <Mail className="size-[22px]" />
                                      </Link>

                                      <a
                                        href={github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="GitHub"
                                        className="inline-flex justify-center items-center h-6 px-3 first:pl-0 text-white transition hover:text-cyan-300 focus:outline-none focus-visible:text-cyan-300"
                                      >
                                        <Github className="size-[22px]" />
                                      </a>

                                      <a
                                        href={linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="LinkedIn"
                                        className="inline-flex justify-center items-center h-6 px-3 first:pl-0 text-white transition hover:text-cyan-300 focus:outline-none focus-visible:text-cyan-300"
                                      >
                                        <Linkedin className="size-[22px]" />
                                      </a>
                                    </div>
                                  </motion.div>
                                )
                              )}
                          </div>
                          )}
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

                              <div className="mt-4 flex items-center divide-x divide-white/20">
                                <Link
                                  aria-label="Email"
                                  href={`mailto:${email}`}
                                  className="inline-flex justify-center items-center h-6 px-3 first:pl-0 text-white transition hover:text-cyan-300 focus:outline-none focus-visible:text-cyan-300"
                                >
                                  <Mail className="size-[22px]" />
                                </Link>

                                {value != "Faculty In-Charges" && (
                                  <a
                                    href={github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="GitHub"
                                    className="inline-flex justify-center items-center h-6 px-3 first:pl-0 text-white transition hover:text-cyan-300 focus:outline-none focus-visible:text-cyan-300"
                                  >
                                    <Github className="size-[22px]" />
                                  </a>
                                )}

                                <a
                                  href={linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label="LinkedIn"
                                  className="inline-flex justify-center items-center h-6 px-3 first:pl-0 text-white transition hover:text-cyan-300 focus:outline-none focus-visible:text-cyan-300"
                                >
                                  <Linkedin className="size-[22px]" />
                                </a>
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
    </MotionConfig>
  );
};

export { Team };