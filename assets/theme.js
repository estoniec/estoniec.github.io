(() => {
  const key = 'estoniec-portfolio-theme'
  const preference = window.matchMedia('(prefers-color-scheme: dark)')
  const page = document.documentElement

  let selected
  try {
    const saved = localStorage.getItem(key)
    if (saved === 'light' || saved === 'dark') selected = saved
  } catch {
  }

  const systemTheme = () => preference.matches ? 'dark' : 'light'
  page.dataset.bsTheme = selected ?? systemTheme()

  document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('#theme-toggle')
    const label = document.querySelector('#theme-label')

    function applyTheme(theme) {
      page.dataset.bsTheme = theme
      label.textContent = theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'
    }

    applyTheme(selected ?? systemTheme())
    button.hidden = false

    button.addEventListener('click', () => {
      selected = page.dataset.bsTheme === 'dark' ? 'light' : 'dark'
      applyTheme(selected)
      try {
        localStorage.setItem(key, selected)
      } catch {
      }
    })

    preference.addEventListener('change', () => {
      if (!selected) applyTheme(systemTheme())
    })
  })
})()
