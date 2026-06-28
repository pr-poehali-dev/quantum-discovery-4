import { useState, ReactNode } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"
import { useAuth } from "@/context/AuthContext"
import AuthModal from "@/components/AuthModal"
import { useTheme } from "@/hooks/useTheme"

const NAV_ITEMS = [
  { label: "Карта", href: "/map", icon: "Map" },
  { label: "Показатели", href: "/indicators", icon: "BarChart2" },
  { label: "Аналитика", href: "/analytics", icon: "TrendingUp" },
  { label: "Данные", href: "/data", icon: "Database" },
  { label: "О системе", href: "/about", icon: "Info" },
]

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { user, logout } = useAuth()
  const [showAuth, setShowAuth] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { theme, toggle } = useTheme()

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur border-b border-border">
        <Link to="/" className="flex items-center gap-2 px-4 py-2 bg-muted ring-1 ring-eco/30 backdrop-blur rounded-full">
          <Icon name="Leaf" size={18} className="text-eco" />
          <span className="font-medium">ЭкоМонитор</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm transition-colors
                ${location.pathname === item.href
                  ? "bg-eco/15 text-eco ring-1 ring-eco/30"
                  : "bg-muted ring-1 ring-border hover:bg-accent"
                }`}
            >
              <Icon name={item.icon} size={14} />
              {item.label}
            </Link>
          ))}
        </div>

        {/* Auth controls */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="p-2 rounded-full bg-muted ring-1 ring-border hover:bg-accent transition-colors"
            title={theme === "dark" ? "Светлая тема" : "Тёмная тема"}
          >
            <Icon name={theme === "dark" ? "Sun" : "Moon"} size={16} />
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-muted ring-1 ring-border rounded-full text-sm">
                <Icon name="User" size={14} className="text-eco" />
                <span className="text-muted-foreground max-w-[120px] truncate">{user.name}</span>
              </div>
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-purple-500/15 ring-1 ring-purple-500/30 rounded-full text-sm text-purple-600 dark:text-purple-300 hover:bg-purple-500/25 transition-colors"
                >
                  <Icon name="ShieldCheck" size={14} />
                  Админ
                </Link>
              )}
              <button
                onClick={logout}
                className="px-4 py-2 bg-muted ring-1 ring-border rounded-full hover:bg-accent transition-colors text-sm text-muted-foreground"
              >
                Выйти
              </button>
            </div>
          ) : (
            <Button
              onClick={() => setShowAuth(true)}
              className="bg-eco text-black hover:bg-eco/90 rounded-full px-6 font-semibold text-sm"
            >
              Войти
            </Button>
          )}

          {/* Mobile menu */}
          <button
            className="md:hidden p-2 rounded-full bg-muted ring-1 ring-border"
            onClick={() => setMenuOpen(v => !v)}
          >
            <Icon name={menuOpen ? "X" : "Menu"} size={18} />
          </button>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur border-b border-border px-6 py-4 space-y-2 z-40">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors
                ${location.pathname === item.href ? "bg-eco/15 text-eco" : "text-muted-foreground hover:bg-accent"}`}
            >
              <Icon name={item.icon} size={16} />
              {item.label}
            </Link>
          ))}
        </div>
      )}

      {children}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  )
}
