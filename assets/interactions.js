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

const dedupDemo = document.querySelector('.dedup-demo')
const dedupSize = document.querySelector('#dedup-size')
let remainingBlocks = 5
dedupDemo.hidden = false
dedupDemo.querySelectorAll('button').forEach((block) => {
  block.addEventListener('click', () => {
    if (block.getAttribute('aria-disabled') === 'true') return
    block.setAttribute('aria-disabled', 'true')
    block.setAttribute('aria-label', 'Повтор блока ' + block.textContent + ' объединён')
    remainingBlocks -= 1
    dedupSize.textContent = 'Размер примера · ' + remainingBlocks + ' КБ'
  })
})

const randomDemo = document.querySelector('.random-demo')
const randomByte = document.querySelector('#random-byte')
randomDemo.hidden = false
randomDemo.querySelector('button').addEventListener('click', () => {
  const value = Math.floor(Math.random() * 256)
  randomByte.textContent = '0x' + value.toString(16).toUpperCase().padStart(2, '0')
})

document.querySelectorAll('button.project-mark').forEach((button) => {
  button.disabled = false
  button.addEventListener('click', () => button.focus({ preventScroll: true }))
})

const apiButton = document.querySelector('.project-mark-api')
const apiExample = document.querySelector('#api-example')
let apiPinned = false

function showApiExample(show) {
  apiExample.hidden = !show
  apiButton.setAttribute('aria-expanded', String(show))
}

apiButton.addEventListener('pointerenter', (event) => {
  if (event.pointerType === 'mouse') showApiExample(true)
})
apiButton.addEventListener('pointerleave', () => showApiExample(apiPinned))
apiButton.addEventListener('click', () => {
  apiPinned = !apiPinned
  showApiExample(apiPinned)
})
apiButton.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return
  apiPinned = false
  showApiExample(false)
})

const botButton = document.querySelector('.project-mark-chat')
const botAnswer = document.querySelector('#bot-answer')
botButton.addEventListener('click', () => {
  const open = botButton.getAttribute('aria-expanded') === 'true'
  botButton.setAttribute('aria-expanded', String(!open))
  botAnswer.textContent = open ? '' : 'Книга найдена 📚'
})

const rink = document.querySelector('.hockey-rink')
const puck = rink.querySelector('.hockey-puck')
let puckPinned = false
rink.disabled = false

rink.addEventListener('click', () => {
  puckPinned = !puckPinned
  rink.setAttribute('aria-pressed', String(puckPinned))
})
rink.addEventListener('pointermove', (event) => {
  if (puckPinned || event.pointerType !== 'mouse' || !motion.matches) return
  const bounds = rink.getBoundingClientRect()
  const radius = puck.offsetWidth / 2
  const x = Math.max(radius, Math.min(bounds.width - radius, event.clientX - bounds.left))
  const y = Math.max(radius, Math.min(bounds.height - radius, event.clientY - bounds.top))
  puck.style.left = x + 'px'
  puck.style.top = y + 'px'
  rink.classList.toggle('near-goal', x >= bounds.width - 9 && Math.abs(y - bounds.height / 2) < 7)
})
rink.addEventListener('pointerleave', () => {
  if (puckPinned) return
  puck.style.removeProperty('left')
  puck.style.removeProperty('top')
  rink.classList.remove('near-goal')
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
