/* Risk Plus — Page sections */
const { useEffect, useRef, useState, useMemo, useCallback } = React;

/* ====== Reveal observer hook (global; observes any .reveal not yet in) ====== */
const useReveal = () => {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal:not(.is-in)').forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    const observe = () => {
      document.querySelectorAll('.reveal:not(.is-in)').forEach((el) => {
        if (!el.dataset.revealObserved) {
          el.dataset.revealObserved = '1';
          io.observe(el);
        }
      });
    };
    observe();
    // Re-scan when DOM changes (so dynamically-added reveals get observed too)
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {io.disconnect();mo.disconnect();};
  }, []);
};

/* ====== Reveal — stateful so is-in persists across React re-renders ====== */
const Reveal = ({ as: Tag = 'div', delay = 0, kind = 'up', className = '', children, ...rest }) => {
  const ref = useRef(null);
  const [isIn, setIsIn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (isIn) return;
    if (!('IntersectionObserver' in window)) {setIsIn(true);return;}
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setIsIn(true);
          io.disconnect();
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [isIn]);

  return (
    <Tag
      ref={ref}
      className={`reveal reveal-${kind}${isIn ? ' is-in' : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}ms` }}
      {...rest}>
      
      {children}
    </Tag>);

};

/* ====== Navbar ====== */
const Navbar = ({ onCTAClick }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const items = ['Sobre', 'Serviços', 'Planos'];
  return (
    <nav className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
      <a href="#top" className="nav__logo" aria-label="Risk Plus">
        <img className="logo-light" src="logo-white.svg" alt="Risk Plus" />
        <img className="logo-dark" src="logo-blue.svg" alt="Risk Plus" />
      </a>
      <div className="nav__links">
        {items.map((it, i) =>
        <a
          key={it}
          href={`#${it.toLowerCase()}`}
          className="nav__link">
          
            {it}
            {i === 0 &&
          <svg className="nav__chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
          }
          </a>
        )}
        <button className="btn btn--primary btn--sm nav__cta" onClick={onCTAClick}>
          Falar com especialista
        </button>
      </div>
    </nav>);

};

/* ====== Hero ====== */
const Hero = ({ onPrimary, onSecondary }) => {
  const lines = [
  ['Entenda', 'o', 'risco'],
  ['antes', 'de', 'vender', 'a', 'prazo.']];

  let counter = 0;
  return (
    <header className="hero" id="top">
      <div className="hero__bg" />
      <div className="hero__grid" />
      <div className="hero__noise" />
      <div className="container">
        <div className="hero__inner">
          <h1 className="hero__title">
            {lines.map((line, li) =>
            <React.Fragment key={li}>
                {line.map((w, wi) => {
                const idx = counter++;
                return (
                  <React.Fragment key={`${li}-${wi}`}>
                      <span className="word" style={{ '--i': idx }}>{w}</span>
                      {wi < line.length - 1 ? ' ' : null}
                    </React.Fragment>);

              })}
                {li < lines.length - 1 ? <br /> : null}
              </React.Fragment>
            )}
          </h1>
          <p className="hero__sub">
            A Risk Plus transforma dados transacionais e comportamento financeiro em uma leitura
            mais clara para apoiar análises de crédito B2B com mais segurança e contexto.
          </p>
          <div className="hero__ctas">
            <a href="lead.html" className="btn btn--primary btn--pulse" onClick={onPrimary}>
              Faça até 10 consultas grátis
            </a>
            <button className="btn btn--ghost" onClick={onSecondary}>
              Conheça os planos
            </button>
          </div>
          <div className="hero__bullets">
            <span><Icon name="check" size={16} stroke={2.2} /> Cancele a qualquer momento</span>
            <span><Icon name="check" size={16} stroke={2.2} /> Experimente os indicadores na prática</span>
          </div>

          <div className="hero__product">
            <div className="product-mock">
              <div className="product-mock__col">
                <div className="product-mock__label">
                  <Icon name="file" size={14} stroke={2} /> Análise tradicional
                </div>
                <div className="product-mock__rows">
                  {[
                  ['file', 'Consulta pontual'],
                  ['db', 'Dados declaratórios'],
                  ['bar', 'Score genérico'],
                  ['cube', 'Caixa preta'],
                  ['alert', 'Reação ao atraso']].
                  map(([ic, t]) =>
                  <div className="product-mock__row" key={t}>
                      <Icon name={ic} size={16} stroke={2} />
                      <span>{t}</span>
                      <Icon name="chevronRight" size={14} stroke={2} className="product-mock__chev" />
                    </div>
                  )}
                </div>
              </div>
              <div className="product-mock__col is-rp">
                <div className="product-mock__label is-rp">
                  <img src="icon-blue.svg" alt="" style={{ width: 14, height: 14 }} /> RISK PLUS
                </div>
                <div className="product-mock__rows">
                  {[
                  ['eye', 'Monitoramento contínuo'],
                  ['layers', 'Dados transacionais'],
                  ['pulse', 'Contexto operacional'],
                  ['search', 'Leitura mais clara'],
                  ['bell', 'Sinais antecipados']].
                  map(([ic, t]) =>
                  <div className="product-mock__row" key={t}>
                      <Icon name={ic} size={16} stroke={2} />
                      <span>{t}</span>
                      <Icon name="chevronRight" size={14} stroke={2} className="product-mock__chev" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>);

};

/* ====== Pain cards ====== */
const PainSection = () => {
  const cards = [
  { icon: 'trendingDown', title: 'Dados desconectados', body: 'Consultas espalhadas entre birôs, planilhas e ferramentas diferentes.' },
  { icon: 'bar', title: 'Score sem contexto', body: 'Um número sozinho não explica o comportamento financeiro da empresa.' },
  { icon: 'gauge', title: 'Falta de monitoramento', body: 'O problema normalmente só aparece quando o cliente já atrasou.' }];

  return (
    <section className="section pain" id="sobre">
      <div className="container">
        <div className="pain__head">
          <Reveal as="h2" kind="up" delay={0}>
            Seu time decide crédito com contexto<br />ou apenas com score?
          </Reveal>
        </div>
        <div className="pain__grid">
          {cards.map((c, i) =>
          <Reveal key={c.title} className="pain-card" kind="up" delay={i * 120}>
              <div className="pain-card__icon">
                <Icon name={c.icon} size={22} stroke={1.8} />
              </div>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </Reveal>
          )}
        </div>
        <Reveal className="pain__quote" delay={300}>
          <q>Só descobrimos o problema quando o cliente já atrasou.</q>
          <cite>Sócio — JCS Acessórios</cite>
        </Reveal>
      </div>
    </section>);

};

/* ====== Compass + comparison ====== */
const CompassSection = () => {
  // Tilt on mouse-move (very subtle)
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--tilt-x', `${y * -6}deg`);
    el.style.setProperty('--tilt-y', `${x * 8}deg`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--tilt-x', `0deg`);
    el.style.setProperty('--tilt-y', `0deg`);
  };

  return (
    <section className="section compass">
      <div className="container">
        <div className="compass__inner">
          <Reveal className="compass__stage" kind="scale" delay={0} onMouseMove={onMove} onMouseLeave={onLeave}>
            <div className="compass__halo" />
            <div className="compass__rings" aria-hidden="true">
              <div className="compass__ring" />
              <div className="compass__ring" />
              <div className="compass__ring" />
            </div>
            <div
              ref={ref}
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'grid',
                placeItems: 'center',
                perspective: '1200px'
              }}>
              
              <img
                className="compass__icon"
                src="icon-blue.svg"
                alt=""
                style={{
                  transform: 'rotateX(var(--tilt-x, 0)) rotateY(var(--tilt-y, 0))',
                  transition: 'transform 220ms cubic-bezier(0.165, 0.84, 0.44, 1)'
                }} />
              
            </div>
            <div className="compass__shadow" />
          </Reveal>

          <div className="compass__copy">
            <Reveal kind="right" delay={120}>
              <span className="eyebrow">Bússola Risk Plus</span>
            </Reveal>
            <Reveal as="h2" kind="right" delay={200}>
              O problema não começa no atraso.<br />Os sinais aparecem antes.
            </Reveal>
            <Reveal as="p" kind="right" delay={320} style={{ marginTop: 18 }}>
              A Risk Plus organiza comportamento financeiro e indicadores transacionais em uma
              leitura mais clara para apoiar análises de crédito com mais contexto.
            </Reveal>
          </div>
        </div>
      </div>
    </section>);

};

/* ====== Comparison ====== */
const CompareSection = () => {
  const left = [
  { icon: 'clock', text: 'Consulta pontual' },
  { icon: 'file', text: 'Dados declaratórios' },
  { icon: 'bar', text: 'Score genérico' },
  { icon: 'cube', text: 'Caixa preta' },
  { icon: 'alert', text: 'Reação ao atraso' }];

  const right = [
  { icon: 'eye', text: 'Monitoramento contínuo', sub: 'Acompanhamento em tempo real' },
  { icon: 'layers', text: 'Dados transacionais', sub: 'Informações reais do comportamento financeiro' },
  { icon: 'pulse', text: 'Contexto operacional', sub: 'Entenda o que está por trás dos números' },
  { icon: 'search', text: 'Leitura mais clara', sub: 'Indicadores interpretados de forma prática' },
  { icon: 'bell', text: 'Sinais antecipados', sub: 'Antecipe sinais antes do problema acontecer' }];

  return (
    <section className="section compare">
      <div className="container">
        <Reveal className="compare__wrap" kind="up" delay={0}>
          <div className="compare__col">
            <div className="compare__head">
              <Icon name="file" size={14} stroke={2} /> Análise tradicional
            </div>
            {left.map((row, i) =>
            <div className="compare__row" key={row.text} style={{ animationDelay: `${i * 80}ms` }}>
                <div className="tablecard">
                  <div className="tablecard__icon"><Icon name={row.icon} size={16} stroke={2} /></div>
                  <span>{row.text}</span>
                </div>
                <Icon name="chevronRight" size={16} stroke={2} className="compare__arrow" />
              </div>
            )}
          </div>

          <div className="compare__col compare__col--rp">
            <div className="compare__head">
              <img src="icon-blue.svg" alt="" style={{ width: 14, height: 14 }} />
              RISK PLUS
            </div>
            {right.map((row, i) =>
            <div className="compare__row" key={row.text}>
                <div className="tablecard">
                  <div className="tablecard__icon"><Icon name={row.icon} size={16} stroke={2} /></div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--rp-text)' }}>{row.text}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--rp-text-3)' }}>{row.sub}</div>
                  </div>
                </div>
                <Icon name="chevronRight" size={16} stroke={2} className="compare__arrow" />
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>);

};

/* ====== Features (6) ====== */
const FeaturesSection = () => {
  const items = [
  { icon: 'arrowUpRight', title: 'A operação está crescendo de forma saudável?', body: 'Acompanhe mudanças no volume financeiro ao longo do tempo para entender sinais de estabilidade, crescimento ou oscilações relevantes.' },
  { icon: 'compare', title: 'A movimentação financeira acompanha a operação?', body: 'Visualize movimentações financeiras reais para complementar análises baseadas apenas em informações declaradas.' },
  { icon: 'file', title: 'Como essa empresa costuma pagar?', body: 'Entenda padrões de liquidação e comportamento financeiro para apoiar análises com mais contexto operacional.' },
  { icon: 'pulse', title: 'O comportamento financeiro mudou?', body: 'Identifique variações ao longo do tempo que podem indicar alterações na dinâmica financeira da operação.' },
  { icon: 'nodes', title: 'Como essa empresa se compara ao segmento?', body: 'Contextualize a operação com indicadores relacionados ao perfil financeiro do setor de atuação.' },
  { icon: 'trendingDown', title: 'Existem sinais de deterioração financeira?', body: 'Monitore padrões de atraso, liquidação e movimentação financeira antes que eles impactem sua operação.' }];

  return (
    <section className="section features">
      <div className="container">
        <div className="features__head">
          <Reveal as="h2" kind="up" delay={0}>
            Entenda sinais financeiros antes do<br />atraso acontecer.
          </Reveal>
        </div>
        <div className="features__grid">
          {items.map((it, i) =>
          <Reveal key={it.title} className="feature" kind="up" delay={i % 3 * 100 + Math.floor(i / 3) * 100}>
              <div className="feature__icon"><Icon name={it.icon} size={28} stroke={1.7} /></div>
              <h3>{it.title}</h3>
              <p>{it.body}</p>
            </Reveal>
          )}
        </div>
      </div>
    </section>);

};

/* ====== Single CTA ====== */
const SingleCTA = ({ onClick }) =>
<section className="section single-cta">
    <div className="container">
      <Reveal as="h2" kind="up">Tudo o que você precisa para analisar<br />crédito em uma única tela.</Reveal>
      <Reveal as="p" kind="up" delay={120}>
        A Risk Plus organiza informações críticas de forma clara, priorizando rapidez na leitura e
        confiança na decisão.
      </Reveal>
      <Reveal kind="up" delay={220}>
        <button className="btn btn--primary btn--pulse" onClick={onClick}>Falar com especialista</button>
      </Reveal>
    </div>
  </section>;


/* ====== Testimonials + Sectors ====== */
const TestSection = () => {
  const items = [
  { q: '“Os números são importantes, mas a decisão final envolve julgamento.”', name: 'Roger Sasso', co: 'Move Mais', initials: 'RS' },
  { q: '“Hoje precisamos consultar várias ferramentas para conseguir validar uma análise.”', name: 'Juliana Bertoldi', co: 'Perfípari', initials: 'JB' },
  { q: '“Falta de atualização dos dados, como faturamento, são problemas crônicos.”', name: 'Diego Quinto', co: 'Move Mais', initials: 'DQ' }];

  const sectors = ['Distribuidoras', 'Indústrias', 'Financeiro B2B', 'Crédito Próprio'];
  return (
    <section className="section blue-band" id="serviços">
      <div className="container">
        <Reveal as="h2" className="blue-band__head" kind="up">
          Você continua decidindo, mas agora com mais contexto.
        </Reveal>
        <div className="tests__grid">
          {items.map((t, i) =>
          <Reveal key={t.name} className="test" kind="up" delay={i * 120}>
              <p className="test__quote">{t.q}</p>
              <div className="test__author">
                <div className="test__avatar">{t.initials}</div>
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.co}</span>
                </div>
              </div>
            </Reveal>
          )}
        </div>

        <div className="sectors">
          <Reveal as="h3" kind="up">Ajudamos na decisão de crédito para diversas áreas</Reveal>
          <div className="sectors__pills">
            {sectors.map((s, i) =>
            <Reveal key={s} className="sector-pill" kind="up" delay={i * 80}>{s}</Reveal>
            )}
          </div>
        </div>
      </div>
    </section>);

};

/* ====== Pricing ====== */
const Pricing = ({ onPick, featured = 'Business' }) => {
  const plans = [
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'O essencial para análises de crédito mais rápidas e organizadas.',
    features: ['20 consultas/mês', '3 indicadores de crédito', 'Relatórios ilimitados']
  },
  {
    id: 'business',
    name: 'Business',
    tagline: 'Leve sua operação de crédito para um novo nível de eficiência e controle.',
    features: ['10 consultas/mês', '6 indicadores de crédito', 'Relatórios ilimitados', 'Suporte facilitado']
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'Mais profundidade para equipes que analisam crédito em alto volume.',
    features: ['60 consultas/mês', '9 indicadores de crédito', 'Suporte prioritário']
  }].
  map((p) => ({
    ...p,
    featured: p.name === featured,
    btn: p.name === featured ? 'btn--primary' : p.name === 'Enterprise' ? 'btn--light' : 'btn--outline-light'
  }));

  return (
    <section className="section pricing" id="planos">
      <div className="container">
        <div className="pricing__head">
          <Reveal as="h2" kind="up">Escolha o plano ideal para sua operação.</Reveal>
          <Reveal as="p" kind="up" delay={120} className="pricing__sub">
            Planos pensados para times que decidem crédito todos os dias.
          </Reveal>
        </div>

        <div className="pricing__grid">
          {plans.map((p, i) =>
          <Reveal key={p.id} className={`plan ${p.featured ? 'plan--featured' : ''}`} kind="up" delay={i * 100}>
              {p.featured && <span className="plan__badge">Mais popular</span>}
              <span className="plan__name">{p.name}</span>
              <p className="plan__desc">{p.tagline}</p>
              <ul className="plan__features">
                {p.features.map((f) =>
              <li key={f}><Icon name="check" size={16} /> {f}</li>
              )}
              </ul>
              <a
                href="lead.html"
                className={`btn ${p.btn} plan__cta`}
                onClick={() => onPick && onPick(p.name)}
              >
                Saiba mais
                <Icon name="arrowRight" size={16} />
              </a>
            </Reveal>
          )}
        </div>
      </div>
    </section>);

};

/* ====== FAQ ====== */
const FAQ = () => {
  const items = [
  { q: 'A Risk Plus toma decisões automaticamente?', a: 'Não. A plataforma organiza dados e indicadores para apoiar análises de crédito com mais contexto e visibilidade. A decisão final segue com seu time.' },
  { q: 'Quais dados são utilizados?', a: 'Dados transacionais, comportamento de pagamento e indicadores financeiros organizados em uma leitura mais clara, sempre respeitando a LGPD.' },
  { q: 'A plataforma substitui birôs tradicionais?', a: 'Não. A Risk Plus complementa as ferramentas que você já usa, agregando contexto financeiro real ao seu processo de análise.' },
  { q: 'Existe integração com ERP?', a: 'Sim. Oferecemos integrações via API com os principais ERPs do mercado e podemos avaliar conectores customizados sob demanda.' },
  { q: 'Posso testar antes de contratar?', a: 'Sim. Você pode realizar até 10 consultas gratuitas para experimentar os indicadores na prática antes de assinar um plano.' }];

  const [open, setOpen] = useState(0);
  return (
    <section className="section faq" id="faq">
      <div className="container">
        <div className="faq__head">
          <Reveal as="h2" kind="up">Perguntas frequentes</Reveal>
          <Reveal as="p" kind="up" delay={100}>Tudo que você precisa saber sobre a Risk Plus</Reveal>
        </div>
        <div className="faq__list">
          {items.map((it, i) =>
          <Reveal key={it.q} kind="up" delay={i * 60}>
              <div className={`faq-item ${open === i ? 'is-open' : ''}`}>
                <button className="faq-item__btn" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                  <span>{it.q}</span>
                  <span className="faq-item__icon">
                    <Icon name="plus" size={16} stroke={2.2} />
                  </span>
                </button>
                <div className="faq-item__body"><p>{it.a}</p></div>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>);

};

/* ====== Footer ====== */
const Footer = () =>
<footer className="footer">
    <div className="container">
      <div className="footer__grid">
        <div className="footer__brand">
          <img src="logo-white.svg" alt="Risk Plus" />
          <p>Contexto financeiro para decisões de crédito B2B mais claras, mais seguras e mais rápidas.</p>
        </div>
        <div className="footer__col">
          <h4>Endereço</h4>
          <p style={{ color: 'rgba(255,255,255,0.78)' }}>
            Av. Paulista · Número<br />
            São Paulo · SP<br />
            <a href="#" style={{ color: 'var(--rp-orange)' }}>Acesso no Google Maps →</a>
          </p>
        </div>
        <div className="footer__col">
          <h4>Contato</h4>
          <a href="tel:+551199999999"><Icon name="phone" size={14} stroke={2} /> &nbsp; 11 99999-9999</a>
          <a href="mailto:contato@riskplus.com.br"><Icon name="mail" size={14} stroke={2} /> &nbsp; contato@riskplus.com.br</a>
        </div>
      </div>
      <div className="footer__bottom">
        <span>© 2026 Risk Plus · Todos os direitos reservados.</span>
        <div className="footer__socials">
          <a href="#" aria-label="LinkedIn"><Icon name="linkedin" size={14} stroke={2} /></a>
          <a href="#" aria-label="Instagram"><Icon name="instagram" size={14} stroke={2} /></a>
        </div>
      </div>
    </div>
  </footer>;


Object.assign(window, {
  useReveal, Reveal, Navbar, Hero, PainSection,
  CompassSection, CompareSection, FeaturesSection,
  SingleCTA, TestSection, Pricing, FAQ, Footer
});