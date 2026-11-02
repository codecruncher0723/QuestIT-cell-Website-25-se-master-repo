// App's Internal Imports
import Home from "@/components/home";
import HomeSections from "@/components/home-sections";
import { root } from "@/constants/metadata";
import { TracingBeam } from "@/components/ui/tracing-beam";

export const metadata = root;

const Root = () => {
  return (
    <TracingBeam className="w-full max-w-none px-4 md:px-10 mb-7">
      <Home />
      <HomeSections />
    </TracingBeam>
  );
};

export default Root;
