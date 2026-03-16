import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { heroSlides } from '../../data/products'

export default function HeroBanner() {
  const [active, setActive] = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const t = setInterval(() => {
      setActive((a) => (a + 1) % heroSlides.length)
      setAnimKey((k) => k + 1)
    }, 4500)
    return () => clearInterval(t)
  }, [])

  function goSlide(i: number) {
    setActive(i)
    setAnimKey((k) => k + 1)
  }

  const slide = heroSlides[active]

  const gradients: Record<number, string> = {
    0: 'from-amber-50 via-yellow-50 to-orange-50',
    1: 'from-orange-50 via-red-50 to-rose-50',
    2: 'from-emerald-50 via-teal-50 to-green-50',
  }

  return (
    <section className={`bg-gradient-to-br ${gradients[active]} transition-all duration-700 overflow-hidden`}>
      <div className="max-w-7xl mx-auto px-6 py-10 sm:py-16">
        <div className="grid md:grid-cols-2 items-center gap-10 min-h-[300px]">

          {/* Text */}
          <div key={animKey} className="animate-fade-up space-y-4">
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-white"
              style={{ backgroundColor: slide.accentColor }}
            >
              {slide.tag}
            </span>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 leading-tight">
              {slide.headline}
              <br />
              <span style={{ color: slide.accentColor }}>{slide.sub}</span>
            </h1>

            <p className="text-stone-500 text-lg font-medium">{slide.highlight}</p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => navigate(`/?cat=${slide.category}`)}
                className="bg-stone-900 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-stone-700 transition-all hover:shadow-lg active:scale-95 flex items-center gap-2"
              >
                {slide.cta}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <button
                onClick={() => navigate('/?cat=combos')}
                className="bg-white border border-stone-200 text-stone-700 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-stone-50 hover:border-stone-300 transition-all"
              >
                View Combos
              </button>
            </div>

            {/* Trust strip */}
            <div className="flex flex-wrap gap-4 pt-2">
              {['🌿 100% Natural', '🚚 Free Delivery ₹299+', '⚡ Same-Day'].map((t) => (
                <span key={t} className="text-xs text-stone-500 font-medium">{t}</span>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div key={`v-${animKey}`} className="hidden md:flex items-center justify-center relative h-64">
            {/* Blob */}
            <div
              className="absolute w-64 h-64 rounded-[60%_40%_55%_45%/50%_55%_45%_50%] opacity-20 animate-blob"
              style={{ backgroundColor: slide.accentColor }}
            />
            {/* Emoji */}
            <span className="relative z-10 text-[110px] leading-none animate-float filter drop-shadow-xl">
              {slide.emoji}
            </span>
            {/* Float card */}
            <div className="absolute bottom-4 right-0 bg-white rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3 z-20 animate-fade-up">
              <span className="text-2xl">✨</span>
              <div>
                <div className="text-xs font-bold text-stone-800">Today's Pick</div>
                <div className="text-xs text-stone-500">Fresh arrivals in stock</div>
              </div>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="flex gap-2 justify-center mt-8">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => goSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === active ? 'w-7 bg-stone-800' : 'w-2 bg-stone-300'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
