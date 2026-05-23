/* Icons — Phosphor (regular weight) inline SVGs.
   Paths sourced from @phosphor-icons/core 2.1.1 (MIT).
   Loaded via phosphor-paths.js which sets window.PH_ICONS. */

const ICON_MAP = {
  chevron: 'caret-down',
  chevronRight: 'caret-right',
  plus: 'plus',
  check: 'check',
  arrowUpRight: 'arrow-up-right',
  arrowRight: 'arrow-right',
  bar: 'chart-bar',
  file: 'file-text',
  db: 'database',
  cube: 'cube',
  alert: 'warning',
  clock: 'clock',
  eye: 'eye',
  bell: 'bell',
  gauge: 'gauge',
  pulse: 'pulse',
  trending: 'trend-up',
  trendingDown: 'trend-down',
  nodes: 'graph',
  compare: 'arrows-left-right',
  search: 'magnifying-glass',
  user: 'user',
  map: 'map-trifold',
  phone: 'phone',
  mail: 'envelope',
  layers: 'stack',
  zap: 'lightning',
  spark: 'sparkle',
  box: 'package',
  linkedin: 'linkedin-logo',
  instagram: 'instagram-logo',
};

const Icon = ({ name, size = 20, style, className = '', ...rest }) => {
  const mapped = ICON_MAP[name] || name;
  const inner = window.PH_ICONS?.[mapped];
  if (!inner) {
    return <span className={`icon icon--missing ${className}`} style={{ width: size, height: size, display: 'inline-flex', ...style }} {...rest} />;
  }
  return (
    <span
      className={`icon icon--${mapped} ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, lineHeight: 0, ...style }}
      {...rest}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 256 256"
        fill="currentColor"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: inner }}
      />
    </span>
  );
};

window.Icon = Icon;
