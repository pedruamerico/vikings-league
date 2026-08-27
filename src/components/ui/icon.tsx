import {
  BarChart3,
  Eye,
  Globe,
  Goal,
  GraduationCap,
  Hand,
  LineChart,
  Megaphone,
  Play,
  Network,
  Radio,
  Repeat,
  Send,
  Shield,
  ShieldCheck,
  Star,
  Shirt,
  ShoppingBag,
  Swords,
  Target,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { IconName } from "@/content/content";

const icons: Record<IconName, LucideIcon> = {
  eye: Eye,
  swords: Swords,
  "bar-chart-3": BarChart3,
  network: Network,
  shirt: Shirt,
  megaphone: Megaphone,
  radio: Radio,
  users: Users,
  "line-chart": LineChart,
  trophy: Trophy,
  target: Target,
  shield: Shield,
  hand: Hand,
  goal: Goal,
  send: Send,
  repeat: Repeat,
  "shield-check": ShieldCheck,
  star: Star,
  "graduation-cap": GraduationCap,
  play: Play,
  globe: Globe,
  "trophy-outline": Trophy,
  "shopping-bag": ShoppingBag,
};

type IconProps = {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
  "aria-hidden"?: boolean;
};

export function Icon({ name, size = 18, strokeWidth = 1.6, className }: IconProps) {
  const Component = icons[name];
  return (
    <Component
      width={size}
      height={size}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden
    />
  );
}
