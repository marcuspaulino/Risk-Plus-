/* Risk Plus — App */
const { useState, useEffect, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#FF6E29",
  "primary": "#0050FF",
  "compassFloat": true,
  "ctaPulse": true,
  "parallaxHero": true,
  "scrollSmooth": true,
  "featuredPlan": "Business"
}/*EDITMODE-END*/;

const ToastHost = ({ toasts }) => (
  <div className="toast-wrap" aria-live="polite">
    {toasts.map((t) => (
      <div className="toast" key={t.id}>
        <Icon name="check" size={16} stroke={2.4}/> {t.text}
      </div>
    ))}
  </div>
);

const App = () => {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const push = (text) => {
    const id = ++idRef.current;
    setToasts((q) => [...q, { id, text }]);
    setTimeout(() => setToasts((q) => q.filter((x) => x.id !== id)), 2600);
  };

  useReveal();

  // Motion-on guards the entry animations. We only enable them once the user
  // actually interacts with the page, so a paused/throttled iframe never
  // leaves content stuck invisible.
  useEffect(() => {
    let armed = true;
    const enable = () => {
      if (!armed) return;
      armed = false;
      document.documentElement.classList.add('motion-on');
    };
    ['scroll', 'pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart'].forEach((ev) => {
      window.addEventListener(ev, enable, { once: true, passive: true });
    });
  }, []);

  // Apply tweak vars
  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty('--rp-blue', tweaks.primary);
    r.style.setProperty('--rp-orange', tweaks.accent);
    // recompute glow rgb
    const hex = (h) => {
      const m = h.replace('#','').match(/.{1,2}/g);
      return m ? m.map((x) => parseInt(x, 16)).join(',') : '0,80,255';
    };
    r.style.setProperty('--rp-blue-glow', `rgba(${hex(tweaks.primary)}, 0.45)`);
    r.style.setProperty('--rp-orange-glow', `rgba(${hex(tweaks.accent)}, 0.55)`);
  }, [tweaks.primary, tweaks.accent]);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = tweaks.scrollSmooth ? 'smooth' : 'auto';
  }, [tweaks.scrollSmooth]);

  useEffect(() => {
    document.body.classList.toggle('no-pulse', !tweaks.ctaPulse);
  }, [tweaks.ctaPulse]);

  useEffect(() => {
    document.body.classList.toggle('no-float', !tweaks.compassFloat);
  }, [tweaks.compassFloat]);

  useEffect(() => {
    if (!tweaks.parallaxHero) {
      const el = document.querySelector('.hero__bg');
      if (el) el.style.transform = '';
      return;
    }
    const el = document.querySelector('.hero__bg');
    const onScroll = () => {
      if (!el) return;
      const y = window.scrollY;
      if (y < 800) {
        el.style.transform = `translate3d(0, ${y * 0.18}px, 0) scale(${1 + y * 0.0002})`;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [tweaks.parallaxHero]);

  return (
    <>
      <Navbar onCTAClick={() => push('Solicitação enviada — em breve entramos em contato.')} />

      <main>
        <Hero
          onPrimary={() => push('Cadastro iniciado: 10 consultas grátis liberadas.')}
          onSecondary={() => {
            const el = document.getElementById('planos');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        />
        <PainSection />
        <CompassSection />
        <FeaturesSection />
        <SingleCTA onClick={() => push('Solicitação recebida.')} />
        <TestSection />
        <Pricing featured={tweaks.featuredPlan} onPick={(name) => push(`Plano ${name} selecionado.`)} />
        <FAQ />
      </main>

      <Footer />

      <ToastHost toasts={toasts} />

      <TweaksPanel title="Tweaks">
        <TweakSection title="Cores">
          <TweakColor
            label="Primary"
            value={tweaks.primary}
            options={['#0050FF', '#0A2540', '#1E40FF', '#2E6BFF']}
            onChange={(v) => setTweak('primary', v)}
          />
          <TweakColor
            label="Accent"
            value={tweaks.accent}
            options={['#FF6E29', '#FF8A47', '#F46036', '#EA580C']}
            onChange={(v) => setTweak('accent', v)}
          />
        </TweakSection>

        <TweakSection title="Motion">
          <TweakToggle
            label="Floating bússola"
            value={tweaks.compassFloat}
            onChange={(v) => setTweak('compassFloat', v)}
          />
          <TweakToggle
            label="CTA pulse"
            value={tweaks.ctaPulse}
            onChange={(v) => setTweak('ctaPulse', v)}
          />
          <TweakToggle
            label="Parallax do hero"
            value={tweaks.parallaxHero}
            onChange={(v) => setTweak('parallaxHero', v)}
          />
          <TweakToggle
            label="Smooth scroll"
            value={tweaks.scrollSmooth}
            onChange={(v) => setTweak('scrollSmooth', v)}
          />
        </TweakSection>

        <TweakSection title="Pricing">
          <TweakRadio
            label="Plano destacado"
            value={tweaks.featuredPlan}
            options={['Pro', 'Business', 'Enterprise']}
            onChange={(v) => setTweak('featuredPlan', v)}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
