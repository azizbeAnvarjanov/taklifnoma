import { StrictMode, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'

const weddingDate = new Date('2026-11-15T18:00:00+05:00')
const copy = {
  UZ: { invited: 'SIZGA TAKLIFNOMA KELDI', cover: 'NIKOH TO‘YIMIZGA XUSH KELIBSIZ', open: 'OCHISH', swipe: 'SURING', continue: 'DAVOM ETISH', back: 'BOSHIGA QAYTISH', verse: '“Va U ularning qalblarini birlashtirdi”', introTop: 'AZIZ VA QADRDONLARIMIZ!', introScript: 'Biz', introBottom: 'SIZNI NIKOH TO‘YIMIZGA\nTAKLIF ETISHDAN MAMNUNMIZ', date: 'SANA', left: 'TO‘YGACHA QOLGAN VAQT', days: 'KUN', hours: 'SOAT', minutes: 'DAQIQA', seconds: 'SONIYA', month: 'NOYABR 2026', weekdays: ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'], starts: 'BOSHLANISHI 18:00 DA', program: 'DASTUR', guests: 'MEHMONLAR YIG‘ILISHI', ceremony: 'MAROSIM', dinner: 'BAYRAM DASTURXONI', end: 'YAKUNI', locationLabel: 'MANZIL', location: 'O‘TKAZILISH JOYI', locationSub: 'MUHABBAT VA NAFOSAT\nUCHRASHGAN JOY', restaurant: '“Bartiyor” restorani', map: 'GOOGLE XARITASI', yandex: 'YANDEX XARITASI', welcome: 'Xush kelibsiz', address: 'Toshkent viloyati, Qibray tumani, Olmazor ko‘chasi, 72' },
  RU: { invited: 'ВАМ ПРИШЛО ПРИГЛАШЕНИЕ', cover: 'ДОБРО ПОЖАЛОВАТЬ НА НАШУ СВАДЬБУ', open: 'ОТКРЫТЬ', swipe: 'ПРОВЕДИТЕ', continue: 'ПРОДОЛЖИТЬ', back: 'В НАЧАЛО', verse: '«И Он соединил их сердца»', introTop: 'ДОРОГИЕ НАШИ БЛИЗКИЕ!', introScript: 'Мы', introBottom: 'РАДЫ ПРИГЛАСИТЬ ВАС\nНА НАШУ СВАДЬБУ', date: 'ДАТА', left: 'ДО СВАДЬБЫ ОСТАЛОСЬ', days: 'ДНЕЙ', hours: 'ЧАСОВ', minutes: 'МИНУТ', seconds: 'СЕКУНД', month: 'НОЯБРЬ 2026', weekdays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'], starts: 'НАЧАЛО В 18:00', program: 'ПРОГРАММА', guests: 'СБОР ГОСТЕЙ', ceremony: 'ЦЕРЕМОНИЯ', dinner: 'ПРАЗДНИЧНЫЙ УЖИН', end: 'ЗАВЕРШЕНИЕ', locationLabel: 'ЛОКАЦИЯ', location: 'МЕСТО ПРОВЕДЕНИЯ', locationSub: 'ГДЕ ВСТРЕЧАЮТСЯ\nЛЮБОВЬ И ЭЛЕГАНТНОСТЬ', restaurant: 'Ресторан «Bartiyor»', map: 'GOOGLE КАРТА', yandex: 'ЯНДЕКС КАРТА', welcome: 'Добро пожаловать', address: 'Ташкентская область, Кибрайский район, улица Олмазор, 72' },
  EN: { invited: 'YOU ARE INVITED', cover: 'WELCOME TO OUR WEDDING', open: 'OPEN', swipe: 'SWIPE', continue: 'CONTINUE', back: 'BACK TO TOP', verse: '“And He united their hearts”', introTop: 'DEAR OUR LOVED ONES!', introScript: 'We', introBottom: 'ARE DELIGHTED TO INVITE YOU\nTO OUR WEDDING', date: 'THE DATE', left: 'TIME UNTIL THE WEDDING', days: 'DAYS', hours: 'HOURS', minutes: 'MINUTES', seconds: 'SECONDS', month: 'NOVEMBER 2026', weekdays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'], starts: 'STARTING AT 18:00', program: 'PROGRAM', guests: 'GUEST ARRIVAL', ceremony: 'CEREMONY', dinner: 'CELEBRATION DINNER', end: 'FAREWELL', locationLabel: 'LOCATION', location: 'THE VENUE', locationSub: 'WHERE LOVE MEETS\nELEGANCE', restaurant: '“Bartiyor” restaurant', map: 'GOOGLE MAPS', yandex: 'YANDEX MAPS', welcome: 'Welcome', address: '72 Olmazor Street, Qibray, Tashkent Region' },
}

function useCountdown() {
  const calculate = () => { const gap = Math.max(0, weddingDate - Date.now()); return { days: Math.floor(gap / 86400000), hours: Math.floor((gap / 3600000) % 24), minutes: Math.floor((gap / 60000) % 60), seconds: Math.floor((gap / 1000) % 60) } }
  const [time, setTime] = useState(calculate)
  useEffect(() => { const timer = setInterval(() => setTime(calculate()), 1000); return () => clearInterval(timer) }, [])
  return time
}

function Ornament({ dark = false }) { return <div className={`ornament ${dark ? 'dark' : ''}`}><span /><b>♡</b><span /></div> }

function NextButton({ target, t, light = false, final = false }) {
  const go = () => document.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  return <button className={`next-section ${light ? 'light' : ''}`} onClick={go}><span>{final ? t.back : t.continue}</span><i>{final ? '↑' : '↓'}</i></button>
}

function Controls({ language, setLanguage }) {
  return <header className="controls"><nav>{['RU', 'EN', 'UZ'].map((lang) => <button key={lang} className={language === lang ? 'active' : ''} onClick={() => setLanguage(lang)}>{lang}</button>)}</nav></header>
}

function Hero({ t, onOpen, opened }) {
  const [swipe, setSwipe] = useState(0)
  const [dragging, setDragging] = useState(false)
  const rail = useRef(null)
  const startX = useRef(0)
  const startSwipe = useRef(0)

  const move = (event) => {
    if (!dragging || !rail.current) return
    const max = rail.current.clientWidth - 58
    setSwipe(Math.max(0, Math.min(max, startSwipe.current + event.clientX - startX.current)))
  }
  const finish = () => {
    if (!rail.current) return
    const max = rail.current.clientWidth - 58
    setDragging(false)
    if (swipe > max * .72) { setSwipe(max); window.setTimeout(onOpen, 180) }
    else setSwipe(0)
  }
  const begin = (event) => {
    startX.current = event.clientX; startSwipe.current = swipe; setDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  return <section className="hero dark-section"><img className="photo" src="/images/wedding-studio.png" alt="Wedding couple" /><div className="shade" /><div className="hero-copy"><div className="eyebrow"><span />{opened ? t.invited : t.cover}<span /></div><h1>Uluğ‘bek <em>&</em> Malika</h1><div className="date-line"><span />15 <i>•</i> 11 <i>•</i> 2026<span /></div>{opened && <><div className="arabic">وَأَلَّفَ بَيْنَ قُلُوبِهِمْ</div><p>{t.verse}<small>Al-Anfol, 63</small></p></>}</div>{opened ? <button className="continue-button" onClick={onOpen}>{t.continue} <i>↓</i></button> : <div className="swipe-wrap"><p>{t.swipe} <span>→</span></p><div className="swipe-rail" ref={rail}><div className="swipe-fill" style={{ width: swipe + 29 }} /><span className="swipe-label">{t.open}</span><i className="swipe-arrow">→</i><button className={`swipe-knob ${dragging ? 'dragging' : ''}`} style={{ transform: `translateX(${swipe}px)` }} onPointerDown={begin} onPointerMove={move} onPointerUp={finish} onPointerCancel={finish} aria-label={t.swipe}>♙</button></div></div>}</section>
}

function Intro({ t }) { return <section id="intro" className="intro dark-section observe"><span className="chapter">01</span><img className="photo" src="/images/wedding-beach.png" alt="Wedding couple" /><div className="shade soft" /><div className="intro-copy"><p>{t.introTop}</p><strong>{t.introScript}</strong><p className="multiline">{t.introBottom}</p><div>♡</div></div><NextButton target="#date" t={t} /></section> }

function DateSection({ t }) {
  const time = useCountdown(); const values = [time.days, time.hours, time.minutes, time.seconds]; const labels = [t.days, t.hours, t.minutes, t.seconds]
  return <section id="date" className="paper date-section observe"><span className="chapter dark-chapter">02</span><div className="paper-card"><p className="section-label">{t.date}</p><h2>15 11 2026</h2><Ornament dark /><p className="section-label">{t.left}</p><div className="countdown">{values.map((v, i) => <div key={labels[i]}><b>{String(v).padStart(2, '0')}</b><small>{labels[i]}</small></div>)}</div><div className="star">✦</div><h3>{t.month}</h3><div className="weekdays">{t.weekdays.map((d) => <span key={d}>{d}</span>)}</div><div className="calendar">{Array.from({ length: 30 }, (_, i) => i + 1).map((day) => <span style={day === 1 ? { gridColumn: 7 } : undefined} className={day === 15 ? 'selected' : ''} key={day}>{day}</span>)}</div><div className="time-note">{t.starts}</div></div><NextButton target="#program" t={t} light /></section>
}

const events = [['18:00', 'guests', '♧'], ['19:00', 'ceremony', '◎'], ['20:00', 'dinner', '⌒'], ['23:00', 'end', '✣']]
function Program({ t }) { return <section id="program" className="paper program observe"><span className="chapter dark-chapter">03</span><p className="section-label">{t.program}</p><div className="timeline">{events.map(([time, label, icon], i) => <div className="event" key={time}><div className="event-icon">{icon}</div><div className={`dot ${i === 1 ? 'gold' : ''}`} /><div><b>{time}</b><p>{t[label]}</p></div></div>)}</div><div className="final-heart">♡</div><NextButton target="#venue" t={t} light /></section> }

function Venue({ t }) {
  return <section id="venue" className="venue dark-section observe"><span className="chapter">04</span><div className="silk" /><div className="venue-frame"><p className="gold-pill">✦ &nbsp; {t.locationLabel} &nbsp; ✦</p><h2>{t.location}</h2><p className="venue-sub multiline">{t.locationSub}</p><Ornament /><div className="venue-photo"><div className="building"><span /><i /><i /><i /><i /><i /></div><p>{t.restaurant}</p></div><div className="map-card"><div className="map-art"><i /><i /><i /><b>72</b><span>OLMAZOR</span></div><div className="address"><span>⌖</span><p>{t.address}</p></div><a href="https://maps.google.com/?q=Qibray+Olmazor+72" target="_blank" rel="noreferrer">⌖ &nbsp; {t.map}</a><a href="https://yandex.com/maps/?text=Qibray%20Olmazor%2072" target="_blank" rel="noreferrer">◎ &nbsp; {t.yandex}</a><footer>♡ {t.welcome} ♡</footer></div><NextButton target=".hero" t={t} final /></div></section>
}

function App() {
  const [opened, setOpened] = useState(false); const [language, setLanguage] = useState('UZ'); const t = copy[language]
  useEffect(() => { const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('visible')), { threshold: .13 }); document.querySelectorAll('.observe').forEach((el) => observer.observe(el)); return () => observer.disconnect() }, [opened])
  return <main className={opened ? 'app opened' : 'app'}><Controls language={language} setLanguage={setLanguage} />{!opened ? <Hero t={t} onOpen={() => setOpened(true)} /> : <div className="content"><Hero t={t} opened onOpen={() => document.querySelector('.intro').scrollIntoView({ behavior: 'smooth' })} /><Intro t={t} /><DateSection t={t} /><Program t={t} /><Venue t={t} /></div>}</main>
}

createRoot(document.getElementById('app')).render(<StrictMode><App /></StrictMode>)
