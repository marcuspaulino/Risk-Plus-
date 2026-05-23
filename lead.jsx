/* ===== Risk Plus — Lead capture form ===== */
const { useState, useEffect, useRef, useCallback } = React;

const PERSONAL_DOMAINS = ['gmail.com', 'hotmail.com', 'yahoo.com', 'yahoo.com.br', 'outlook.com', 'live.com', 'icloud.com', 'me.com', 'aol.com', 'bol.com.br', 'uol.com.br', 'terra.com.br', 'ig.com.br'];

const formatPhone = (raw) => {
  const digits = raw.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const validators = {
  firstName: (v) => v.trim().length >= 2 ? null : 'Informe seu nome.',
  lastName: (v) => v.trim().length >= 2 ? null : 'Informe seu sobrenome.',
  email: (v) => {
    const value = v.trim().toLowerCase();
    if (!value) return 'Informe seu e-mail corporativo.';
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(value)) return 'Formato de e-mail inválido.';
    const domain = value.split('@')[1];
    if (PERSONAL_DOMAINS.includes(domain)) return 'Use seu e-mail corporativo.';
    return null;
  },
  company: (v) => v.trim().length >= 2 ? null : 'Informe o nome da empresa.',
  role: (v) => v.trim().length >= 2 ? null : 'Informe seu cargo.',
  phone: (v) => {
    if (!v.trim()) return null; // optional
    const digits = v.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 11) return 'Telefone incompleto.';
    return null;
  },
};

const FIELDS = [
  { id: 'firstName', label: 'Nome', placeholder: 'João', required: true, col: 1 },
  { id: 'lastName',  label: 'Sobrenome', placeholder: 'Silva', required: true, col: 1 },
  { id: 'email',     label: 'E-mail corporativo', placeholder: 'joao@empresa.com', required: true, col: 2, type: 'email' },
  { id: 'company',   label: 'Nome da empresa', placeholder: 'Sua Empresa S.A.', required: true, col: 2 },
  { id: 'role',      label: 'Cargo', placeholder: 'Analista de crédito', required: true, col: 1 },
  { id: 'phone',     label: 'Telefone', placeholder: '(11) 99999-9999', required: false, col: 1, type: 'tel' },
];

const initialState = Object.fromEntries(FIELDS.map((f) => [f.id, '']));

const LeadForm = () => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [done, setDone] = useState(false);
  const firstRef = useRef(null);

  useEffect(() => { firstRef.current?.focus(); }, []);

  const runValidation = useCallback((vals) => {
    const out = {};
    for (const f of FIELDS) {
      const v = vals[f.id] ?? '';
      if (!f.required && !v.trim()) continue;
      const err = validators[f.id]?.(v);
      if (err) out[f.id] = err;
    }
    return out;
  }, []);

  const isComplete = FIELDS.filter((f) => f.required).every((f) => values[f.id]?.trim());
  const liveErrors = submitted ? errors : Object.fromEntries(Object.entries(errors).filter(([k]) => touched[k]));

  const handleChange = (id) => (e) => {
    let v = e.target.value;
    if (id === 'phone') v = formatPhone(v);
    const next = { ...values, [id]: v };
    setValues(next);
    if (touched[id] || submitted) {
      const e2 = runValidation(next);
      setErrors(e2);
    }
  };

  const handleBlur = (id) => () => {
    setTouched((t) => ({ ...t, [id]: true }));
    setErrors(runValidation(values));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = runValidation(values);
    setErrors(errs);
    setTouched(Object.fromEntries(FIELDS.map((f) => [f.id, true])));
    if (Object.keys(errs).length === 0) {
      // Simulate submission delay
      setTimeout(() => setDone(true), 350);
    } else {
      // Scroll to first error
      const firstErrId = FIELDS.map((f) => f.id).find((id) => errs[id]);
      if (firstErrId) {
        document.querySelector(`[name="${firstErrId}"]`)?.focus();
      }
    }
  };

  if (done) {
    return (
      <div className="lead-card">
        <div className="lead-success">
          <div className="lead-success__badge">
            <Icon name="checkCircle" size={56} />
          </div>
          <h2 className="lead-success__title">Recebemos suas informações</h2>
          <p className="lead-success__text">
            Em breve retornaremos com mais informações sobre como a Risk Plus pode apoiar sua operação de crédito.
          </p>
          <a className="lead-success__back" href="index.html">
            <Icon name="arrowLeft" size={16} /> Voltar à página inicial
          </a>
        </div>
      </div>
    );
  }

  const renderField = (f, idx) => {
    const v = values[f.id];
    const err = liveErrors[f.id];
    const valid = !err && v && v.trim() && !validators[f.id]?.(v);
    const cls = `field${f.col === 2 ? ' field--full' : ''}${valid ? ' field--valid' : ''}${err ? ' field--error' : ''}`;
    return (
      <div className={cls} key={f.id}>
        <label className="field__label" htmlFor={f.id}>
          {f.label}
          {f.required ? <span className="req">*</span> : <span className="optional">(opcional)</span>}
        </label>
        <input
          ref={idx === 0 ? firstRef : null}
          id={f.id}
          name={f.id}
          type={f.type || 'text'}
          className="field__input"
          placeholder={f.placeholder}
          value={v}
          onChange={handleChange(f.id)}
          onBlur={handleBlur(f.id)}
          autoComplete={
            f.id === 'firstName' ? 'given-name' :
            f.id === 'lastName' ? 'family-name' :
            f.id === 'email' ? 'email' :
            f.id === 'company' ? 'organization' :
            f.id === 'role' ? 'organization-title' :
            f.id === 'phone' ? 'tel' : 'off'
          }
          inputMode={f.id === 'phone' ? 'tel' : undefined}
        />
        {err ? (
          <div className="field__error">
            <Icon name="warningCircle" size={14} weight="bold" /> {err}
          </div>
        ) : (
          <div className="field__error" style={{ visibility: 'hidden' }}>placeholder</div>
        )}
      </div>
    );
  };

  return (
    <form className="lead-card" onSubmit={handleSubmit} noValidate>
      <div className="field-grid">
        {FIELDS.map((f, i) => renderField(f, i))}
      </div>

      <button
        type="submit"
        className={`lead-cta ${isComplete ? 'is-pulse' : ''}`}
        disabled={!isComplete}
      >
        Quero começar
        <Icon name="arrowRight" size={18} />
      </button>

      <p className="lead-fineprint">
        Ao enviar, você concorda com nossa <a href="#privacidade">Política de Privacidade</a>.
      </p>
    </form>
  );
};

const LeadApp = () => (
  <div className="lead-page">
    <div className="lead-bg" aria-hidden="true" />
    <header className="lead-header">
      <a className="lead-header__logo" href="index.html" aria-label="Risk Plus">
        <img src="logo-white.svg" alt="Risk Plus" />
      </a>
      <a className="lead-header__back" href="index.html">
        <Icon name="arrowLeft" size={14} />
        <span>Voltar à landing page</span>
      </a>
    </header>

    <main className="lead-main">
      <div className="lead-shell">
        <div className="lead-heading">
          <span className="lead-eyebrow">
            <Icon name="sparkle" size={12} />
            Começo grátis
          </span>
          <h1 className="lead-title">Comece agora.<br/>Sem compromisso.</h1>
          <p className="lead-subtitle">
            Você está dando o primeiro passo para analisar crédito com mais contexto.
            Preencha seus dados e nosso time entra em contato.
          </p>
        </div>

        <LeadForm />
      </div>
    </main>

    <footer className="lead-foot">
      <a href="index.html">← Risk Plus</a>
    </footer>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(<LeadApp />);
