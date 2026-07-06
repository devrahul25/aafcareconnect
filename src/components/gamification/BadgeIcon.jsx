import { Footprints, Award, Flame, BookOpen, GraduationCap, ShieldCheck, Sunrise, Trophy, Star, BadgeCheck } from "lucide-react";

const MAP = { Footprints, Award, Flame, BookOpen, GraduationCap, ShieldCheck, Sunrise, Trophy, Star };

export default function BadgeIcon({ name, size = 16, className = "" }) {
  const Icon = MAP[name] || BadgeCheck;
  return <Icon size={size} className={className} />;
}