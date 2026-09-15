import {
  Activity,
  Bot,
  FileCheck2,
  Gavel,
  Rocket,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  enabled: boolean;
};

export const navigationItems: NavigationItem[] = [
  { label: "Live Console", href: "/app", icon: Activity, enabled: true },
  { label: "Receipts", href: "/app/receipts", icon: FileCheck2, enabled: false },
  { label: "Challenges", href: "/app/challenges", icon: Gavel, enabled: false },
  { label: "Agents", href: "/app/agents", icon: Bot, enabled: false },
  { label: "Deployments", href: "/app/deployments", icon: Rocket, enabled: false },
  { label: "Settings", href: "/app/settings", icon: Settings, enabled: false },
];
