// Порядок, размеры и ссылки из прототипа Figma. Координаты в пикселях исходного фрейма.
const vinComparisonSlide = {
  "figmaId": "5478:106",
  "title": "Поворот и VIN-пересборка",
  "scene": "vin-comparison",
  "entryDirection": "fade",
  "width": 1920,
  "height": 1080,
  "build": {
    "background": "#141413",
    "templateId": "vin-comparison-slide",
    "comparison": {
      "src": "assets/vin-comparison/reference.mp4",
      "poster": "assets/vin-comparison/reference-poster.jpg",
      "description": "Референс с 60fps, активация карты",
      "label": "Поворот"
    },
    "steps": []
  }
};

const ideasReferenceZoom = 1.56;
const ideasReferenceSteps = [
  { label: "Анимация", focus: "ideas-animation", blockX: 216 },
  { label: "Звуки и хаптики", focus: "ideas-haptics", blockX: 1635 },
  { label: "Скролл", focus: "ideas-scroll", blockX: 3054 },
  { label: "Пасхалки", focus: "ideas-easter-eggs", blockX: 4473 },
].map(({ label, focus, blockX }) => ({
  label,
  focus,
  x: 101 + (blockX + 1299 / 2) * 1717 / 6060 - 960 / ideasReferenceZoom,
  centerY: 173 + (261 + 2317 / 2) * 805 / 2839,
  scale: ideasReferenceZoom,
}));

const ideasReferenceBuild = {
  background: "#141413",
  templateId: "ideas-reference-slide",
  steps: ideasReferenceSteps,
};

const resourceBoard = {
  width: 3308,
  panelTop: 132,
  panelHeight: 1028,
  panelPadding: 32,
  panelHeader: 80,
  tileWidth: 420,
  tileHeight: 80,
  columnStep: 440,
  rowStep: 84,
  groups: [
    { label: "Референсы", focus: "resources-references", x: 0, width: 924, columns: 2, firstRow: 200, lastRow: 660 },
    { label: "Код и компоненты", focus: "resources-components", x: 972, width: 1364, columns: 3, firstRow: 824, lastRow: 1468 },
    { label: "Инструменты", focus: "resources-tools", x: 2384, width: 924, columns: 2, firstRow: 1632, lastRow: 1908 },
  ],
};
const resourceOverviewScale = 1760 / resourceBoard.width;
const resourceCloseScale = .98;

window.presentationSlides = [
  {
    "figmaId": "5466:2186",
    "title": "Реверс-инжиниринг креативов",
    "width": 1920,
    "height": 1080,
    "image": "assets/slides/01.webp",
    "build": { "templateId": "cover-credit-slide", "steps": [] }
  },
  {
    "figmaId": "5466:2004",
    "title": "Кто я и что мы делаем",
    "entryDirection": "top",
    "width": 1920,
    "height": 1080,
    "build": {
      "templateId": "intro-badge-slide",
      "steps": []
    }
  },
  {
    "figmaId": "5466:2009",
    "title": "Техника в лизинг для бизнеса",
    "scene": "intro-windows",
    "width": 1920,
    "height": 1080,
    "build": {
      "templateId": "intro-recording-slide",
      "steps": [],
      "recording": { "src": "assets/slide-03/leasing-trimmed.mp4", "poster": "assets/slide-03/leasing-trimmed-poster.jpg", "raised": true }
    }
  },
  {
    "figmaId": "5466:2042",
    "title": "Звонок по QR-коду",
    "scene": "intro-windows",
    "width": 1920,
    "height": 1080,
    "build": {
      "templateId": "intro-recording-slide",
      "steps": [],
      "recording": { "src": "assets/slide-04/qr-demo.mp4", "poster": "assets/slide-04/qr-demo.jpg" }
    }
  },
  {
    "figmaId": "5466:2107",
    "title": "Разбираем по винтикам",
    "scene": "intro-windows",
    "exitMotion": "down",
    "width": 1920,
    "height": 1080,
    "build": {
      "templateId": "intro-parts-slide",
      "steps": [],
      "frameCount": 97
    }
  },
  {
    "figmaId": "5466:2179",
    "title": "КАМАЗ с поливкой",
    "width": 1920,
    "height": 1080,
    "image": "assets/intro/2179.png"
  },
  {
    "figmaId": "5466:2181",
    "title": "КАМАЗ с божьими коровками",
    "exitMotion": "fade",
    "width": 1920,
    "height": 1080,
    "transition": { "from": "5466:2179", "templateId": "truck-magic-transition" },
    "image": "assets/intro/2181.png"
  },
  {
    "figmaId": "5466:2172",
    "title": "Инструменты и проекты",
    "width": 1920,
    "height": 1080,
    "build": {
      "templateId": "intro-tools-slide",
      "steps": []
    }
  },
  {
    "figmaId": "5466:2001",
    "title": "Реверс-инжиниринг креативов",
    "entryDirection": "bottom",
    "scene": "jian-yang",
    "width": 1920,
    "height": 1080,
    "image": "assets/slides/01.webp",
    "build": { "templateId": "cover-credit-slide", "steps": [] }
  },
  {
    "figmaId": "66:62",
    "scene": "jian-yang",
    "title": "Кто я и что мы делаем",
    "width": 1920,
    "height": 1080,
    "image": "assets/slides/02.png"
  },
  {
    "figmaId": "66:64",
    "scene": "jian-yang",
    "title": "Кто я и что мы делаем",
    "width": 1920,
    "height": 1080,
    "image": "assets/slides/03.png"
  },
  {
    "figmaId": "66:71",
    "title": "Реверс-инжиниринг",
    "width": 1920,
    "height": 1080,
    "build": { "templateId": "reverse-engineering-slide", "steps": [] }
  },
  {
    "figmaId": "66:79",
    "title": "Toyota Corolla",
    "width": 1920,
    "height": 1080,
    "image": "assets/slides/06.png"
  },
  {
    "figmaId": "66:77",
    "title": "BYD F3",
    "exitMotion": "fade",
    "width": 1920,
    "height": 1080,
    "transition": { "from": "66:79", "templateId": "meme-transition" },
    "image": "assets/slides/05.png"
  },
  {
    "figmaId": "66:81",
    "title": "скопировать",
    "width": 1920,
    "height": 1080,
    "image": "assets/slides/07.png"
  },
  {
    "figmaId": "66:742",
    "title": "Скопировать",
    "scene": "reverse-engineering-approach",
    "width": 1920,
    "height": 1080,
    "transition": { "from": "66:81", "templateId": "strike-transition" },
    "image": "assets/slides/08.png"
  },
  {
    "figmaId": "66:745",
    "title": "Общий подход",
    "scene": "reverse-engineering-approach",
    "width": 1920,
    "height": 1080,
    "build": {
      "templateId": "approach-slide",
      "overview": { "x": 0, "scale": 1920 / 2503 },
      "steps": [
        { "label": "Контекст", "x": 24, "scale": 2.1 },
        { "label": "Разбор", "x": 484, "scale": 2.1 },
        { "label": "Переосмысление", "x": 944, "scale": 2.1 },
        { "label": "Сборка", "x": 1404, "scale": 2.1 },
        { "label": "Финал", "x": 1404, "scale": 1.67 }
      ]
    }
  },
  {
    "figmaId": "local:and-creatives",
    "title": "Реверс-инжиниринг креативов при помощи AI!",
    "scene": "reverse-engineering-approach",
    "width": 1920,
    "height": 1080,
    "build": {
      "templateId": "creative-letter-slide",
      "steps": []
    }
  },
  {
    "figmaId": "66:760",
    "title": "Подход для анимации",
    "scene": "reverse-engineering-approach",
    "width": 1920,
    "height": 1080,
    "build": {
      "templateId": "animation-flow-slide",
      "steps": [
        { "label": "Контекст", "x": -44, "centerY": 332, "scale": 1.9 },
        { "label": "Идея и рефы", "x": 570, "centerY": 332, "scale": 1.9 },
        { "label": "Визуализация", "x": 1184, "centerY": 332, "scale": 1.9 },
        { "label": "Итерации", "x": -44, "centerY": 840, "scale": 1.9 },
        { "label": "Передача в разработку", "x": 570, "centerY": 840, "scale": 1.9 },
        { "label": "Демо VIN", "x": 1140, "centerY": 708, "scale": 2.64, "focus": "vin" }
      ]
    }
  },
  {
    "figmaId": "66:83",
    "title": "Контекст",
    "scene": "reverse-engineering-approach",
    "width": 1920,
    "height": 1080,
    "image": "assets/slides/11.png"
  },
  {
    "figmaId": "local:pinned-chats",
    "title": "Закреплённые чаты",
    "width": 1920,
    "height": 1080,
    "image": "assets/slides/13.png",
    "build": { "templateId": "pinned-context-transfer-slide", "steps": [] }
  },
  {
    "figmaId": "5480:844",
    "title": "Что передаём в контексте",
    "exitMotion": "down",
    "width": 1920,
    "height": 1080,
    "build": {
      "templateId": "context-pillars-slide",
      "autoStepInterval": 450,
      "steps": [
        { "label": "Что делаем" },
        { "label": "Сценарий" },
        { "label": "Зачем" },
        { "label": "Для кого" },
        { "label": "Ограничения" }
      ]
    }
  },
  {
    "figmaId": "local:auction-chat",
    "title": "Контекст в чате «Аукцион»",
    "exitMotion": "down",
    "width": 1920,
    "height": 1080,
    "build": { "templateId": "auction-chat-window-slide", "steps": [] }
  },
  {
    "figmaId": "66:91",
    "title": "идеи и рефы",
    "entryDirection": "bottom",
    "width": 1920,
    "height": 1080,
    "image": "assets/slides/15.png"
  },
  {
    "figmaId": "local:blank-page-fear",
    "title": "Страх чистого листа",
    "width": 1920,
    "height": 1080,
    "image": "assets/slides/blank-page-fear.png"
  },
  {
    "figmaId": "5480:874",
    "title": "Идея анимации и поиск референсов",
    "exitMotion": "down",
    "width": 1920,
    "height": 1080,
    "build": {
      "templateId": "idea-pillars-slide",
      "autoStepInterval": 450,
      "steps": [
        { "label": "Главная идея" },
        { "label": "Место и сценарий" },
        { "label": "Визуальная метафора" },
        { "label": "Где искать" }
      ]
    }
  },
  {
    "figmaId": "5480:894",
    "title": "Поиск референсов в чате",
    "width": 1920,
    "height": 1080,
    "image": "assets/reference-search/chat.png"
  },
  {
    "figmaId": "66:780",
    "title": "Не передавайте мышление на аутсорс",
    "width": 1920,
    "height": 1080,
    "build": {
      "templateId": "outsourcing-highlight-slide",
      "steps": []
    }
  },
  {
    "figmaId": "local:look-with-your-eyes",
    "title": "Ищите глазами",
    "width": 1920,
    "height": 1080,
    "build": {
      "templateId": "look-with-your-eyes-slide",
      "steps": []
    }
  },
  {
    "figmaId": "66:123",
    "title": "Каталог 60fps.design",
    "width": 1920,
    "height": 1080,
    "image": "assets/slides/22.png"
  },
  {
    "figmaId": "5480:302",
    "title": "Идеи и рефы",
    "width": 1920,
    "height": 1080,
    "build": ideasReferenceBuild
  },
  {
    "figmaId": "66:182",
    "title": "Где смотреть анимации",
    "width": 1920,
    "height": 1080,
    "build": {
      "templateId": "resource-board-slide",
      "resourceBoard": resourceBoard,
      "overview": { "x": -80 / resourceOverviewScale, "centerY": 582, "scale": resourceOverviewScale },
      "steps": resourceBoard.groups.map(({ label, focus, x, width }) => ({
        label,
        focus,
        x: x + width / 2 - 960 / resourceCloseScale,
        centerY: resourceBoard.panelTop + resourceBoard.panelHeight / 2,
        scale: resourceCloseScale,
      }))
    },
    "resources": [
      {
        "label": "links.mosolov.dev",
        "url": "https://links.mosolov.dev/",
        "x": 1400,
        "y": 64,
        "width": 448,
        "height": 28
      },
      {
        "label": "60fps.design",
        "url": "https://60fps.design/",
        "x": 108,
        "y": 200,
        "width": 372,
        "height": 24
      },
      {
        "label": "Mobbin",
        "url": "https://mobbin.com/discover/apps/ios",
        "x": 564,
        "y": 200,
        "width": 372,
        "height": 24
      },
      {
        "label": "Design Spells",
        "url": "https://www.designspells.com/",
        "x": 1020,
        "y": 200,
        "width": 372,
        "height": 24
      },
      {
        "label": "LottieFiles",
        "url": "https://lottiefiles.com/",
        "x": 1476,
        "y": 200,
        "width": 372,
        "height": 24
      },
      {
        "label": "Rive Marketplace",
        "url": "https://rive.app/marketplace/",
        "x": 108,
        "y": 292,
        "width": 372,
        "height": 24
      },
      {
        "label": "Pinterest",
        "url": "https://www.pinterest.com/",
        "x": 564,
        "y": 292,
        "width": 372,
        "height": 24
      },
      {
        "label": "Dribbble",
        "url": "https://dribbble.com/",
        "x": 1020,
        "y": 292,
        "width": 372,
        "height": 24
      },
      {
        "label": "Behance",
        "url": "https://www.behance.net/",
        "x": 1476,
        "y": 292,
        "width": 372,
        "height": 24
      },
      {
        "label": "10 000refs.me",
        "url": "https://10000refs.me/library",
        "x": 108,
        "y": 384,
        "width": 372,
        "height": 24
      },
      {
        "label": "Showreel.design",
        "url": "https://showreel.design/",
        "x": 564,
        "y": 384,
        "width": 372,
        "height": 24
      },
      {
        "label": "Recent",
        "url": "https://recent.design/",
        "x": 1020,
        "y": 384,
        "width": 372,
        "height": 24
      },
      {
        "label": "Awwwards",
        "url": "https://www.awwwards.com/",
        "x": 1476,
        "y": 384,
        "width": 372,
        "height": 24
      },
      {
        "label": "Footer Design",
        "url": "https://www.footer.design/",
        "x": 108,
        "y": 476,
        "width": 372,
        "height": 24
      },
      {
        "label": "Refero Styles",
        "url": "https://styles.refero.design/",
        "x": 564,
        "y": 476,
        "width": 372,
        "height": 24
      },
      {
        "label": "Locomotive",
        "url": "https://locomotive.ca/en",
        "x": 1020,
        "y": 476,
        "width": 372,
        "height": 24
      },
      {
        "label": "Five into One",
        "url": "https://tech100-five-into-one.vercel.app/",
        "x": 1476,
        "y": 476,
        "width": 372,
        "height": 24
      },
      {
        "label": "Noman · Stickers",
        "url": "https://iamnoman.com/stickers",
        "x": 108,
        "y": 568,
        "width": 372,
        "height": 24
      },
      {
        "label": "Arkon · Wavy Cubes",
        "url": "https://projects.arkon.digital/threejs/wavy-cubes",
        "x": 564,
        "y": 568,
        "width": 372,
        "height": 24
      },
      {
        "label": "Music Player",
        "url": "https://gobzzzmusicplayer2024.vercel.app/",
        "x": 1020,
        "y": 568,
        "width": 372,
        "height": 24
      },
      {
        "label": "Measured",
        "url": "https://www.measured.site/",
        "x": 1476,
        "y": 568,
        "width": 372,
        "height": 24
      },
      {
        "label": "Twitter / X",
        "url": "https://x.com/explore",
        "x": 108,
        "y": 660,
        "width": 372,
        "height": 24
      },
      {
        "label": "Threads",
        "note": "Работы дизайнеров, короткие демо и\u00a0обсуждения UI-анимации.",
        "url": "https://www.threads.com/",
        "x": 564,
        "y": 660,
        "width": 372,
        "height": 24
      },
      {
        "label": "React Bits",
        "url": "https://reactbits.dev/",
        "x": 108,
        "y": 824,
        "width": 372,
        "height": 24
      },
      {
        "label": "Codrops",
        "url": "https://tympanus.net/codrops/hub/all",
        "x": 564,
        "y": 824,
        "width": 372,
        "height": 24
      },
      {
        "label": "GSAP",
        "url": "https://gsap.com/",
        "x": 1020,
        "y": 824,
        "width": 372,
        "height": 24
      },
      {
        "label": "Motion",
        "url": "https://motion.dev/docs",
        "x": 1476,
        "y": 824,
        "width": 372,
        "height": 24
      },
      {
        "label": "transitions.dev",
        "url": "https://transitions.dev/",
        "x": 108,
        "y": 916,
        "width": 372,
        "height": 24
      },
      {
        "label": "Dot Matrix Loaders",
        "url": "https://dotmatrix.zzzzshawn.cloud/",
        "x": 564,
        "y": 916,
        "width": 372,
        "height": 24
      },
      {
        "label": "Jelly UI",
        "url": "https://jelly-ui.com/#jelly-button",
        "x": 1020,
        "y": 916,
        "width": 372,
        "height": 24
      },
      {
        "label": "Framer · Confidential Folder",
        "url": "https://www.framer.com/marketplace/components/confidential-folder",
        "x": 1476,
        "y": 916,
        "width": 372,
        "height": 24
      },
      {
        "label": "Obsidian UI",
        "url": "https://www.obsidianui.dev/components#component-gallery",
        "x": 108,
        "y": 1008,
        "width": 372,
        "height": 24
      },
      {
        "label": "metalforge.xyz",
        "url": "https://metalforge.xyz/",
        "x": 564,
        "y": 1008,
        "width": 372,
        "height": 24
      },
      {
        "label": "kobra.systems",
        "url": "https://kobra.systems/",
        "x": 1020,
        "y": 1008,
        "width": 372,
        "height": 24
      },
      {
        "label": "uiarc.dev",
        "url": "https://uiarc.dev/",
        "x": 1476,
        "y": 1008,
        "width": 372,
        "height": 24
      },
      {
        "label": "kinetics.colorion.co",
        "note": "Пружинные кнопки, карточки и\u00a0переходы для\u00a0интерфейса.",
        "url": "https://kinetics.colorion.co/",
        "x": 108,
        "y": 1100,
        "width": 372,
        "height": 24
      },
      {
        "label": "beui.dev",
        "url": "https://beui.dev/",
        "x": 564,
        "y": 1100,
        "width": 372,
        "height": 24
      },
      {
        "label": "reverseui.com",
        "url": "https://reverseui.com/",
        "x": 1020,
        "y": 1100,
        "width": 372,
        "height": 24
      },
      {
        "label": "DevClub UI",
        "url": "https://ui.devclubxnst.com/",
        "x": 1476,
        "y": 1100,
        "width": 372,
        "height": 24
      },
      {
        "label": "SmoothUI",
        "url": "https://smoothui.dev/",
        "x": 108,
        "y": 1192,
        "width": 372,
        "height": 24
      },
      {
        "label": "vengeanceui.com",
        "url": "https://vengeanceui.com/",
        "x": 564,
        "y": 1192,
        "width": 372,
        "height": 24
      },
      {
        "label": "Aceternity UI",
        "url": "https://ui.aceternity.com/components",
        "x": 1020,
        "y": 1192,
        "width": 372,
        "height": 24
      },
      {
        "label": "Skiper UI",
        "url": "https://skiper-ui.com/",
        "x": 1476,
        "y": 1192,
        "width": 372,
        "height": 24
      },
      {
        "label": "Kokonut UI",
        "url": "https://kokonutui.com/",
        "x": 108,
        "y": 1284,
        "width": 372,
        "height": 24
      },
      {
        "label": "Cult UI",
        "url": "https://www.cult-ui.com/",
        "x": 564,
        "y": 1284,
        "width": 372,
        "height": 24
      },
      {
        "label": "Animata",
        "url": "https://animata.design/",
        "x": 1020,
        "y": 1284,
        "width": 372,
        "height": 24
      },
      {
        "label": "Eldora UI",
        "url": "https://www.eldoraui.site/",
        "x": 1476,
        "y": 1284,
        "width": 372,
        "height": 24
      },
      {
        "label": "Hover.dev",
        "url": "https://www.hover.dev/",
        "x": 108,
        "y": 1376,
        "width": 372,
        "height": 24
      },
      {
        "label": "Magic UI",
        "url": "https://magicui.design/",
        "x": 564,
        "y": 1376,
        "width": 372,
        "height": 24
      },
      {
        "label": "Three.js",
        "url": "https://threejs.org/",
        "x": 1020,
        "y": 1376,
        "width": 372,
        "height": 24
      },
      {
        "label": "Uiverse",
        "url": "https://uiverse.io/",
        "x": 1476,
        "y": 1376,
        "width": 372,
        "height": 24
      },
      {
        "label": "CodePen",
        "url": "https://codepen.io/",
        "x": 108,
        "y": 1468,
        "width": 372,
        "height": 24
      },
      {
        "label": "awesome-opus5-5-videos",
        "url": "https://github.com/yihui-dev/awesome-opus5-5-videos",
        "x": 564,
        "y": 1468,
        "width": 372,
        "height": 24
      },
      {
        "label": "Morphicons",
        "url": "https://www.morphicons.com/",
        "x": 1020,
        "y": 1468,
        "width": 372,
        "height": 24
      },
      {
        "label": "Animos",
        "url": "https://animos.app/editor",
        "x": 108,
        "y": 1632,
        "width": 372,
        "height": 24
      },
      {
        "label": "HyperFrames",
        "url": "https://hyperframes.heygen.com/",
        "x": 564,
        "y": 1632,
        "width": 372,
        "height": 24
      },
      {
        "label": "Spline",
        "url": "https://spline.design/",
        "x": 1020,
        "y": 1632,
        "width": 372,
        "height": 24
      },
      {
        "label": "Mixamo",
        "url": "https://www.mixamo.com/",
        "x": 1476,
        "y": 1632,
        "width": 372,
        "height": 24
      },
      {
        "label": "Powermove",
        "url": "https://trypowermove.com/",
        "x": 108,
        "y": 1724,
        "width": 372,
        "height": 24
      },
      {
        "label": "Motion Canvas",
        "url": "https://motion-canvas.io/",
        "x": 564,
        "y": 1724,
        "width": 372,
        "height": 24
      },
      {
        "label": "Blockbench",
        "url": "https://www.blockbench.net/",
        "x": 1020,
        "y": 1724,
        "width": 372,
        "height": 24
      },
      {
        "label": "Scrolltide",
        "url": "https://scrolltide.co/",
        "x": 1476,
        "y": 1724,
        "width": 372,
        "height": 24
      },
      {
        "label": "Scroll Shaders",
        "url": "https://scrollshaders.com/",
        "x": 108,
        "y": 1816,
        "width": 372,
        "height": 24
      },
      {
        "label": "ShaderGradient",
        "url": "https://shadergradient.co/",
        "x": 564,
        "y": 1816,
        "width": 372,
        "height": 24
      },
      {
        "label": "Book of Shapes",
        "url": "https://bookofshapes.com/",
        "x": 1020,
        "y": 1816,
        "width": 372,
        "height": 24
      },
      {
        "label": "Basement · Shader Lab",
        "url": "https://eng.basement.studio/tools/shader-lab",
        "x": 1476,
        "y": 1816,
        "width": 372,
        "height": 24
      },
      {
        "label": "MotionSites",
        "url": "https://motionsites.ai/",
        "x": 108,
        "y": 1908,
        "width": 372,
        "height": 24
      }
    ]
  },
  {
    "figmaId": "local:telegram-bot",
    "title": "Бот с материалами и ссылками",
    "width": 1920,
    "height": 1080,
    "build": { "templateId": "telegram-qr-slide", "steps": [] }
  },
  {
    "figmaId": "66:93",
    "title": "Визуализация",
    "entryDirection": "bottom",
    "width": 1920,
    "height": 1080,
    "image": "assets/slides/19.png"
  },
  {
    "figmaId": "66:97",
    "title": "Ручной труд сделал из обезьяны человека",
    "width": 1920,
    "height": 1080,
    "image": "assets/slides/20.png"
  },
  {
    "figmaId": "66:95",
    "title": "7605",
    "width": 1920,
    "height": 1080,
    "image": "assets/slides/21.png"
  },
  {
    "figmaId": "5490:913",
    "title": "Подборка референсов для разбора",
    "width": 1920,
    "height": 1080,
    "build": { ...ideasReferenceBuild, steps: [] }
  },
  {
    "figmaId": "local:airbnb-60fps",
    "title": "Airbnb на 60fps",
    "width": 1920,
    "height": 1080,
    "build": {
      "templateId": "airbnb-reference-slide",
      "steps": [{ "label": "Copy link", "focus": "airbnb-copy-link", "scale": 3.2, "x": 322, "centerY": 250 }]
    }
  },
  {
    "figmaId": "66:135",
    "title": "Разбор анимации Airbnb через MCP",
    "width": 1920,
    "height": 1080,
    "build": {
      "templateId": "mcp-breakdown-slide",
      "steps": [
        { "label": "Поворот, перелив и сдвиг", "focus": "mcp-first-three", "x": 20, "centerY": 354, "scale": 1.9 },
        { "label": "Смена текста, параллакс и характер движения", "focus": "mcp-last-three", "x": 20, "centerY": 708, "scale": 1.9 },
        { "label": "Анимация Airbnb", "focus": "mcp-animation", "x": 622, "centerY": 552, "scale": 1.18 }
      ]
    }
  },
  {
    "figmaId": "5490:920",
    "title": "FFmpeg",
    "exitMotion": "down",
    "width": 1920,
    "height": 1080,
    "build": {
      "templateId": "ffmpeg-title-slide",
      "steps": [{ "label": "Установка FFmpeg", "focus": "ffmpeg-install" }]
    }
  },
  {
    "figmaId": "local:airbnb-storyboard",
    "title": "Переворот карточки Airbnb по кадрам",
    "width": 1920,
    "height": 1080,
    "build": {
      "templateId": "airbnb-storyboard-slide",
      "steps": []
    }
  },
  {
    ...vinComparisonSlide,
    "figmaId": "local:ffmpeg-comparison",
    "title": "Характер движения и VIN-пересборка",
    "build": {
      ...vinComparisonSlide.build,
      "comparison": {
        "src": "assets/vin-comparison/ffmpeg-breakdown.mp4",
        "poster": "assets/vin-comparison/ffmpeg-breakdown-poster.jpg",
        "description": "Видео для разбора FFmpeg",
        "label": "Характер движения",
        "fit": "contain"
      }
    }
  },
  {
    ...vinComparisonSlide,
    "figmaId": "local:shimmer-comparison",
    "title": "Перелив и VIN-пересборка",
    "build": {
      ...vinComparisonSlide.build,
      "comparison": {
        "src": "assets/vin-comparison/shimmer-reference.mp4",
        "poster": "assets/vin-comparison/shimmer-reference-poster.jpg",
        "description": "Перелив на стеклянной карточке",
        "label": "Перелив",
        "fit": "cover"
      }
    }
  },
  vinComparisonSlide,
  {
    "figmaId": "5462:133",
    "title": "Плеер VIN-анимации",
    "width": 1920,
    "height": 1080,
    "build": { "templateId": "vin-player-slide", "steps": [] }
  },
  {
    "figmaId": "5462:135",
    "title": "VIN-анимация в Codex",
    "exitMotion": "down-and-fade",
    "width": 1920,
    "height": 1080,
    "build": { "templateId": "codex-window-slide", "steps": [] }
  },
  {
    "figmaId": "66:100",
    "title": "Итерации",
    "entryDirection": "bottom",
    "width": 1920,
    "height": 1080,
    "image": "assets/slides/30.png"
  },
  {
    "figmaId": "66:107",
    "title": "47",
    "width": 1920,
    "height": 1080,
    "build": { "templateId": "iteration-count-slide", "steps": [] }
  },
  {
    "figmaId": "66:102",
    "title": "Примеры итераций",
    "scene": "iteration-prompts",
    "width": 1920,
    "height": 1080,
    "build": {
      "templateId": "iteration-prompt-slide",
      "iterationPrompt": "Сделай карточку, как бы, чтобы она плавнее появлялась при стартовом кадре и чуть помедленнее",
      "typingInterval": 27,
      "steps": []
    }
  },
  {
    "figmaId": "local:iteration-detailed",
    "title": "Примеры итераций · Параметры анимации",
    "scene": "iteration-prompts",
    "width": 1920,
    "height": 1080,
    "build": {
      "templateId": "iteration-prompt-slide",
      "iterationPrompt": "Сделай появление карточки в начале анимации более плавным: используй fade in — opacity от 0 до 1, немного увеличь duration и примени ease-out.\n\nОстальные переходы тоже слегка замедли: увеличь их duration и используй ease-in-out для мягкого начала и завершения движения. Сохрани текущие траектории и последовательность анимации.",
      "typingInterval": 7,
      "steps": []
    }
  },
  {
    "figmaId": "66:121",
    "title": "Словарь движений",
    "exitMotion": "down-and-fade",
    "width": 1920,
    "height": 1080,
    "build": {
      "templateId": "motion-dictionary-slide",
      "steps": []
    }
  },
  {
    "figmaId": "66:115",
    "title": "выводы",
    "entryDirection": "bottom",
    "width": 1920,
    "height": 1080,
    "image": "assets/slides/38.png"
  },
  {
    "figmaId": "66:727",
    "title": "Опирайтесь на чужой опыт и разбирайте его",
    "width": 1920,
    "height": 1080,
    "build": { "templateId": "foundation-examples-slide", "steps": [] }
  },
  {
    "figmaId": "66:733",
    "title": "Объясни себе, что берёшь из рефа",
    "width": 1920,
    "height": 1080,
    "build": { "templateId": "reference-specifics-slide", "steps": [] }
  },
  {
    "figmaId": "66:737",
    "title": "РАЗБЕРИТЕСЬ В ЗАМЫСЛЕ, ПРЕЖДЕ ЧЕМ ПОВТОРЯТЬ ПРИЁМ",
    "width": 1920,
    "height": 1080,
    "build": { "templateId": "thinking-film-slide", "steps": [] }
  },
  {
    "figmaId": "local:claude-artifact",
    "title": "ИИ сейчас может всё",
    "width": 1920,
    "height": 1080,
    "build": { "templateId": "claude-artifact-slide", "steps": [] }
  },
  {
    "figmaId": "local:contacts",
    "title": "Канал и бот в Telegram",
    "width": 1920,
    "height": 1080,
    "build": { "templateId": "contacts-slide", "steps": [] }
  }
];
