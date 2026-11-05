import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import {
  type MotionValue,
  MotionConfig,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { ArrowRight, ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react';

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

/* Структура проектов в стиле andreyzhulev.ru:
   - featured: крупные карточки с видео/превью (сайты с видео)
   - list: детальные карточки с раскрытием
   Замени данные на свои — видео, ссылки, тексты. */
type Project = {
  id: string;
  n: string;
  title: string;
  subtitle: string;
  client?: string;
  text: string;
  tags: string[];
  label: string;
  href?: string;
  video?: string;       // mp4 / webm
  poster?: string;      // обложка
  featured?: boolean;   // в блоке «сайты с видео»
};

const projectCards: Project[] = [
  // —— Featured: сайты с видео (как у Андрея) ——
  {
    id: 'noir',
    n: '01',
    title: 'NOIR GT Obsidian',
    subtitle: 'Лендинг премиального автомобиля',
    client: 'NOIR GT',
    text: 'Сайт, где история продукта разворачивается при прокрутке. Тёмный премиальный лендинг с видео-секциями и плавными переходами.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'GSAP', 'Адаптив'],
    label: 'Сайт с видео',
    href: '#',
    video: '/projects/videos/noir-gt.mp4',
    poster: '/projects/covers/noir-gt.webp',
    featured: true,
  },
  {
    id: 'dom7',
    n: '02',
    title: 'Дом №7 «Ясное»',
    subtitle: 'Продажа одноэтажного дома',
    client: 'Дом №7',
    text: 'Продающий лендинг с акцентом на атмосферу и детали. Видео и крупные фото работают на эмоцию покупателя.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Адаптив'],
    label: 'Сайт с видео',
    href: '#',
    video: '/projects/videos/dom-yasnoe.mp4',
    poster: '/projects/covers/dom-yasnoe.webp',
    featured: true,
  },
  {
    id: 'sloy',
    n: '03',
    title: 'Слой',
    subtitle: 'Кухни на заказ',
    client: 'Слой',
    text: 'Сайт для производителя кухонь. Чистая подача, сильный визуал и понятный путь к заявке.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Адаптив'],
    label: 'Сайт с видео',
    href: '#',
    video: '/projects/videos/sloy.mp4',
    poster: '/projects/covers/sloy.webp',
    featured: true,
  },
  {
    id: 'andrianova-f',
    n: '04',
    title: 'Andrianova Studio',
    subtitle: 'Студия дизайна презентаций',
    client: 'Andrianova Studio',
    text: 'Чёрно-белый сайт в журнальном стиле. На первом экране слово STUDIO лежит поверх стопки настоящих слайдов и инвертирует их цвет. 12 работ открываются в отдельном просмотрщике.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'Адаптив'],
    label: 'Сайт с видео',
    href: 'http://andrianova-studio.ru/',
    video: '/projects/videos/andrianova.mp4',
    poster: '/projects/covers/andrianova.webp',
    featured: true,
  },
  // —— Список проектов ——
  {
    id: 'andrianova',
    n: '01',
    title: 'Andrianova Studio',
    subtitle: 'Студия дизайна презентаций',
    client: 'Andrianova Studio',
    text: 'Сайт студии, которая делает презентации. Чёрно-белый, в журнальном стиле. На первом экране слово STUDIO лежит поверх стопки настоящих слайдов и инвертирует их цвет, а карточки чуть двигаются за мышкой. 12 работ открываются в отдельном просмотрщике, слайды из него не скачать и не перетащить. Заявки приходят студии на почту.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'Адаптив'],
    label: 'Сайт / Студия',
    href: 'http://andrianova-studio.ru/',
    poster: '/projects/covers/andrianova-studio.webp',
  },
  {
    id: 'vertical',
    n: '02',
    title: 'Вертикаль стиля',
    subtitle: 'Мастерская Дениса Шилкина',
    client: 'Вертикаль стиля',
    text: 'Премиальный сайт-визитка для мастерской из Самары: москитные сетки плиссе собственного производства, мягкие окна и ZIP-шторы для веранд, садовая мебель и костровые чаши. Каждое направление — свой «мир» со своим цветом, переходы между ними плавно перетекают, как рассвет. Лоадер рисует логотип по частям, работы показаны в 3D-карусели с видео.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'GSAP', 'Адаптив'],
    label: 'Сайт с видео',
    href: 'https://vertstyle.ru/',
    poster: '/projects/covers/vertstyle.webp',
  },
  {
    id: 'vis',
    n: '03',
    title: 'Вис',
    subtitle: 'Онлайн-журнал о моде и культуре Москвы',
    client: 'Вис',
    text: 'Онлайн-журнал про моду и культурную жизнь Москвы: интервью, премьеры, показы, бэкстейдж. На первом экране большой логотип «Вис» с летающими буквами. Статьи редакция публикует сама через админку, которую я написал с нуля на PHP и SQLite, без готовых CMS.',
    tags: ['PHP', 'SQLite', 'JavaScript', 'Админ-панель', 'Адаптив'],
    label: 'Журнал / CMS',
    href: 'https://visjournal.ru/',
    poster: '/projects/covers/visjournal.webp',
  },
  {
    id: 'copyclean',
    n: '04',
    title: 'CopyClean',
    subtitle: 'Магазин и сервисный центр',
    client: 'CopyClean',
    text: 'У компании два направления: свой интернет-магазин химии для оргтехники и сервисный центр в Балашихе. Поэтому вместо обычной главной сделал экран, разрезанный пополам. Слева магазин с очистителями, смазками и салфетками, справа ремонт принтеров, заправка картриджей и ремонт ноутбуков.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Интернет-магазин', 'Адаптив'],
    label: 'E-commerce',
    href: 'https://copyclean.ru/',
    poster: '/projects/covers/copyclean-ru.webp',
  },
  {
    id: 'tekhnar',
    n: '05',
    title: 'Технарь',
    subtitle: 'Ремонт ротационных соединений',
    client: 'Технарь',
    text: 'Корпоративный сайт с WordPress. Чёткая структура услуг, кейсы и форма обратной связи.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'WordPress', 'Адаптив'],
    label: 'Корпоративный',
    href: '#',
    poster: '/projects/covers/tehnar-ooo.webp',
  },
  {
    id: 'expert',
    n: '06',
    title: 'Эксперт Групп',
    subtitle: 'Сайт металлообработки',
    client: 'Эксперт Групп',
    text: 'Презентационный сайт для компании металлообработки. Bootstrap + Swiper, быстрая загрузка.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap', 'Swiper'],
    label: 'Корпоративный',
    href: '#',
    poster: '/projects/covers/cnc.webp',
  },
];

// Плейсхолдеры: замените на свои данные перед публикацией.
const contactLines: { label: string; value: string; href?: string }[] = [
  { label: 'Telegram', value: '@champagnepapiiiiiiiiiiiiiiii', href: 'https://t.me/champagnepapiiiiiiiiiiiiiiii' },
  { label: 'Email', value: 'dan44591@gmail.com', href: 'mailto:dan44591@gmail.com' },
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
          Обсудить проект
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

/* Текст «печатается» за прокруткой: каждое слово проявляется по мере движения */
function ScrollWord({ word, index, total, progress }: { word: string; index: number; total: number; progress: MotionValue<number> }) {
  const start = index / total;
  const end = (index + 1) / total;
  const opacity = useTransform(progress, [start, end], [0.16, 1]);
  return <motion.span className="scroll-word" style={{ opacity }}>{word} </motion.span>;
}

function ScrollWords({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] });
  const words = text.split(' ');
  return (
    <p ref={ref} className={`scroll-words ${className}`}>
      {words.map((w, i) => (
        <ScrollWord key={i} word={w} index={i} total={words.length} progress={scrollYProgress} />
      ))}
    </p>
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
          <ScrollWords className="lead" text="Привет, я Даниил — разработчик и специалист по автоматизации бизнеса." />
          <ScrollWords text="Учусь на бизнес-информатике, поэтому смотрю на разработку не только со стороны кода, но и через бизнес-процессы: где теряется время, что можно упростить и как технология приносит реальную пользу." />
          <ScrollWords text="Делаю сайты, веб-приложения и AI-автоматизацию. Не усложняю систему модными инструментами: подбираю решение, которое действительно работает." />
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
  const featured = projectCards.filter((p) => p.featured);
  const rest = projectCards.filter((p) => !p.featured);

  return (
    <section className="projects section-pad" id="projects">
      <div className="section-kicker">
        <span>05 / Портфолио</span>
        <span>Сайты, которые работают</span>
      </div>

      <div className="projects-heading">
        <Reveal>
          <h2>
            Проекты<span>.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p>
            Сайты, которые я сделал для клиентов. Листайте вниз, а чтобы посмотреть проект поближе — нажмите на карточку.
          </p>
        </Reveal>
      </div>

      {/* —— Блок «Новое · сайты с видео» (как у Андрея) —— */}
      <div className="projects-featured">
        <div className="projects-featured-head">
          <span className="projects-badge">Новое · сайты с видео</span>
          <p>Сайты, где история продукта разворачивается при прокрутке.</p>
        </div>
        <div className="featured-grid">
          {featured.map((p, i) => (
            <FeaturedProjectCard key={p.id} p={p} index={i} />
          ))}
        </div>
      </div>

      {/* —— Список детальных карточек —— */}
      <div className="projects-list">
        <div className="projects-list-head">
          <span>Все проекты</span>
          <span className="projects-count">{String(projectCards.length).padStart(2, '0')}</span>
        </div>
        {rest.map((p, i) => (
          <DetailProjectCard key={p.id} p={p} index={i} />
        ))}
      </div>
    </section>
  );
}

function FeaturedProjectCard({ p, index }: { p: Project; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Автоплей, когда карточка попадает в зону видимости
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio > 0.35),
      { threshold: [0, 0.35, 0.6] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !p.video) return;
    const shouldPlay = inView || hovered;
    if (shouldPlay) {
      v.play().catch(() => {});
    } else {
      v.pause();
      // не сбрасываем currentTime — чтобы при повторном входе продолжало плавно
    }
  }, [inView, hovered, p.video]);

  return (
    <Reveal delay={index * 0.07}>
      <a
        ref={cardRef}
        href={p.href && p.href !== '#' ? p.href : undefined}
        className="featured-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={(e) => {
          if (!p.href || p.href === '#') e.preventDefault();
        }}
        target={p.href && p.href !== '#' ? '_blank' : undefined}
        rel={p.href && p.href !== '#' ? 'noopener noreferrer' : undefined}
      >
        <div className="featured-media">
          {p.video ? (
            <video
              ref={videoRef}
              src={p.video}
              poster={p.poster}
              muted
              loop
              playsInline
              preload="auto"
            />
          ) : p.poster ? (
            <img src={p.poster} alt={p.title} />
          ) : (
            <div className={`featured-placeholder featured-ph-${(index % 4) + 1}`}>
              <span>{p.n}</span>
            </div>
          )}
          <div className="featured-overlay" />
        </div>
        <div className="featured-body">
          <div className="featured-meta">
            <span className="featured-num">{p.n}</span>
            <span className="project-tag">{p.label}</span>
          </div>
          <h3>{p.title}</h3>
          <p>{p.subtitle}</p>
          <span className="featured-link">
            Смотреть проект <ArrowUpRight size={16} />
          </span>
        </div>
      </a>
    </Reveal>
  );
}

function DetailProjectCard({ p, index }: { p: Project; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <Reveal delay={index * 0.05}>
      <article className={`detail-card ${open ? 'is-open' : ''}`}>
        <button
          type="button"
          className="detail-card-trigger"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          <div className="detail-card-left">
            <span className="detail-num">
              {p.n} / {String(projectCards.filter((x) => !x.featured).length).padStart(2, '0')}
            </span>
            <div>
              <h3>{p.title}</h3>
              <p className="detail-sub">{p.subtitle}</p>
            </div>
          </div>
          <div className="detail-card-right">
            <span className="project-tag">{p.label}</span>
            <span className={`detail-chevron ${open ? 'open' : ''}`}>
              <ArrowUpRight size={18} />
            </span>
          </div>
        </button>

        <motion.div
          className="detail-card-panel"
          initial={false}
          animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
          transition={{ duration: 0.45, ease: [0.22, 0.7, 0.2, 1] }}
        >
          <div className="detail-card-inner">
            <div className="detail-copy">
              {p.client && (
                <p className="detail-client">
                  <span>Клиент</span> {p.client}
                </p>
              )}
              <p>{p.text}</p>
              <div className="detail-tags">
                {p.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              {p.href && p.href !== '#' && (
                <a
                  href={p.href}
                  className="btn btn-ghost detail-live"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Живой сайт <ArrowUpRight size={16} />
                </a>
              )}
            </div>
            <div className={`detail-visual detail-ph-${(index % 4) + 1}`}>
              {p.video ? (
                <video src={p.video} poster={p.poster} muted loop playsInline preload="metadata" />
              ) : p.poster ? (
                <img src={p.poster} alt={p.title} />
              ) : (
                <div className="detail-visual-inner">
                  <span>{p.title}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </article>
    </Reveal>
  );
}

/* Карточка контакта: наклон следует за мышью, её можно потянуть по горизонтали,
   а QR-код смещается отдельно и создаёт эффект глубины. */
function ContactCard() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const dragX = useMotionValue(0);
  const qrHoverX = useSpring(mx, { stiffness: 140, damping: 16 });
  const qrHoverY = useSpring(my, { stiffness: 140, damping: 16 });
  const tiltX = useSpring(my, { stiffness: 140, damping: 18 });
  const tiltY = useSpring(mx, { stiffness: 140, damping: 18 });

  const rotateY = useTransform([tiltY, dragX], ([hx, dx]: number[]) => hx * 22 + dx * 0.05);
  const rotateX = useTransform(tiltX, (v) => -v * 16);
  const rotateZ = useTransform(dragX, [-160, 160], [-5, 5]);
  const qrX = useTransform(qrHoverX, (v) => v * 42);
  const qrY = useTransform(qrHoverY, (v) => v * 42);

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onPointerLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      className="id-card"
      drag="x"
      dragConstraints={{ left: -140, right: 140 }}
      dragElastic={0.3}
      dragSnapToOrigin
      whileTap={{ scale: 0.985 }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ x: dragX, rotateX, rotateY, rotateZ, transformPerspective: 1100 }}
    >
      <div className="id-glow" aria-hidden="true" />
      <div className="id-main">
        <p className="id-label">Контакт</p>
        <h3 className="id-name">
          Даниил
          <br />
          Бондарев
        </h3>
        <p className="id-role">Разработчик · автоматизация · AI</p>
        <dl className="id-rows">
          {contactLines.map((l) => (
            <div key={l.label}>
              <dt>{l.label}</dt>
              <dd>{l.href ? <a href={l.href}>{l.value}</a> : l.value}</dd>
            </div>
          ))}
          <div>
            <dt>Город</dt>
            <dd>Краснодар</dd>
          </div>
        </dl>
      </div>
      <motion.a
        href="https://t.me/champagnepapiiiiiiiiiiiiiiii"
        target="_blank"
        rel="noopener noreferrer"
        className="id-qr"
        style={{ x: qrX, y: qrY }}
      >
        <img src="/telegram-qr.png" alt="QR-код для связи в Telegram" width={150} height={150} draggable={false} />
        <span>Наведите камеру, откроется Telegram</span>
      </motion.a>
    </motion.div>
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
          <ContactCard />
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
