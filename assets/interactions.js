const nameButton = document.querySelector('.hero-name')
const motion = window.matchMedia('(prefers-reduced-motion: no-preference)')

nameButton.disabled = false
let nameAnimations = []
nameButton.addEventListener('click', () => {
  nameAnimations.forEach((animation) => animation.cancel())
  if (!motion.matches) return

  nameAnimations = [...nameButton.querySelectorAll('.name-line')].map((line, index) =>
    line.animate(
      [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 -2rem 0 0)' }],
      { duration: 360, delay: index * 360, easing: 'steps(6, end)', fill: 'backwards' }
    )
  )
})

const aboutToggle = document.querySelector('.about-toggle')
const aboutStory = document.querySelector('#about-story')
const aboutCode = document.querySelector('#about-code')
aboutToggle.hidden = false
aboutToggle.addEventListener('click', () => {
  const showCode = aboutCode.hidden
  aboutCode.hidden = !showCode
  aboutStory.hidden = showCode
  aboutToggle.setAttribute('aria-pressed', String(showCode))
})

const progress = document.querySelector('.reading-progress')
const dotNav = document.querySelector('.section-dots')
const dots = [...dotNav.querySelectorAll('a')].map((link) => ({
  link,
  section: document.getElementById(link.hash.slice(1))
}))
dotNav.hidden = false

let scrollFrame = 0
function updateScrollIndicators() {
  scrollFrame = 0
  const page = document.documentElement
  const maxScroll = page.scrollHeight - page.clientHeight
  const ratio = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0
  progress.style.transform = 'scaleX(' + ratio + ')'

  const readingLine = page.clientHeight * 0.35
  let current
  for (const dot of dots) {
    if (dot.section.getBoundingClientRect().top <= readingLine) current = dot
  }
  if (ratio >= 0.999) current = dots.at(-1)
  for (const dot of dots) {
    if (dot === current) dot.link.setAttribute('aria-current', 'location')
    else dot.link.removeAttribute('aria-current')
  }
}

function scheduleScrollUpdate() {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollIndicators)
}

window.addEventListener('scroll', scheduleScrollUpdate, { passive: true })
window.addEventListener('resize', scheduleScrollUpdate)
new ResizeObserver(scheduleScrollUpdate).observe(document.body)
updateScrollIndicators()
