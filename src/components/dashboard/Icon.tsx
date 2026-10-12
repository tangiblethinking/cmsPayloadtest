import {
  Home, BookOpen, HeartPulse, Briefcase, Globe, Award, Users, Inbox, RefreshCw, Share2, Network, Star, BarChart3,
  Video, GraduationCap, Layers, User, Trophy, Box, Calendar, Activity, type LucideIcon,
} from 'lucide-react'

const map: Record<string, LucideIcon> = {
  home: Home, book: BookOpen, heart: HeartPulse, briefcase: Briefcase, globe: Globe, award: Award, users: Users,
  inbox: Inbox, refresh: RefreshCw, share: Share2, network: Network, star: Star, chart: BarChart3, video: Video,
  grad: GraduationCap, layers: Layers, user: User, trophy: Trophy, box: Box, calendar: Calendar, pulse: Activity,
}

export function Icon({ name, size = 16 }: { name: string; size?: number }) {
  const C = map[name] ?? Star
  return <C size={size} strokeWidth={1.8} aria-hidden />
}
