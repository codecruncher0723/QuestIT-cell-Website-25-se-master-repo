// App's Internal Imports
import EventsSplitChart from "./events-split-chart";
import MembersSplitChart from "./members-split-chart";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

const About = () => {
  const about = `QuestIT, the tech cell of VESIT's IT department, provides students a platform to learn, compete, and enjoy through various technical and non-technical events.`;

  const words = [
    {
      text: "Discover",
    },
    {
      text: "Who",
    },
    {
      text: "We Are",
      className: "!text-cyan-300",
    },
  ];

  return (
    <div id="about" className="px-4">
      <TypewriterEffect words={words} className="pb-12" />

      <TextGenerateEffect
        words={about}
        className="bg-neutral-900 rounded-xl p-7 w-full max-w-none mx-auto"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 w-full max-w-none mx-auto gap-6 my-6">
        <EventsSplitChart />
        <MembersSplitChart />
      </div>
    </div>
  );
};

export default About;
