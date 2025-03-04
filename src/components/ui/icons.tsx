import {
  Calendar,
  Clock,
  Home,
  Settings,
  User,
  Users,
  Bell,
  CheckCircle,
  ListTodo,
  Mic,
  Plus,
  Search,
  Info,
  X,
  Inbox,
  type LucideIcon,
  type LucideProps
} from "lucide-react";

export type Icon = LucideIcon;

export const Icons = {
  logo: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  calendar: Calendar,
  clock: Clock,
  home: Home,
  settings: Settings,
  user: User,
  users: Users,
  bell: Bell,
  checkCircle: CheckCircle,
  listTodo: ListTodo,
  mic: Mic,
  plus: Plus,
  search: Search,
  info: Info,
  close: X,
  inbox: Inbox,
}; 