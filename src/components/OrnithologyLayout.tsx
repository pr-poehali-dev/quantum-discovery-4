import { useState, ReactNode } from "react"
import { Link, useLocation } from "react-router-dom"
import Icon from "@/components/ui/icon"
import { useTheme } from "@/hooks/useTheme"

const NAV_SECTIONS = [
  {
    group: "Основное",
    items: [
      { label: "Главная панель",    href: "/",              icon: "LayoutDashboard" },
      { label: "Сессии учёта",      href: "/sessions",      icon: "ClipboardList" },
      { label: "Наблюдения",        href: "/observations",  icon: "Eye" },
      { label: "Карта",             href: "/map",           icon: "Map" },
    ],
  },
  {
    group: "Аналитика",
    items: [
      { label: "Аналитика",         href: "/analytics",     icon: "BarChart2" },
      { label: "Отчёты",            href: "/reports",       icon: "FileText" },
      { label: "Экспорт",           href: "/export",        icon: "Download" },
      { label: "Импорт",            href: "/import",        icon: "Upload" },
    ],
  },
  {
    group: "Управление",
    items: [
      { label: "Справочники",       href: "/dictionaries",  icon: "BookOpen" },
      { label: "Администрирование", href: "/admin",         icon: "Settings" },
      { label: "Журнал аудита",     href: "/audit",         icon: "ScrollText" },
    ],
  },
]

const STATUS_BADGE: Record<string, { label: string; color: string }> = {
  draft:              { label: "Черновик",            color: "bg-muted text-muted-foreground" },
  submitted:          { label: "На проверке",         color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  needs_clarification:{ label: "Требует уточнения",   color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
  confirmed:          { label: "Подтверждено",        color: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" },
  rejected:           { label: "Отклонено",           color: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
  archived:           { label: "Архив",               color: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400" },
}

export { STATUS_BADGE }

interface OrnithologyLayoutProps {
  children: ReactNode
}

export default function OrnithologyLayout({ children }: OrnithologyLayoutProps) {
  const location = useLocation()
  const { theme, toggle } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href)

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border flex flex-col
          transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:relative lg:translate-x-0 lg:flex
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-bird/15 ring-1 ring-bird/30 flex items-center justify-center flex-shrink-0">
            <Icon name="Bird" size={18} className="text-bird" />
          </div>
          <div>
            <div className="font-bold text-sm leading-tight">Орнитология</div>
            <div className="text-xs text-muted-foreground leading-tight">Web-портал</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {NAV_SECTIONS.map(section => (
            <div key={section.group}>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-1.5">
                {section.group}
              </div>
              <ul className="space-y-0.5">
                {section.items.map(item => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors
                        ${isActive(item.href)
                          ? "bg-bird/10 text-bird font-medium"
                          : "text-foreground hover:bg-muted"
                        }`}
                    >
                      <Icon name={item.icon} size={16} className={isActive(item.href) ? "text-bird" : "text-muted-foreground"} />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-border space-y-1">
          <button
            onClick={toggle}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
          >
            <Icon name={theme === "dark" ? "Sun" : "Moon"} size={16} className="text-muted-foreground" />
            {theme === "dark" ? "Светлая тема" : "Тёмная тема"}
          </button>
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground">
            <div className="w-6 h-6 rounded-full bg-bird/15 flex items-center justify-center">
              <Icon name="User" size={12} className="text-bird" />
            </div>
            <span className="truncate">Администратор</span>
          </div>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar mobile */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-background sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Icon name="Menu" size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Icon name="Bird" size={18} className="text-bird" />
            <span className="font-bold text-sm">Орнитология</span>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
