import { useState, ReactNode } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"
import { useAuth } from "@/context/AuthContext"
import AuthModal from "@/components/AuthModal"

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

  return (
    <div className="min-h-screen bg-[#060E0A] text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-black/60 backdrop-blur border-b border-white/10">
        <Link to="/" className="flex items-center gap-2 px-4 py-2 bg-black/40 ring-1 ring-eco/30 backdrop-blur rounded-full">
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
                  : "bg-black/40 ring-1 ring-white/20 backdrop-blur hover:bg-black/50"
                }`}
            >
              <Icon name={item.icon} size={14} />
              {item.label}
            </Link>
          ))}
        </div>

        {/* Auth controls */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 ring-1 ring-white/15 rounded-full text-sm">
                <Icon name="User" size={14} className="text-eco" />
                <span className="text-white/80 max-w-[120px] truncate">{user.name}</span>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 bg-black/40 ring-1 ring-white/20 backdrop-blur rounded-full hover:bg-black/50 transition-colors text-sm text-white/70"
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
            className="md:hidden p-2 rounded-full bg-black/40 ring-1 ring-white/20"
            onClick={() => setMenuOpen(v => !v)}
          >
            <Icon name={menuOpen ? "X" : "Menu"} size={18} />
          </button>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur border-b border-white/10 px-6 py-4 space-y-2 z-40">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors
                ${location.pathname === item.href ? "bg-eco/15 text-eco" : "text-white/70 hover:bg-white/5"}`}
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
