import { useState } from "react"
import { Button } from "@/components/ui/button"
import Icon from "@/components/ui/icon"
import { login, register } from "@/lib/auth"
import { useAuth } from "@/context/AuthContext"

interface AuthModalProps {
  onClose: () => void
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const { setUser } = useAuth()
  const [tab, setTab] = useState<"login" | "register">("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    let result
    if (tab === "login") {
      result = await login(email, password)
    } else {
      result = await register(email, name, password)
    }
    setLoading(false)
    if (result.error) { setError(result.error); return }
    if (result.user) { setUser(result.user); onClose() }
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0D1810] border border-white/15 rounded-3xl p-8 shadow-2xl">
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors">
          <Icon name="X" size={20} />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <Icon name="Leaf" size={20} className="text-eco" />
          <span className="font-semibold text-lg">ЭкоМонитор</span>
        </div>

        {/* Tabs */}
        <div className="flex rounded-full border border-white/15 overflow-hidden mb-6">
          <button
            onClick={() => { setTab("login"); setError("") }}
            className={`flex-1 py-2.5 text-sm font-semibold transition-all ${tab === "login" ? "bg-eco text-black" : "text-white/60 hover:text-white"}`}
          >
            Войти
          </button>
          <button
            onClick={() => { setTab("register"); setError("") }}
            className={`flex-1 py-2.5 text-sm font-semibold transition-all ${tab === "register" ? "bg-eco text-black" : "text-white/60 hover:text-white"}`}
          >
            Регистрация
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {tab === "register" && (
            <div>
              <label className="block text-sm text-white/60 mb-1.5">Имя и организация</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Иван Петров, Росприроднадзор"
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-eco/60 transition-colors"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="example@organization.ru"
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-eco/60 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={tab === "register" ? "Минимум 6 символов" : "Ваш пароль"}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-eco/60 transition-colors"
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
              <Icon name="AlertCircle" size={16} />
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-eco text-black hover:bg-eco/90 rounded-xl py-3 font-semibold text-base"
          >
            {loading ? <Icon name="Loader2" size={18} className="animate-spin mx-auto" /> : (tab === "login" ? "Войти в систему" : "Создать аккаунт")}
          </Button>
        </form>
      </div>
    </div>
  )
}
