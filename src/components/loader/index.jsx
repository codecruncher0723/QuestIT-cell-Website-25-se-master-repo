// App's Internal Imports
import loading_animation from "../../../public/animations/loading.json";

// App's External Imports
import { Lottie } from "lottie-react";

const Loader = ({ className }) => {
  return (
    <div className={className}>
      <Lottie src={loading_animation} />
    </div>
  );
};

export default Loader;
