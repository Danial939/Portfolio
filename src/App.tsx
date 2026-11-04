import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import {
  MotionConfig,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { ArrowDownRight, ArrowRight, ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react';

/* ------------------------------------------------------------------ данные */

const techGroups = [
  { title: 'Frontend', items: ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Redux Toolkit', 'Zustand', 'TanStack Query', 'SCSS', 'Tailwind CSS', 'Bootstrap', 'Three.js', 'Canvas API'] },
  { title: 'Backend и данные', items: ['Node.js', 'Express.js', 'NestJS', 'REST API', 'WebSocket', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis'] },
  { title: 'Инструменты', items: ['Git', 'Docker', 'CI/CD', 'Vite', 'Webpack', 'Jest', 'Vitest', 'Testing Library', 'Linux', 'Nginx'] },
  { title: 'Безопасность', items: ['RBAC', 'JWT / Refresh', 'API Rate Limiting', 'XSS · CSRF · SQLi'] },
];
const allTech = techGroups.flatMap((g, gi) => g.items.map((name) => ({ name, gi })));

const steps = [
  { title: 'Знакомство и бриф', desc: 'Разбираемся в задаче, целях бизнеса и текущих процессах. Фиксируем, какой результат должен дать проект.', time: '01', tag: 'Погружение' },
  { title: 'Аналитика и план', desc: 'Изучаю процессы и ограничения, предлагаю архитектуру решения, согласовываю этапы, сроки и стоимость.', time: '02', tag: 'Проектирование' },
  { title: 'Прототип и дизайн', desc: 'Собираю структуру и интерфейс. Показываю промежуточный результат, чтобы до разработки сверить направление.', time: '03', tag: 'Визуальная часть' },
  { title: 'Разработка', desc: 'Создаю сайт, веб-приложение или автоматизацию. Регулярно показываю прогресс и проверяю ключевые сценарии.', time: '04', tag: 'Реализация' },
  { title: 'Тестирование и запуск', desc: 'Проверяю работу на устройствах и в реальных сценариях, исправляю ошибки и помогаю запустить решение.', time: '05', tag: 'Релиз' },
  { title: 'Поддержка и развитие', desc: 'После запуска остаюсь на связи: помогаю с улучшениями, масштабированием и дальнейшей автоматизацией.', time: '06', tag: 'Дальше — больше' },
];

const services: [string, string, string][] = [
  ['01', 'Автоматизация бизнеса', 'Убираю ручную рутину, связываю сервисы и выстраиваю процессы, которые экономят время команды.'],
  ['02', 'Разработка сайтов', 'Создаю быстрые, адаптивные сайты с продуманной структурой, выразительным дизайном и понятной подачей.'],
  ['03', 'AI-автоматизация', 'Интегрирую AI в рабочие процессы: ассистенты, обработка обращений и документов, интеллектуальные сценарии.'],
  ['04', 'Веб-приложения', 'Разрабатываю веб-сервисы и внутренние инструменты под конкретные задачи бизнеса.'],
];

const projectCards = [
  { n: '01', type: 'Кейсы скоро появятся', title: 'Проект под задачу', text: 'Здесь появится описание реализованного проекта, его задачи и результата.', cls: 'project-art-one', label: 'Сайт / Веб' },
  { n: '02', type: 'Автоматизация', title: 'Рабочие процессы', text: 'Покажу, как связать сервисы и убрать повторяющиеся операции.', cls: 'project-art-two', label: 'AI / Automation' },
  { n: '03', type: 'Веб-приложение', title: 'Цифровой продукт', text: 'Место для демонстрации интерфейса и функциональности приложения.', cls: 'project-art-three', label: 'Web app' },
];

// Плейсхолдеры: замените на свои данные перед публикацией.
const contactLines = [
  { label: 'Telegram', value: '@ваш_ник' },
  { label: 'Email', value: 'почта@домен.ру' },
  { label: 'Телефон', value: '+7 (___) ___-__-__' },
];

/* ----------------------------------------------------- иконки технологий
   Логотипы из открытого набора Simple Icons (CDN jsDelivr).
   Цвет берётся из фирменного. Если иконки нет, показываем только название. */
const TECH_ICONS: Record<string, [string, string]> = {
  'HTML5': ['html5', '#E34F26'],
  'CSS3': ['css3', '#1572B6'],
  'JavaScript': ['javascript', '#F7DF1E'],
  'TypeScript': ['typescript', '#3178C6'],
  'React': ['react', '#61DAFB'],
  'Next.js': ['nextdotjs', 'currentColor'],
  'Redux Toolkit': ['redux', '#764ABC'],
  'TanStack Query': ['reactquery', '#FF4154'],
  'SCSS': ['sass', '#CC6699'],
  'Tailwind CSS': ['tailwindcss', '#06B6D4'],
  'Bootstrap': ['bootstrap', '#7952B3'],
  'Three.js': ['threedotjs', 'currentColor'],
  'Node.js': ['nodedotjs', '#5FA04E'],
  'Express.js': ['express', 'currentColor'],
  'NestJS': ['nestjs', '#E0234E'],
  'PostgreSQL': ['postgresql', '#4169E1'],
  'MySQL': ['mysql', '#4479A1'],
  'MongoDB': ['mongodb', '#47A248'],
  'Redis': ['redis', '#FF4438'],
  'Git': ['git', '#F05032'],
  'Docker': ['docker', '#2496ED'],
  'Vite': ['vite', '#646CFF'],
  'Webpack': ['webpack', '#8DD6F9'],
  'Jest': ['jest', '#C21325'],
  'Vitest': ['vitest', '#6E9F18'],
  'Testing Library': ['testinglibrary', '#E33332'],
  'Linux': ['linux', '#FCC624'],
  'Nginx': ['nginx', '#009639'],
  'JWT / Refresh': ['jsonwebtokens', '#D63AFF'],
};

function TechIcon({ name }: { name: string }) {
  const entry = TECH_ICONS[name];
  if (!entry) return null;
  const [slug, color] = entry;
  const url = `url(https://cdn.jsdelivr.net/npm/simple-icons@13/icons/${slug}.svg)`;
  return <i className="tech-icon" aria-hidden="true" style={{ '--m': url, '--ic': color } as unknown as CSSProperties} />;
}

/* Блок, который двигается по прокрутке с собственной скоростью (параллакс) */
function ParallaxBlock({ children, speed = 60 }: { children: ReactNode; speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);
  return (
    <motion.div ref={ref} style={{ y }}>
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------ примитивы */

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * «Фонарик»: тёмная страница, в которой мягкое световое пятно следует за курсором.
 * Координаты пишутся напрямую в CSS-переменные через rAF с lerp-сглаживанием.
 * Работает только на устройствах с точным указателем (мышь/стилус).
 */
function Flashlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canHover || reduce) return;

    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let raf = 0;

    const frame = () => {
      x += (targetX - x) * 0.2;
      y += (targetY - y) * 0.2;
      el.style.setProperty('--mx', `${x.toFixed(1)}px`);
      el.style.setProperty('--my', `${y.toFixed(1)}px`);
      const moving = Math.abs(targetX - x) > 0.3 || Math.abs(targetY - y) > 0.3;
      raf = moving ? requestAnimationFrame(frame) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      targetX = e.clientX;
      targetY = e.clientY;
      if (!el.dataset.on) {
        x = targetX;
        y = targetY;
      }
      el.dataset.on = '1';
      kick();
    };
    const onOut = (e: MouseEvent) => {
      if (!e.relatedTarget) delete el.dataset.on;
    };
    const onBlur = () => delete el.dataset.on;

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('mouseout', onOut);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseout', onOut);
      window.removeEventListener('blur', onBlur);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="flashlight" aria-hidden="true" />;
}

/* ------------------------------------------------------------- секции */

function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      return localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('theme', theme);
    } catch {
      /* приватный режим: тема просто не сохранится */
    }
  }, [theme]);
  return (
    <button
      className="theme-toggle"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const links: [string, string][] = [
    ['Обо мне', '#about'],
    ['Услуги', '#services'],
    ['Технологии', '#stack'],
    ['Этапы', '#process'],
    ['Проекты', '#projects'],
    ['Контакты', '#contact'],
  ];
  return (
    <header className="nav-wrap">
      <a className="brand" href="#top">Даниил Бондарев</a>
      <nav className={`nav-links ${open ? 'open' : ''}`} aria-label="Основная навигация">
        {links.map(([t, h]) => (
          <a key={h} href={h} onClick={() => setOpen(false)}>
            {t}
          </a>
        ))}
      </nav>
      <div className="nav-actions">
        <ThemeToggle />
        <a href="#contact" className="nav-cta">
          Обсудить проект <ArrowUpRight size={15} />
        </a>
        <button
          className="mobile-menu"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-grid" />
      <div className="hero-topline">
        <span>
          <i className="status-dot" /> Открыт к новым проектам
        </span>
        <span>Краснодар</span>
      </div>
      <div className="hero-main">
        <Reveal>
          <p className="eyebrow">Разработка · автоматизация · AI</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1>
            Делаю
            <br />
            <span>сложное</span>
            <br />
            простым<span className="hero-dot">.</span>
          </h1>
        </Reveal>
      </div>
      <div className="hero-bottom">
        <Reveal delay={0.18}>
          <p className="hero-intro">
            Помогаю бизнесу работать эффективнее: создаю сайты, веб-приложения и автоматизирую процессы с помощью технологий.
          </p>
        </Reveal>
        <Reveal delay={0.25}>
          <a href="#services" className="round-link">
            <span>
              Смотреть
              <br />
              возможности
            </span>
            <ArrowDownRight size={22} />
          </a>
        </Reveal>
      </div>
      <div className="hero-index">
        <span>01 / 06</span>
        <span>
          Листайте <span className="scroll-line" />
        </span>
      </div>
    </section>
  );
}

function Marquee() {
  const words = ['React', 'Next.js', 'AI automation', 'Node.js', 'Business systems', 'Web apps', 'Integrations'];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[...words, ...words, ...words].map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </div>
    </div>
  );
}

function About() {
  return (
    <section className="about section-pad" id="about">
      <div className="section-kicker">
        <span>01 / Обо мне</span>
        <span>Кто стоит за кодом</span>
      </div>
      <div className="about-layout">
        <div className="about-title">
          <ParallaxBlock speed={90}>
            <Reveal>
              <h2>
                Обо мне<span>.</span>
              </h2>
            </Reveal>
          </ParallaxBlock>
          <ParallaxBlock speed={30}>
            <Reveal delay={0.1}>
              <dl className="about-facts">
                <div>
                  <dt>Город</dt>
                  <dd>Краснодар</dd>
                </div>
                <div>
                  <dt>Образование</dt>
                  <dd>Бизнес-информатика</dd>
                </div>
                <div>
                  <dt>Направления</dt>
                  <dd>Автоматизация, сайты, AI, веб-приложения</dd>
                </div>
              </dl>
            </Reveal>
          </ParallaxBlock>
        </div>
        <div className="about-copy">
          <ParallaxBlock speed={-50}>
            <Reveal>
              <p className="lead">Привет, я Даниил — разработчик и специалист по автоматизации бизнеса.</p>
            </Reveal>
          </ParallaxBlock>
          <ParallaxBlock speed={40}>
            <Reveal delay={0.08}>
              <p>
                Учусь на бизнес-информатике, поэтому смотрю на разработку не только со стороны кода, но и через бизнес-процессы: где теряется время, что можно упростить и как технология приносит реальную пользу.
              </p>
            </Reveal>
          </ParallaxBlock>
          <ParallaxBlock speed={20}>
            <Reveal delay={0.14}>
              <p>
                Делаю сайты, веб-приложения и AI-автоматизацию. Не усложняю систему модными инструментами: подбираю решение, которое действительно работает.
              </p>
            </Reveal>
          </ParallaxBlock>
          <ParallaxBlock speed={-20}>
            <Reveal delay={0.2}>
              <div className="about-actions">
                <a href="#projects" className="btn btn-primary">
                  Смотреть проекты <ArrowUpRight size={17} />
                </a>
                <a href="#contact" className="btn btn-ghost">
                  Связаться
                </a>
              </div>
            </Reveal>
          </ParallaxBlock>
        </div>
      </div>
      <div className="about-foot">
        <span>01 — Think</span>
        <span>02 — Build</span>
        <span>03 — Improve</span>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="services section-pad" id="services">
      <div className="section-kicker dark-kicker">
        <span>02 / Что я делаю</span>
        <span>От идеи до рабочего решения</span>
      </div>
      <div className="services-head">
        <h2>
          Услуги<span>.</span>
        </h2>
        <p>Подключаюсь к задаче на нужном этапе — от поиска узкого места до запуска готового продукта.</p>
      </div>
      <div className="service-list">
        {services.map(([n, t, d], i) => (
          <Reveal key={n} delay={i * 0.06}>
            <article className="service-row">
              <span className="service-no">{n}</span>
              <div>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
              <ArrowUpRight className="service-arrow" aria-hidden="true" />
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/**
 * 3D-сфера технологий: точки распределены по поверхности сферы (Fibonacci),
 * вращаются мышью/пальцем с инерцией и медленно дрейфуют сами, пока сфера в кадре.
 * Все обновления делаются напрямую в DOM внутри rAF — без ререндеров React.
 */
function TechSphere({ active }: { active: number }) {
  const sphereRef = useRef<HTMLDivElement>(null);
  const chipEls = useRef<(HTMLSpanElement | null)[]>([]);
  const activeRef = useRef(active);
  activeRef.current = active;

  const points = useMemo(() => {
    const n = allTech.length;
    return allTech.map((t, i) => {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = i * Math.PI * (3 - Math.sqrt(5));
      return { ...t, x: Math.cos(theta) * r, y, z: Math.sin(theta) * r };
    });
  }, []);

  useEffect(() => {
    const el = sphereRef.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const BASE_SPIN = reduce ? 0 : 0.0022;

    let rx = 0.2;
    let ry = 0;
    let vx = 0;
    let vy = BASE_SPIN;
    let w = 0;
    let h = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let visible = true;
    let raf = 0;

    const measure = () => {
      w = el.clientWidth;
      h = el.clientHeight;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);

    const render = () => {
      const R = Math.min(w, h) * 0.42;
      const cx = Math.cos(rx), sx = Math.sin(rx);
      const cy = Math.cos(ry), sy = Math.sin(ry);
      points.forEach((p, i) => {
        const node = chipEls.current[i];
        if (!node) return;
        // поворот вокруг оси Y, затем вокруг оси X
        const x1 = p.x * cy + p.z * sy;
        const z1 = -p.x * sy + p.z * cy;
        const y1 = p.y * cx - z1 * sx;
        const z2 = p.y * sx + z1 * cx;
        const depth = (z2 + 1) / 2; // 0 — задняя сторона, 1 — передняя
        const scale = 0.7 + depth * 0.36;
        const hot = p.gi === activeRef.current ? 1 : 0.5;
        node.style.transform = `translate3d(${(x1 * R).toFixed(1)}px, ${(y1 * R).toFixed(1)}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
        node.style.opacity = String((0.15 + 0.85 * depth * depth) * hot);
        node.style.zIndex = String(Math.round(depth * 100));
      });
    };

    const isIdle = () => !dragging && Math.abs(vx) < 1e-4 && Math.abs(vy - BASE_SPIN) < 1e-4 && Math.abs(rx - 0.2) < 1e-3;

    const frame = () => {
      raf = 0;
      if (!dragging) {
        vy += (BASE_SPIN - vy) * 0.03;
        vx *= 0.92;
        ry += vy;
        rx += vx;
        rx += (0.2 - rx) * 0.012; // мягко возвращаем наклон
      }
      rx = Math.max(-0.9, Math.min(0.9, rx));
      render();
      if (visible && !isIdle()) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf && visible) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) kick();
    });
    io.observe(el);

    const down = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      el.setPointerCapture(e.pointerId);
      el.dataset.dragging = '1';
      kick();
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      vy = dx * 0.006;
      ry += vy;
      rx = Math.max(-0.9, Math.min(0.9, rx + dy * 0.004));
      kick();
    };
    const up = () => {
      dragging = false;
      delete el.dataset.dragging;
      kick();
    };

    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    render();
    kick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
    };
  }, [points]);

  return (
    <div className="sphere-area">
      <div className="sphere-glow" aria-hidden="true" />
      <div className="sphere" ref={sphereRef} aria-hidden="true">
        {points.map((p, i) => (
          <span
            key={p.name}
            ref={(node) => {
              chipEls.current[i] = node;
            }}
            className={`sphere-chip ${p.gi === active ? 'is-hot' : ''}`}
          >
            <TechIcon name={p.name} />{p.name}
          </span>
        ))}
      </div>
      <div className="sphere-hint">
        <span>↔</span> Потяните, чтобы вращать
      </div>
    </div>
  );
}

function Stack() {
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);

  // Пока пользователь не выбрал категорию, подсветка сама переключается.
  useEffect(() => {
    if (pinned) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % techGroups.length), 3200);
    return () => window.clearInterval(id);
  }, [pinned]);

  const select = (i: number) => {
    setPinned(true);
    setActive(i);
  };

  return (
    <section className="stack-section section-pad" id="stack">
      <div className="section-kicker">
        <span>03 / Технологии</span>
        <span>Инструменты под задачу</span>
      </div>
      <Reveal>
        <div className="stack-heading">
          <div>
            <h2>
              С чем я работаю<span>.</span>
            </h2>
            <p>Технологии — это инструменты. Главное — понимать, какую задачу решает каждый из них.</p>
          </div>
          <div className="stack-count">
            <strong>{String(allTech.length).padStart(2, '0')}</strong>
            <span>
              технологий
              <br />
              и инструментов
            </span>
          </div>
        </div>
      </Reveal>

      <div className="stack-layout">
        <div className="tech-groups">
          {techGroups.map((g, i) => (
            <Reveal key={g.title} delay={i * 0.07}>
              <div
                className={`tech-group ${active === i ? 'is-active' : ''}`}
                tabIndex={0}
                onMouseEnter={() => select(i)}
                onMouseLeave={() => setPinned(false)}
                onFocus={() => select(i)}
                onBlur={() => setPinned(false)}
                onClick={() => select(i)}
              >
                <div className="tech-group-head">
                  <span>0{i + 1}</span>
                  <h3>{g.title}</h3>
                  <span className="tech-group-count">{String(g.items.length).padStart(2, '0')}</span>
                </div>
                <div className="tech-pills">
                  {g.items.map((t) => (
                    <span key={t}><TechIcon name={t} />{t}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <TechSphere active={active} />
        </Reveal>
      </div>

      <div className="stack-note">
        <span>Стек расширяется под проект</span>
        <span>
          Наведите на категорию <ArrowRight size={14} />
        </span>
      </div>
    </section>
  );
}

/**
 * Этапы работы.
 * Прогресс = позиция таймлайна относительно центра экрана (0 — верх таймлайна дошёл до 55% высоты,
 * 1 — низ таймлайна дошёл до 55%). Номер этапа и процент берутся из одного и того же значения,
 * поэтому они всегда согласованы. Значение сглаживается пружиной, а не дёргается по событиям scroll.
 */
function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 55%', 'end 55%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  const [active, setActive] = useState(0);
  const [pct, setPct] = useState(0);

  useMotionValueEvent(progress, 'change', (v) => {
    const p = Math.min(1, Math.max(0, v));
    setActive(Math.min(steps.length - 1, Math.floor(p * steps.length)));
    setPct(Math.round(p * 100));
  });

  return (
    <section className="process section-pad" id="process">
      <div className="section-kicker">
        <span>04 / Этапы</span>
        <span>Прозрачно на каждом шаге</span>
      </div>
      <div className="process-heading">
        <h2>
          Этапы работы<span>.</span>
        </h2>
        <p>Понятный процесс без сюрпризов. Вы знаете, что происходит сейчас, что будет дальше и какой результат получите.</p>
      </div>

      <div className="process-layout">
        <aside className="process-aside">
          <div className="process-status">
            <div className="process-status-main">
              <span className="process-status-label">Готовность проекта</span>
              <strong className="process-pct">
                {pct}
                <small>%</small>
              </strong>
            </div>
            <div className="progress-track">
              <motion.span className="progress-fill" style={{ scaleX: progress }} />
            </div>
            <ol className="process-dots" aria-hidden="true">
              {steps.map((s, i) => (
                <li key={s.time} className={i <= active ? 'is-reached' : ''} />
              ))}
            </ol>
            <p className="process-stage">
              <span>Этап {steps[active].time} / 06</span>
              <b>{steps[active].title}</b>
            </p>
          </div>
        </aside>

        <div className="process-timeline" ref={ref}>
          <div className="process-line" aria-hidden="true">
            <motion.span className="process-line-fill" style={{ scaleY: progress }} />
          </div>
          {steps.map((s, i) => (
            <div key={s.time} className={`process-step ${i === active ? 'is-active' : ''} ${i <= active ? 'is-passed' : ''}`}>
              <div className="step-marker">
                <span>{s.time}</span>
              </div>
              <article className="step-card">
                <div className="step-meta">
                  <span>{s.tag}</span>
                  <span>Этап {s.time} / 06</span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section className="projects section-pad" id="projects">
      <div className="section-kicker">
        <span>05 / Избранное</span>
        <span>Практика вместо обещаний</span>
      </div>
      <div className="projects-heading">
        <h2>
          Проекты<span>.</span>
        </h2>
        <p>Здесь будут реальные работы с описанием задачи, решения и результата. Пока оставлены места под мои проекты.</p>
      </div>
      <div className="project-stack">
        {projectCards.map((p, i) => (
          <ProjectCard key={p.n} p={p} i={i} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ p, i }: { p: (typeof projectCards)[number]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1 - 0.035 * (2 - i)]);
  return (
    <div className="project-card-wrap" ref={ref}>
      <motion.article className="project-card" style={{ scale, top: `${90 + i * 22}px` }}>
        <div className="project-card-top">
          <span>
            {p.n} / {p.type}
          </span>
          <span className="project-tag">{p.label}</span>
        </div>
        <div className="project-card-content">
          <div>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
            <span className="coming-soon">
              <i /> Место для проекта
            </span>
          </div>
          <div className={`project-art ${p.cls}`}>
            <div className="art-window">
              <div className="art-bar">
                <i />
                <i />
                <i />
              </div>
              <div className="art-lines">
                <b />
                <b />
                <b />
              </div>
              <div className="art-orb" />
            </div>
            <span className="art-caption">Case study · 2026</span>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

function Contact() {
  return (
    <section className="contact section-pad" id="contact">
      <div className="section-kicker">
        <span>06 / Контакты</span>
        <span>Есть задача? Давайте обсудим</span>
      </div>
      <Reveal>
        <div className="contact-title">
          <p>От идеи до рабочего решения</p>
          <h2>
            Давайте обсудим
            <br />
            ваш проект<span>.</span>
          </h2>
        </div>
      </Reveal>
      <div className="contact-bottom">
        <Reveal delay={0.1} className="contact-copy">
          <p>Расскажите, что хотите улучшить или создать. Вместе разберём задачу и найдём подходящее решение.</p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="contact-card">
            <strong>
              Даниил
              <br />
              Бондарев
            </strong>
            <ul className="contact-lines">
              {contactLines.map((l) => (
                <li key={l.label}>
                  <span>{l.label}</span>
                  <b>{l.value}</b>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
      <footer className="footer">
        <span>© 2026 Даниил Бондарев</span>
        <span>Designed to solve real tasks</span>
        <a href="#top">Наверх ↑</a>
      </footer>
    </section>
  );
}

function TechBanner() {
  const items = allTech.map((t) => t.name);
  return (
    <div className="marquee tech-banner" aria-hidden="true">
      <div className="marquee-track">
        {[...items, ...items, ...items].map((w, i) => (
          <span key={i}><TechIcon name={w} />{w}</span>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Flashlight />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Services />
        <Stack />
        <TechBanner />
        <Process />
        <Projects />
        <Contact />
      </main>
    </MotionConfig>
  );
}
