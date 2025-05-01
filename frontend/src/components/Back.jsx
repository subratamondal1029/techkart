import { ArrowLeft } from "lucide-react";
import Button from "./Button";

const Back = ({ classname = "" }) => {
  const back = () => {
    const history = window.history;
    if (history.length > 1) {
      history.back();
    } else navigate("/");
  };

  return (
    <Button
      type="button"
      classname={`flex items-center justify-start absolute top-20 left-4 ${classname}`}
      onClick={back}
    >
      <ArrowLeft size={20} />
      Go back
    </Button>
  );
};

export default Back;
