"use client";

// App's Internal Imports
import mouse_scroll from "../../../public/animations/mouse-scroll.json";

// App's External Imports
import { Lottie } from "lottie-react";

const MouseScroll = ({ className }) => {
  return (
    <div className={className}>
      <Lottie src={mouse_scroll} />
    </div>
  );
};

export default MouseScroll;
