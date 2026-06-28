import { useEffect, useState } from "react"

export type Theme = "dark" | "light"

function getTheme(): Theme {
  return (localStorage.getItem("theme") as Theme | null) ?? "dark"
}

function applyTheme(t: Theme) {
  if (t === "dark") {
    document.documentElement.classList.add("dark")
  } else {
    document.documentElement.classList.remove("dark")
  }
  localStorage.setItem("theme", t)
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getTheme)

  // Применяем класс при изменении
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  // Слушаем изменения класса на <html> от других экземпляров хука
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const current: Theme = document.documentElement.classList.contains("dark") ? "dark" : "light"
      setTheme(prev => (prev !== current ? current : prev))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  const toggle = () => setTheme(t => (t === "dark" ? "light" : "dark"))

  return { theme, toggle }
}