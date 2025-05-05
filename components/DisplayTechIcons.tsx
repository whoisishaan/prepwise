import { cn } from "@/lib/utils";

const DisplayTechIcons = ({ techStack }: TechIconProps) => {
  return (
    <div className="flex flex-row">
      {techStack.slice(0, 3).map((tech, index) => (
        <div
          key={tech}
          className={cn(
            "relative group bg-dark-300 rounded-full p-2 flex flex-center text-white text-sm",
            index >= 1 && "-ml-3"
          )}
        >
          <span className="tech-tooltip">{tech}</span>
          <span>{tech}</span>
        </div>
      ))}
    </div>
  );
};

export default DisplayTechIcons;
