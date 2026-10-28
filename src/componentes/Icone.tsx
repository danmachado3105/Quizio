import {
  Home, Grid2X2, Trophy, UserRound, Menu, X, Play, Flame, Target, Star,
  Clock3, Check, CalendarDays, Award, Zap, LockKeyhole, ArrowRight, ArrowLeft,
  ChevronDown, Info, Compass, TrendingUp, Flag, Percent, History, Search,
  SlidersHorizontal, UsersRound, Timer, Heart, Shield, Swords, Pause, Sparkles,
  ArrowUpRight, RefreshCw, Volume2, VolumeX, Bookmark, Lightbulb, Rocket,
  Globe2, Medal, Gamepad2, BookOpen, Leaf, Coins, Gift, type LucideIcon,
} from 'lucide-react'

const ICONES = {
  home: Home, grid: Grid2X2, trophy: Trophy, user: UserRound, menu: Menu, x: X,
  play: Play, flame: Flame, target: Target, star: Star, clock: Clock3, check: Check,
  calendar: CalendarDays, award: Award, zap: Zap, lock: LockKeyhole, 'arrow-right': ArrowRight,
  'arrow-left': ArrowLeft, 'chevron-down': ChevronDown, info: Info, compass: Compass,
  'trending-up': TrendingUp, flag: Flag, percent: Percent, history: History, search: Search,
  sliders: SlidersHorizontal, users: UsersRound, timer: Timer, heart: Heart, shield: Shield,
  swords: Swords, pause: Pause, sparkles: Sparkles, 'arrow-up-right': ArrowUpRight,
  refresh: RefreshCw, 'volume-2': Volume2, 'volume-x': VolumeX, bookmark: Bookmark,
  lightbulb: Lightbulb, rocket: Rocket, globe: Globe2, medal: Medal, gamepad: Gamepad2,
  'book-open': BookOpen, leaf: Leaf, coins: Coins, gift: Gift,
} satisfies Record<string, LucideIcon>

export type NomeIcone = keyof typeof ICONES
export function Icone({ nome, tamanho = 20, className }: { nome: NomeIcone; tamanho?: number; className?: string }) {
  const Componente = ICONES[nome]
  return <Componente aria-hidden="true" size={tamanho} strokeWidth={2} className={className} />
}
