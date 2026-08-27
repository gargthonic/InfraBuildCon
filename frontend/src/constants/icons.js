import {
  FaHardHat,
  FaClock,
  FaLeaf,
  FaUsers,
  FaProjectDiagram,
  FaBuilding,
} from "react-icons/fa";
import {
  HiHome,
  HiBriefcase,
  HiOfficeBuilding,
  HiOutlineClipboardCheck,
  HiOutlineCurrencyDollar,
  HiOutlineUserGroup,
  HiShieldCheck,
  HiStar,
  HiSparkles,
  HiTrendingUp,
  HiBadgeCheck,
  HiGlobeAlt,
  HiOutlineOfficeBuilding,
} from "react-icons/hi";

export const ICONS = {
  HardHat: FaHardHat,
  Clock: FaClock,
  Leaf: FaLeaf,
  Users: FaUsers,
  ProjectDiagram: FaProjectDiagram,
  Building: FaBuilding,
  Home: HiHome,
  Briefcase: HiBriefcase,
  OfficeBuilding: HiOfficeBuilding,
  ClipboardCheck: HiOutlineClipboardCheck,
  CurrencyDollar: HiOutlineCurrencyDollar,
  UserGroup: HiOutlineUserGroup,
  ShieldCheck: HiShieldCheck,
  Star: HiStar,
  Sparkles: HiSparkles,
  TrendingUp: HiTrendingUp,
  BadgeCheck: HiBadgeCheck,
  Globe: HiGlobeAlt,
  OfficeBuildingOutline: HiOutlineOfficeBuilding,
};

export const ICON_OPTIONS = Object.keys(ICONS);

export function getIcon(name) {
  return ICONS[name] || HiSparkles;
}
