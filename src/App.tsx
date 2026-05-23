import { useState } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/4e09f2f5-442b-42ea-b81a-9bdeea0e75b4/files/8b859613-06e7-4dad-8e33-ad7d59979632.jpg";
const WIZARD_IMAGE = "https://cdn.poehali.dev/projects/4e09f2f5-442b-42ea-b81a-9bdeea0e75b4/files/ec9919b7-32e6-4952-870b-96cf18b3af1e.jpg";
const ACHIEVEMENTS_IMAGE = "https://cdn.poehali.dev/projects/4e09f2f5-442b-42ea-b81a-9bdeea0e75b4/files/bdfb94e7-157b-4fe7-87e3-fdf9a92f7a04.jpg";

type Page = "home" | "learn" | "game" | "guide" | "profile" | "achievements" | "map";

const LEVELS = [
  { name: "Росток", min: 0, max: 100, icon: "🌱", color: "#86efac" },
  { name: "Листочек", min: 100, max: 250, icon: "🍃", color: "#4ade80" },
  { name: "Цветок", min: 250, max: 500, icon: "🌸", color: "#f9a8d4" },
  { name: "Травник", min: 500, max: 900, icon: "🌿", color: "#34d399" },
  { name: "Друид", min: 900, max: 1500, icon: "🌳", color: "#22c55e" },
  { name: "Мастер Ботаники", min: 1500, max: 2000, icon: "✨", color: "#fbbf24" },
];

const PLANTS = [
  { id: 1, name: "Солнечная ромашка", emoji: "🌼", rarity: "Обычный", discovered: true, xp: 10, description: "Жизнерадостное растение, тянущееся к солнцу. Лепестки можно заваривать в чай." },
  { id: 2, name: "Лунный папоротник", emoji: "🌿", rarity: "Редкий", discovered: true, xp: 25, description: "Светится в темноте мягким голубым светом. Предпочитает сырые ущелья." },
  { id: 3, name: "Огненный тюльпан", emoji: "🌷", rarity: "Эпический", discovered: true, xp: 50, description: "Его лепестки теплее на ощупь, чем воздух вокруг. Никогда не вянет." },
  { id: 4, name: "Кристальный кактус", emoji: "🌵", rarity: "Легендарный", discovered: false, xp: 100, description: "???" },
  { id: 5, name: "Лесной гриб", emoji: "🍄", rarity: "Обычный", discovered: true, xp: 15, description: "Споры этого гриба мерцают как звёзды в тёмном лесу." },
  { id: 6, name: "Звёздный алоэ", emoji: "🪴", rarity: "Редкий", discovered: false, xp: 30, description: "???" },
];

const ACHIEVEMENTS = [
  { id: 1, name: "Первый шаг", desc: "Открой своё первое растение", icon: "🌱", unlocked: true },
  { id: 2, name: "Знаток листьев", desc: "Выучи 5 растений", icon: "📚", unlocked: true },
  { id: 3, name: "Юный ботаник", desc: "Набери 100 XP", icon: "⭐", unlocked: true },
  { id: 4, name: "Следопыт", desc: "Пройди урок без ошибок", icon: "🎯", unlocked: false },
  { id: 5, name: "Коллекционер", desc: "Открой 10 растений", icon: "🏆", unlocked: false },
  { id: 6, name: "Мастер флоры", desc: "Набери 1000 XP", icon: "✨", unlocked: false },
];

const MAP_NODES = [
  { id: 1, label: "🌱", name: "Поляна новичков", status: "completed", x: 50, y: 82 },
  { id: 2, label: "🌿", name: "Лес знаний", status: "completed", x: 25, y: 67 },
  { id: 3, label: "🍄", name: "Грибная долина", status: "completed", x: 65, y: 60 },
  { id: 4, label: "🌸", name: "Цветочный сад", status: "current", x: 40, y: 47 },
  { id: 5, label: "🌊", name: "Болото тайн", status: "locked", x: 70, y: 35 },
  { id: 6, label: "🏔️", name: "Вершина мудрости", status: "locked", x: 50, y: 20 },
];

// ====== LESSON DATA ======
type LessonSlide = { type: "text"; title: string; body: string; visual: string } | { type: "quiz"; q: string; answers: string[]; correct: number; hint: string; visual: string };

const LESSONS_DATA: { id: number; title: string; icon: string; xp: number; slides: LessonSlide[] }[] = [
  {
    id: 1, title: "Процесс роста растения", icon: "🌱", xp: 30,
    slides: [
      { type: "text", title: "Жизнь начинается с семени", visual: "🌰", body: "Каждое растение начинает свой путь с маленького семени. Внутри уже спрятан крошечный зародыш и запас питательных веществ для первого старта." },
      { type: "text", title: "Прорастание", visual: "🌰➡️🌱", body: "Из семени появляется росток. Сначала вниз тянется корешок — он ищет воду и держит растение. Потом вверх пробивается стебелёк с первыми листочками." },
      { type: "quiz", q: "Что первым появляется из семени при прорастании?", answers: ["🌿 Листья", "🌱 Корешок", "🌸 Цветок", "🍎 Плод"], correct: 1, hint: "Сначала растению нужна опора и вода, а уже потом — свет", visual: "🌰🔍" },
      { type: "text", title: "Рост и развитие", visual: "🌱➡️🌿➡️🌳", body: "Молодой росток превращается в стебель с настоящими листьями. Каждый лист — фабрика по производству пищи. Растение становится всё больше и крепче." },
      { type: "text", title: "Цветение и плод", visual: "🌿➡️🌸➡️🍎", body: "Когда растение взрослеет, появляются цветы. После опыления из цветка получается плод с новыми семенами — и цикл начинается заново!" },
      { type: "quiz", q: "Какая правильная последовательность роста?", answers: ["🌸→🌰→🌳", "🌰→🌱→🌳→🌸→🍎", "🍎→🌸→🌰", "🌳→🌱→🌰"], correct: 1, hint: "Семя → росток → дерево → цветок → плод", visual: "🔄" },
    ]
  },
  {
    id: 2, title: "Условия для роста", icon: "☀️", xp: 35,
    slides: [
      { type: "text", title: "Что нужно растению?", visual: "☀️💧🌬️🌡️", body: "Чтобы расти, растению нужны 4 важные вещи: свет, вода, воздух и подходящая температура. Если чего-то не хватает — растение слабеет." },
      { type: "text", title: "Солнечный свет", visual: "☀️🌿", body: "Свет — это энергия для растения. С его помощью лист делает пищу из воды и углекислого газа. Этот процесс называется фотосинтез." },
      { type: "quiz", q: "Зачем растениям солнечный свет?", answers: ["🎨 Чтобы быть красивыми", "🍽️ Чтобы делать себе еду", "🛌 Чтобы спать", "🎵 Чтобы петь"], correct: 1, hint: "Свет — это энергия для фотосинтеза", visual: "🌞🌿" },
      { type: "text", title: "Вода и почва", visual: "💧🪴", body: "Корни пьют воду из почвы. Вместе с водой растение получает минералы — что-то вроде витаминов для крепких листьев и стебля." },
      { type: "quiz", q: "Через что растение получает воду?", answers: ["🍃 Через листья", "🌸 Через цветы", "🌱 Через корни", "🎈 Из воздуха"], correct: 2, hint: "Корни — это «трубочки» растения для питья", visual: "🪴💧" },
      { type: "text", title: "Воздух и тепло", visual: "🌬️🌡️", body: "Из воздуха растение берёт углекислый газ — он тоже нужен для фотосинтеза. А ещё важна температура: большинству растений нравится тепло, но не жара." },
      { type: "quiz", q: "Какой газ из воздуха нужен растению для фотосинтеза?", answers: ["💨 Азот", "🔥 Углекислый газ", "✨ Кислород", "🎈 Гелий"], correct: 1, hint: "Растения поглощают CO₂ и выделяют O₂ — кислород", visual: "🌬️🌿" },
    ]
  },
  {
    id: 3, title: "Анатомия цветка", icon: "🌸", xp: 45,
    slides: [
      { type: "text", title: "Строение цветка", visual: "🌸🔍", body: "Цветок — это орган размножения растения. Он состоит из лепестков, тычинок, пестика и чашелистиков. Каждая часть выполняет свою роль в жизни растения." },
      { type: "quiz", q: "Какая часть цветка производит пыльцу?", answers: ["🌺 Лепесток", "🔧 Тычинка", "🌿 Чашелистик", "🎯 Пестик"], correct: 1, hint: "Тычинка — мужской орган цветка, производит пыльцу", visual: "🌸⚗️" },
      { type: "text", title: "Как происходит опыление?", visual: "🐝🌸", body: "Пчёлы и другие насекомые переносят пыльцу с цветка на цветок. Это называется опыление. Без него растения не смогут дать плоды и семена!" },
      { type: "quiz", q: "Кто чаще всего опыляет цветы?", answers: ["🐟 Рыбы", "🐝 Пчёлы и бабочки", "🐊 Крокодилы", "🦔 Ежи"], correct: 1, hint: "Насекомые привлекаются ярким цветом и запахом цветков", visual: "🦋🌼" },
    ]
  },
  {
    id: 4, title: "Типы листьев", icon: "🍃", xp: 35,
    slides: [
      { type: "text", title: "Почему листья разные?", visual: "🍃🍂🌿", body: "Листья бывают самых разных форм — круглые, вытянутые, резные, игольчатые. Форма листа помогает растению выживать в разных условиях: собирать больше света или экономить воду." },
      { type: "quiz", q: "Зачем хвойным деревьям иголки вместо листьев?", answers: ["Чтобы колоться", "💧 Экономить воду зимой", "🎨 Для красоты", "🐦 Защищаться от птиц"], correct: 1, hint: "Иглы теряют мало воды — это важно зимой и в засушливых местах", visual: "🌲❄️" },
    ]
  },
  {
    id: 5, title: "Водный цикл", icon: "🌊", xp: 40,
    slides: [
      { type: "text", title: "Путь воды в растении", visual: "💧🌱➡️☁️", body: "Вода поднимается от корней к листьям по специальным трубочкам — ксилеме. Потом часть воды испаряется через листья. Это называется транспирация — растение как бы «дышит» водой." },
      { type: "quiz", q: "По каким структурам вода поднимается в растении?", answers: ["🌊 По поверхности", "🧪 По ксилеме", "💨 По воздуху", "🔥 Через огонь"], correct: 1, hint: "Ксилема — проводящая ткань растений, похожа на крохотные трубочки", visual: "🌿💧⬆️" },
    ]
  },
  {
    id: 6, title: "Экосистемы", icon: "🌳", xp: 60,
    slides: [
      { type: "text", title: "Растения и окружающий мир", visual: "🌍🌿🐾", body: "Растения — основа любой экосистемы. Они производят кислород, дают пищу животным, защищают почву от эрозии и регулируют климат. Без растений жизнь на Земле была бы невозможна!" },
      { type: "quiz", q: "Что производят растения, делая воздух пригодным для дыхания?", answers: ["💨 Азот", "🔥 Углекислый газ", "✨ Кислород", "💧 Водород"], correct: 2, hint: "В процессе фотосинтеза растения поглощают CO₂ и выделяют O₂", visual: "🌳💨😊" },
    ]
  },
];

// ====== GAME DATA (rich visual questions) ======
type GameQuestion = {
  type: "choice" | "match" | "spot";
  scene: string;
  sceneAnim?: string;
  q: string;
  answers: string[];
  correct: number;
  explanation: string;
  xp: number;
};

const GAME_QUESTIONS: GameQuestion[] = [
  {
    type: "choice",
    scene: "🌿🌞💧",
    sceneAnim: "animate-float",
    q: "Что происходит с растением на этой картинке?",
    answers: ["🌱 Фотосинтез", "🍂 Увядание", "🌊 Затопление", "❄️ Замерзание"],
    correct: 0,
    explanation: "Растение под солнцем с водой проводит фотосинтез — превращает свет и воду в пищу!",
    xp: 20,
  },
  {
    type: "choice",
    scene: "🐝➡️🌸➡️🌺",
    sceneAnim: "animate-bounce-gentle",
    q: "Что делает пчела на этом рисунке?",
    answers: ["🍯 Делает мёд", "💐 Опыляет цветок", "😴 Отдыхает", "🎨 Раскрашивает"],
    correct: 1,
    explanation: "Пчела переносит пыльцу — это опыление! Без пчёл большинство цветов не дадут плодов.",
    xp: 25,
  },
  {
    type: "spot",
    scene: "🌳\n🌿🌿🌿\n🌱🌱🌱\n🍄🌸🌼",
    sceneAnim: "",
    q: "Какой организм на этой картинке НЕ является растением?",
    answers: ["🌸 Цветок", "🌳 Дерево", "🍄 Гриб", "🌿 Трава"],
    correct: 2,
    explanation: "Грибы — отдельное царство! Они не растения и не животные. У них нет хлорофилла.",
    xp: 30,
  },
  {
    type: "choice",
    scene: "🌵🏜️☀️",
    sceneAnim: "animate-float",
    q: "Как кактус выживает без воды в пустыне?",
    answers: ["🧙 Магией", "💧 Запасает воду в стебле", "🍃 Пьёт росу", "🤐 Не выживает"],
    correct: 1,
    explanation: "Кактус накапливает воду в толстом стебле! Это помогает ему выживать месяцами без дождя.",
    xp: 25,
  },
  {
    type: "match",
    scene: "🌱➡️🌿➡️🌳",
    sceneAnim: "animate-bounce-gentle",
    q: "Как называется этот процесс у растения?",
    answers: ["🔄 Рост", "💤 Сон", "🌊 Плавание", "✈️ Полёт"],
    correct: 0,
    explanation: "Рост растений — это удивительный процесс! За несколько лет маленький росток превращается в огромное дерево.",
    xp: 20,
  },
  {
    type: "choice",
    scene: "🍂🍁🌡️",
    sceneAnim: "",
    q: "Почему листья деревьев желтеют осенью?",
    answers: ["🎨 Художник покрасил", "☀️ Хлорофилл разрушается", "🌧️ От дождя", "🐛 Гусеницы съели"],
    correct: 1,
    explanation: "Осенью хлорофилл распадается, и становятся видны жёлтые и красные пигменты, которые были скрыты под зелёным.",
    xp: 30,
  },
];

function Particles() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: Math.random() * 10 + 8,
    emoji: ["✨", "🍃", "🌸", "⭐", "💫"][Math.floor(Math.random() * 5)],
  }));

  return (
    <div className="particles-bg" aria-hidden="true">
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            fontSize: `${p.size + 8}px`,
          }}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  );
}

function XPBar({ current, max }: { current: number; max: number }) {
  const pct = Math.min((current / max) * 100, 100);
  return (
    <div className="xp-bar">
      <div className="xp-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

function RarityBadge({ rarity }: { rarity: string }) {
  const colors: Record<string, string> = {
    "Обычный": "bg-green-900/50 text-green-300 border-green-700/30",
    "Редкий": "bg-blue-900/50 text-blue-300 border-blue-700/30",
    "Эпический": "bg-purple-900/50 text-purple-300 border-purple-700/30",
    "Легендарный": "bg-yellow-900/50 text-yellow-300 border-yellow-700/30",
  };
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${colors[rarity] || colors["Обычный"]}`}>
      {rarity}
    </span>
  );
}

function HomePage({ setPage }: { setPage: (p: Page) => void }) {
  const xp = 340;
  const level = LEVELS[2];
  const nextLevel = LEVELS[3];

  return (
    <div className="animate-fade-in space-y-5">
      <div className="relative rounded-3xl overflow-hidden">
        <img src={HERO_IMAGE} alt="Волшебный ботанический сад" className="w-full h-52 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f12] via-[#0a1f12]/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h1 className="font-nunito font-black text-3xl text-white glow-text mb-1">🌿 Ботаника Магика</h1>
          <p className="font-comfortaa text-green-300 text-sm">Волшебный мир растений ждёт тебя!</p>
        </div>
      </div>

      <div className="magic-card p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-green-500/50">
            <img src={WIZARD_IMAGE} alt="Персонаж" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-nunito font-black text-white">Юный Ботаник</span>
              <span className="text-xl">{level.icon}</span>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-300 border border-purple-700/40">{level.name}</span>
          </div>
          <div className="text-right">
            <div className="font-black text-2xl text-yellow-400 glow-gold">{xp}</div>
            <div className="text-xs text-green-600">XP</div>
          </div>
        </div>
        <XPBar current={xp - level.min} max={nextLevel.min - level.min} />
        <div className="flex justify-between mt-1 text-xs text-green-600">
          <span>{level.name}</span>
          <span>{xp}/{nextLevel.min} XP → {nextLevel.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => setPage("game")} className="btn-magic text-left p-4 rounded-3xl flex items-center gap-3">
          <span className="text-3xl">🎮</span>
          <div><div className="font-black text-sm text-white">Играть</div><div className="text-xs text-green-200">Пройти квест</div></div>
        </button>
        <button onClick={() => setPage("learn")} className="btn-purple text-left p-4 rounded-3xl flex items-center gap-3">
          <span className="text-3xl">📖</span>
          <div><div className="font-black text-sm text-white">Учиться</div><div className="text-xs text-purple-200">Новый урок</div></div>
        </button>
      </div>

      <div className="magic-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-nunito font-black text-green-200">🔥 Ежедневная серия</h2>
          <span className="text-yellow-400 font-black text-lg">7 дней</span>
        </div>
        <div className="flex gap-2">
          {["Пн","Вт","Ср","Чт","Пт","Сб","Вс"].map((day, i) => (
            <div key={day} className="flex-1 text-center">
              <div className={`w-full aspect-square rounded-xl flex items-center justify-center text-sm mb-1 ${
                i < 5 ? "bg-green-700/30 border border-green-600/50 text-green-300" : "bg-green-900/30 border border-green-800/30 text-green-800"
              }`}>{i < 5 ? "✓" : "○"}</div>
              <div className="text-xs text-green-700">{day}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="magic-card p-4">
        <h2 className="font-nunito font-black text-green-200 mb-3">🌟 Недавно открыто</h2>
        <div className="flex items-center gap-4">
          <div className="text-5xl animate-float">{PLANTS[2].emoji}</div>
          <div className="flex-1">
            <div className="font-bold text-white">{PLANTS[2].name}</div>
            <RarityBadge rarity={PLANTS[2].rarity} />
            <p className="text-sm text-green-500 mt-1">{PLANTS[2].description}</p>
          </div>
          <div className="text-right">
            <div className="font-black text-yellow-400 text-sm">+{PLANTS[2].xp}</div>
            <div className="text-xs text-green-600">XP</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LessonView({ lessonId, onBack }: { lessonId: number; onBack: () => void }) {
  const lesson = LESSONS_DATA.find(l => l.id === lessonId)!;
  const [slideIdx, setSlideIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [done, setDone] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const slide = lesson.slides[slideIdx];
  const total = lesson.slides.length;
  const isLast = slideIdx === total - 1;

  const handleNext = () => {
    if (isLast) { setDone(true); return; }
    setSlideIdx(i => i + 1);
    setSelected(null);
    setShowHint(false);
  };

  const handleAnswer = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (slide.type === "quiz" && i === slide.correct) setCorrectCount(c => c + 1);
  };

  if (done) {
    return (
      <div className="animate-scale-in flex flex-col items-center gap-5 py-6">
        <div className="text-6xl animate-float">🎓</div>
        <div className="text-center">
          <h2 className="font-nunito font-black text-2xl text-white mb-1">Урок завершён!</h2>
          <p className="text-green-400">{lesson.title}</p>
        </div>
        <div className="magic-card p-5 w-full text-center space-y-3">
          <div className="text-4xl font-black text-yellow-400 glow-gold">+{lesson.xp} XP</div>
          <div className="text-green-400 text-sm">Правильных ответов: {correctCount} из {lesson.slides.filter(s => s.type === "quiz").length}</div>
          <XPBar current={correctCount} max={Math.max(1, lesson.slides.filter(s => s.type === "quiz").length)} />
        </div>
        <button onClick={onBack} className="btn-magic px-8 py-3">← Вернуться к урокам</button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="w-10 h-10 rounded-2xl bg-green-900/50 border border-green-700/30 flex items-center justify-center">
          <Icon name="ChevronLeft" size={18} className="text-green-400" />
        </button>
        <div className="flex-1">
          <div className="font-nunito font-black text-white">{lesson.icon} {lesson.title}</div>
          <div className="text-xs text-green-600">Шаг {slideIdx + 1} из {total}</div>
        </div>
        <div className="text-xs font-bold text-yellow-500">+{lesson.xp} XP</div>
      </div>

      <div className="flex gap-1.5">
        {lesson.slides.map((_, i) => (
          <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
            i < slideIdx ? "bg-green-500" : i === slideIdx ? "bg-purple-400" : "bg-green-900"
          }`} />
        ))}
      </div>

      {slide.type === "text" && (
        <div className="space-y-4">
          <div className="magic-card p-6 text-center">
            <div className="text-6xl mb-3 animate-float">{slide.visual}</div>
            <h3 className="font-nunito font-black text-xl text-white mb-3">{slide.title}</h3>
            <p className="text-green-300 leading-relaxed">{slide.body}</p>
          </div>
          <button onClick={handleNext} className="btn-magic w-full py-3">
            {isLast ? "🎓 Завершить урок" : "Дальше →"}
          </button>
        </div>
      )}

      {slide.type === "quiz" && (
        <div className="space-y-4">
          <div className="magic-card p-5 text-center">
            <div className="text-5xl mb-2">{slide.visual}</div>
            <div className="text-xs text-purple-400 font-bold mb-2">❓ ВОПРОС</div>
            <p className="font-nunito font-bold text-lg text-white leading-snug">{slide.q}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {slide.answers.map((ans, i) => {
              let cls = "p-4 rounded-2xl border font-nunito font-bold text-sm transition-all duration-300 text-center ";
              if (selected === null) cls += "magic-card hover:border-green-500/60 cursor-pointer text-green-100";
              else if (i === slide.correct) cls += "border-green-400/80 bg-green-900/40 text-green-200";
              else if (i === selected) cls += "border-red-500/50 bg-red-900/20 text-red-400";
              else cls += "magic-card opacity-40 text-green-700 cursor-default";
              return (
                <button key={i} className={cls} onClick={() => handleAnswer(i)}>
                  <div className="text-2xl mb-1">{ans.split(" ")[0]}</div>
                  <div>{ans.split(" ").slice(1).join(" ")}</div>
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <div className={`p-4 rounded-2xl border animate-fade-in ${selected === slide.correct ? "border-green-500/50 bg-green-900/20" : "border-orange-500/50 bg-orange-900/10"}`}>
              <div className="font-bold text-sm mb-1 flex items-center gap-2">
                {selected === slide.correct ? <span className="text-green-400">✅ Верно!</span> : <span className="text-orange-400">💡 Почти!</span>}
              </div>
              <p className="text-sm text-green-400">{slide.hint}</p>
            </div>
          )}

          {selected === null && (
            <button onClick={() => setShowHint(!showHint)} className="text-xs text-green-700 hover:text-green-500 transition-colors w-full text-center">
              {showHint ? "Скрыть" : "💡 Показать подсказку"}
            </button>
          )}
          {showHint && selected === null && (
            <div className="p-3 rounded-xl bg-yellow-900/20 border border-yellow-700/30 text-xs text-yellow-300 animate-fade-in">{slide.hint}</div>
          )}

          {selected !== null && (
            <button onClick={handleNext} className="btn-magic w-full py-3">
              {isLast ? "🎓 Завершить урок" : "Следующий шаг →"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function LearnPage() {
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);
  const doneLessons = [1, 2];

  if (activeLessonId !== null) {
    return <LessonView lessonId={activeLessonId} onBack={() => setActiveLessonId(null)} />;
  }

  return (
    <div className="animate-fade-in space-y-4">
      <div>
        <h1 className="font-nunito font-black text-2xl text-white glow-text">📚 Обучение</h1>
        <p className="text-green-500 text-sm">Изучай магию ботаники</p>
      </div>
      <div className="magic-card p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-green-300 font-bold">Прогресс курса</span>
          <span className="text-green-500">{doneLessons.length}/{LESSONS_DATA.length} уроков</span>
        </div>
        <XPBar current={doneLessons.length} max={LESSONS_DATA.length} />
      </div>
      <div className="space-y-3">
        {LESSONS_DATA.map((l) => {
          const done = doneLessons.includes(l.id);
          const locked = !done && l.id > (Math.max(...doneLessons) + 1);
          return (
            <div key={l.id} className={`plant-card transition-all ${locked ? "opacity-50" : ""}`}
              onClick={() => !locked && setActiveLessonId(l.id)}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
                  done ? "bg-green-900/50" : locked ? "bg-green-950/80" : "bg-purple-900/50"
                }`}>
                  {done ? "✅" : locked ? "🔒" : l.icon}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-white">{l.title}</div>
                  <div className="flex gap-3 mt-1">
                    <span className="text-xs text-green-600">📖 {l.slides.length} шагов</span>
                    <span className="text-xs text-yellow-600">+{l.xp} XP</span>
                  </div>
                </div>
                {!locked && !done && (
                  <button className="btn-magic px-4 py-2 text-xs whitespace-nowrap" onClick={(e) => { e.stopPropagation(); setActiveLessonId(l.id); }}>
                    🚀 Начать
                  </button>
                )}
                {done && <span className="text-green-400 text-sm font-bold">Пройдено</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GamePage() {
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [totalXp, setTotalXp] = useState(0);
  const [done, setDone] = useState(false);
  const [showExplain, setShowExplain] = useState(false);

  const q = GAME_QUESTIONS[qIdx];
  const totalQ = GAME_QUESTIONS.length;

  const handleAnswer = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    setShowExplain(true);
    if (i === q.correct) setTotalXp(x => x + q.xp);
  };

  const handleNext = () => {
    if (qIdx + 1 < totalQ) {
      setQIdx(idx => idx + 1);
      setSelected(null);
      setShowExplain(false);
    } else {
      setDone(true);
    }
  };

  const restart = () => { setQIdx(0); setSelected(null); setTotalXp(0); setDone(false); setShowExplain(false); };

  if (done) {
    const maxXp = GAME_QUESTIONS.reduce((s, q) => s + q.xp, 0);
    const pct = Math.round((totalXp / maxXp) * 100);
    return (
      <div className="animate-scale-in flex flex-col items-center gap-5 py-6">
        <div className="text-7xl animate-float">{pct === 100 ? "🏆" : pct >= 60 ? "⭐" : "🌱"}</div>
        <div className="text-center">
          <h2 className="font-nunito font-black text-3xl text-white mb-1">
            {pct === 100 ? "Мастер ботаники!" : pct >= 60 ? "Отлично!" : "Продолжай учиться!"}
          </h2>
          <p className="text-green-400">Результат: {pct}%</p>
        </div>
        <div className="magic-card p-5 w-full text-center space-y-3">
          <div className="text-5xl font-black text-yellow-400 glow-gold">+{totalXp} XP</div>
          <p className="text-green-500 text-sm">из {maxXp} возможных</p>
          <XPBar current={totalXp} max={maxXp} />
        </div>
        <button onClick={restart} className="btn-magic px-8 py-3 text-white">🔄 Играть снова</button>
      </div>
    );
  }

  const isCorrect = selected !== null && selected === q.correct;

  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-nunito font-black text-2xl text-white glow-text">🎮 Квест</h1>
          <p className="text-green-500 text-sm">Угадай, что происходит!</p>
        </div>
        <div className="magic-card px-4 py-2 text-center">
          <div className="font-black text-yellow-400 text-lg">{totalXp}</div>
          <div className="text-xs text-green-600">XP</div>
        </div>
      </div>

      <div className="flex gap-1.5">
        {GAME_QUESTIONS.map((_, i) => (
          <div key={i} className={`flex-1 h-2 rounded-full transition-all duration-500 ${
            i < qIdx ? "bg-green-500" : i === qIdx ? "bg-purple-400" : "bg-green-900"
          }`} />
        ))}
      </div>

      {/* Visual scene card */}
      <div className="magic-card p-5 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ background: "radial-gradient(circle, #a855f7 0%, transparent 70%)" }} />
        <div className="text-xs text-purple-400 font-bold mb-3 tracking-widest">
          {{ choice: "🔍 ЧТО ЗДЕСЬ ПРОИСХОДИТ?", match: "🔗 УГАДАЙ ПРОЦЕСС", spot: "🎯 НАЙДИ ЛИШНЕЕ" }[q.type]}
        </div>
        <div className={`text-5xl mb-2 leading-tight whitespace-pre-line ${q.sceneAnim || ""}`}
          style={{ letterSpacing: "0.1em" }}>
          {q.scene}
        </div>
        <div className="w-full h-px bg-green-800/40 my-3" />
        <p className="font-nunito font-bold text-lg text-white leading-snug">{q.q}</p>
        <div className="mt-2 text-xs text-green-600">+{q.xp} XP за правильный ответ</div>
      </div>

      {/* Answers grid */}
      <div className="grid grid-cols-2 gap-3">
        {q.answers.map((ans, i) => {
          const emoji = ans.split(" ")[0];
          const text = ans.split(" ").slice(1).join(" ");
          let cls = "p-4 rounded-2xl border font-nunito font-bold text-sm transition-all duration-300 text-center flex flex-col items-center gap-1 ";
          if (selected === null) {
            cls += "magic-card hover:border-green-500/60 hover:scale-105 cursor-pointer text-green-100 active:scale-95";
          } else if (i === q.correct) {
            cls += "border-green-400/80 bg-green-900/40 text-green-200 scale-105";
          } else if (i === selected) {
            cls += "border-red-500/50 bg-red-900/20 text-red-400";
          } else {
            cls += "magic-card opacity-30 text-green-800 cursor-default";
          }
          return (
            <button key={i} className={cls} onClick={() => handleAnswer(i)}>
              <span className="text-3xl">{emoji}</span>
              <span>{text}</span>
              {selected !== null && i === q.correct && <span className="text-green-400 text-lg">✓</span>}
              {selected !== null && i === selected && i !== q.correct && <span className="text-red-400 text-lg">✗</span>}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showExplain && (
        <div className={`p-4 rounded-2xl border animate-fade-in ${isCorrect ? "border-green-500/50 bg-green-900/20" : "border-orange-500/40 bg-orange-900/10"}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{isCorrect ? "✅" : "💡"}</span>
            <span className={`font-bold ${isCorrect ? "text-green-400" : "text-orange-400"}`}>
              {isCorrect ? `Верно! +${q.xp} XP` : "Не совсем..."}
            </span>
          </div>
          <p className="text-sm text-green-300 leading-relaxed">{q.explanation}</p>
        </div>
      )}

      {selected !== null && (
        <button onClick={handleNext} className="btn-magic w-full py-3 text-white font-bold animate-fade-in">
          {qIdx + 1 < totalQ ? "Следующий вопрос →" : "🏆 Посмотреть результат"}
        </button>
      )}
    </div>
  );
}

function GuidePage() {
  const [filter, setFilter] = useState("all");
  const rarities = ["all", "Обычный", "Редкий", "Эпический", "Легендарный"];
  const filtered = filter === "all" ? PLANTS : PLANTS.filter(p => p.rarity === filter);

  return (
    <div className="animate-fade-in space-y-4">
      <div>
        <h1 className="font-nunito font-black text-2xl text-white glow-text">🌿 Справочник</h1>
        <p className="text-green-500 text-sm">Твоя коллекция растений</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Открыто", value: PLANTS.filter(p => p.discovered).length, icon: "🌱" },
          { label: "Всего", value: PLANTS.length, icon: "📖" },
          { label: "Редких", value: PLANTS.filter(p => p.rarity !== "Обычный" && p.discovered).length, icon: "💎" },
        ].map(s => (
          <div key={s.label} className="magic-card p-3 text-center">
            <div className="text-2xl">{s.icon}</div>
            <div className="font-black text-xl text-white">{s.value}</div>
            <div className="text-xs text-green-600">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-magic">
        {rarities.map(r => (
          <button key={r} onClick={() => setFilter(r)}
            className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
              filter === r ? "bg-green-700/30 border-green-500/60 text-green-200" : "bg-green-900/40 border-green-800/30 text-green-600 hover:text-green-300"
            }`}>
            {r === "all" ? "Все" : r}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {filtered.map(plant => (
          <div key={plant.id} className={`plant-card ${!plant.discovered ? "opacity-60" : ""}`}>
            <div className="text-4xl text-center mb-2 animate-float" style={{ animationDelay: `${plant.id * 0.3}s` }}>
              {plant.discovered ? plant.emoji : "❓"}
            </div>
            <div className="text-center">
              <div className="font-bold text-sm text-white mb-1">{plant.discovered ? plant.name : "???"}</div>
              <RarityBadge rarity={plant.rarity} />
              {plant.discovered && <div className="mt-2 text-xs text-green-500 line-clamp-2">{plant.description}</div>}
              <div className="mt-2 text-xs text-yellow-500 font-bold">+{plant.xp} XP</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfilePage() {
  const xp = 340;
  const currentLvl = LEVELS[2];

  return (
    <div className="animate-fade-in space-y-5">
      <div className="relative rounded-3xl overflow-hidden">
        <img src={ACHIEVEMENTS_IMAGE} alt="Достижения" className="w-full h-36 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f12] via-[#0a1f12]/50 to-transparent" />
        <div className="absolute bottom-4 left-4 flex items-center gap-3">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-yellow-400/60">
            <img src={WIZARD_IMAGE} alt="Профиль" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="font-nunito font-black text-white text-xl">Юный Ботаник</div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg">{currentLvl.icon}</span>
              <span className="text-sm text-green-300 font-bold">{currentLvl.name}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {[
          { v: xp, l: "XP", c: "text-yellow-400" },
          { v: 7, l: "Дней", c: "text-green-400" },
          { v: 4, l: "Растений", c: "text-purple-400" },
          { v: 3, l: "Наград", c: "text-yellow-300" },
        ].map(s => (
          <div key={s.l} className="magic-card p-3 text-center">
            <div className={`font-black text-xl ${s.c}`}>{s.v}</div>
            <div className="text-xs text-green-700">{s.l}</div>
          </div>
        ))}
      </div>
      <div className="magic-card p-4">
        <h3 className="font-nunito font-black text-green-200 mb-4">🌟 Путь мастера</h3>
        <div className="space-y-3">
          {LEVELS.map((lvl, i) => {
            const isUnlocked = xp >= lvl.min;
            const isCurrent = xp >= lvl.min && xp < lvl.max;
            return (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
                isCurrent ? "bg-purple-900/30 border border-purple-700/40" :
                isUnlocked ? "bg-green-900/20" : "opacity-40"
              }`}>
                <span className="text-2xl">{lvl.icon}</span>
                <div className="flex-1">
                  <div className={`font-bold text-sm ${isCurrent ? "text-purple-300" : isUnlocked ? "text-green-300" : "text-green-800"}`}>{lvl.name}</div>
                  <div className="text-xs text-green-700">от {lvl.min} XP</div>
                </div>
                {isCurrent && <span className="text-xs font-bold text-purple-300 bg-purple-900/50 px-2 py-0.5 rounded-full border border-purple-700/40">Сейчас</span>}
                {isUnlocked && !isCurrent && <Icon name="CheckCircle" size={18} className="text-green-600" />}
                {!isUnlocked && <Icon name="Lock" size={18} className="text-green-900" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AchievementsPage() {
  return (
    <div className="animate-fade-in space-y-4">
      <div>
        <h1 className="font-nunito font-black text-2xl text-white glow-text">🏆 Достижения</h1>
        <p className="text-green-500 text-sm">Твои награды за старания</p>
      </div>
      <div className="magic-card p-4">
        <div className="flex items-center gap-4">
          <img src={ACHIEVEMENTS_IMAGE} alt="" className="w-20 h-20 rounded-2xl object-cover" />
          <div className="flex-1">
            <div className="font-black text-3xl text-yellow-400 glow-gold">{ACHIEVEMENTS.filter(a => a.unlocked).length}/{ACHIEVEMENTS.length}</div>
            <div className="text-green-500 text-sm">достижений получено</div>
            <div className="mt-2"><XPBar current={ACHIEVEMENTS.filter(a => a.unlocked).length} max={ACHIEVEMENTS.length} /></div>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {ACHIEVEMENTS.map(ach => (
          <div key={ach.id} className={`achievement-card ${ach.unlocked ? "unlocked" : "locked"}`}>
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${
                ach.unlocked ? "bg-yellow-900/30 border border-yellow-600/40" : "bg-green-900/50 border border-green-800/20"
              }`}>{ach.icon}</div>
              <div className="flex-1">
                <div className={`font-bold ${ach.unlocked ? "text-white" : "text-green-700"}`}>{ach.name}</div>
                <div className="text-sm text-green-600">{ach.desc}</div>
              </div>
              {ach.unlocked ? <span className="text-yellow-400 text-2xl">✨</span> : <Icon name="Lock" size={20} className="text-green-800" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MapPage() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="animate-fade-in space-y-4">
      <div>
        <h1 className="font-nunito font-black text-2xl text-white glow-text">🗺️ Карта приключений</h1>
        <p className="text-green-500 text-sm">Твой путь по волшебному лесу</p>
      </div>
      <div className="magic-card p-4">
        <div className="relative w-full" style={{ height: 360 }}>
          <div className="absolute inset-0 rounded-2xl overflow-hidden">
            <img src={HERO_IMAGE} alt="" className="w-full h-full object-cover opacity-25" />
            <div className="absolute inset-0" style={{ background: "rgba(10,31,18,0.55)" }} />
          </div>
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
            {MAP_NODES.slice(0, -1).map((node, i) => {
              const next = MAP_NODES[i + 1];
              return (
                <line key={i}
                  x1={`${node.x}%`} y1={`${node.y}%`}
                  x2={`${next.x}%`} y2={`${next.y}%`}
                  stroke={node.status === "completed" ? "rgba(34,197,94,0.5)" : "rgba(34,197,94,0.15)"}
                  strokeWidth="2"
                  strokeDasharray={node.status !== "completed" ? "6 4" : "none"}
                />
              );
            })}
          </svg>
          {MAP_NODES.map(node => (
            <div key={node.id}
              className={`map-node absolute -translate-x-1/2 -translate-y-1/2 z-10 ${node.status}`}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              onMouseEnter={() => setHovered(node.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {node.label}
              {hovered === node.id && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#0a1f12] border border-green-700/40 rounded-xl px-3 py-1.5 text-xs font-bold text-green-200 shadow-xl z-20">
                  {node.name}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Пройдено", color: "bg-green-500", count: 3 },
          { label: "Текущий", color: "bg-purple-500", count: 1 },
          { label: "Заблокировано", color: "bg-green-900", count: 2 },
        ].map(l => (
          <div key={l.label} className="magic-card p-3 text-center">
            <div className={`w-6 h-6 rounded-full ${l.color} mx-auto mb-1`} />
            <div className="text-xs text-green-500">{l.label}</div>
            <div className="font-black text-white">{l.count}</div>
          </div>
        ))}
      </div>
      <div className="magic-card p-4" style={{ borderColor: "rgba(107,33,168,0.4)", background: "linear-gradient(135deg, rgba(107,33,168,0.12), rgba(45,27,105,0.08))" }}>
        <div className="flex items-center gap-3">
          <span className="text-3xl animate-float">🌸</span>
          <div>
            <div className="font-bold text-purple-300">Текущая локация</div>
            <div className="font-nunito font-black text-white">Цветочный сад</div>
            <div className="text-sm text-green-500 mt-0.5">3 задания до следующей</div>
          </div>
          <button className="btn-purple px-4 py-2 text-sm ml-auto">Идти!</button>
        </div>
      </div>
    </div>
  );
}

const NAV_ITEMS: { id: Page; icon: string; label: string }[] = [
  { id: "home", icon: "🏠", label: "Главная" },
  { id: "learn", icon: "📚", label: "Учёба" },
  { id: "game", icon: "🎮", label: "Игра" },
  { id: "guide", icon: "🌿", label: "Флора" },
  { id: "map", icon: "🗺️", label: "Карта" },
  { id: "achievements", icon: "🏆", label: "Награды" },
  { id: "profile", icon: "👤", label: "Профиль" },
];

export default function App() {
  const [page, setPage] = useState<Page>("home");

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage setPage={setPage} />;
      case "learn": return <LearnPage />;
      case "game": return <GamePage />;
      case "guide": return <GuidePage />;
      case "map": return <MapPage />;
      case "achievements": return <AchievementsPage />;
      case "profile": return <ProfilePage />;
    }
  };

  return (
    <div className="min-h-screen relative font-nunito">
      <Particles />
      <div className="relative z-10 max-w-lg mx-auto px-4 pt-6 pb-32">
        {renderPage()}
      </div>
      <nav className="fixed bottom-0 left-0 right-0 z-20 px-2 pb-2">
        <div className="max-w-lg mx-auto">
          <div className="m-2 rounded-3xl border border-green-800/40 backdrop-blur-xl p-2 flex justify-around"
            style={{ background: "rgba(8, 24, 14, 0.96)" }}>
            {NAV_ITEMS.map(item => (
              <button key={item.id} onClick={() => setPage(item.id)} className={`nav-item ${page === item.id ? "active" : ""}`}>
                <span className="text-lg leading-none">{item.icon}</span>
                <span className="leading-none text-[10px]">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}