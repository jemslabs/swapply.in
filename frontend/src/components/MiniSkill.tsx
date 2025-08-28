import type { SkillType } from "@/lib/types";
import { Link } from "react-router-dom";

function MiniSkill({ skill }: { skill: SkillType }) {
  return (
    <Link className="flex items-center gap-3 bg-white/5 p-2 rounded-lg border w-fit hover:border-[#c084fc]" to={`/skill/${skill.id}`}>
      <img
        src={skill.image}
        alt={skill.title}
        className="w-10 h-10 rounded object-cover"
      />
      <div className="text-white text-sm">
        <p className="font-medium line-clamp-1">{skill.title}</p>
        <p className="text-white/60 text-xs line-clamp-1 max-w-[140px]">
          {skill.isRemote ? "Remote" : skill.location}
        </p>
      </div>
    </Link>
  );
  
}

export default MiniSkill;