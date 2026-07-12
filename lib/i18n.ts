export type Lang = "de" | "ru";

interface SectionCopy {
  eyebrow: string;
  title: string;
}

export interface Dict {
  nav: {
    about: string;
    skills: string;
    projects: string;
    experience: string;
    contact: string;
    playground: string;
  };
  hud: { gear: string; neutral: string };
  hero: {
    role: string;
    lines: [string, string];
    tagline: string;
    cta: string;
    hint: string;
    scroll: string;
  };
  about: SectionCopy & {
    statement: { text: string; accent?: "metal" | "blue" }[];
    body: string;
    statLabels: string[];
  };
  skills: SectionCopy & {
    status: string;
    diagnostics: string;
    unit: string;
    modules: string;
  };
  projects: SectionCopy & {
    descriptions: string[];
    visit: string;
    offer: { lead: string; price: string; cta: string };
  };
  experience: SectionCopy & {
    board: string;
    ready: string;
    processTitle: string;
    process: { step: string; title: string; text: string }[];
    tach: { label: string; hint: string; unit: string };
    specsTitle: string;
    specs: { label: string; value: string }[];
    punchline: string;
  };
  contact: SectionCopy & {
    status: string;
    online: string;
    direct: string;
    fields: {
      name: string;
      namePh: string;
      email: string;
      emailPh: string;
      message: string;
      messagePh: string;
    };
    start: string;
    ignition: string;
    sent: string;
    error: string;
    hint: string;
    subject: string;
  };
  playground: SectionCopy & {
    marquee: [string, string];
    items: { title: string; text: string }[];
    footnote: string;
  };
  footer: { toTop: string };
}

export const DICT = {
  de: {
    nav: {
      about: "Über mich",
      skills: "Skills",
      projects: "Projekte",
      experience: "Zündung",
      contact: "Kontakt",
      playground: "Playground",
    },
    hud: { gear: "Gang", neutral: "Leerlauf" },
    hero: {
      role: "Frontend-Entwickler & UI/UX-Designer",
      lines: ["Präzision", "in Bewegung."],
      tagline:
        "Design und Frontend aus einer Hand: Interfaces, die so präzise laufen wie gute Mechanik.",
      cta: "Projektpreis anfragen",
      hint: "Gang anklicken — oder scrollen zum Schalten",
      scroll: "Runterschalten",
    },
    about: {
      eyebrow: "Erster Gang / Eingelegt",
      title: "Gebaut für Bewegung",
      statement: [
        { text: "Ich gestalte und entwickle Interfaces so, wie große Maschinen gebaut werden — " },
        { text: "jedes Detail trägt Last", accent: "metal" },
        { text: ", jede Bewegung ist " },
        { text: "bewusst gesetzt", accent: "blue" },
        { text: " — nichts Dekoratives, das seinen Platz nicht verdient." },
      ],
      body:
        "Frontend-Entwickler und UI/UX-Designer. Ich bringe Produkte von der leeren Leinwand zu einem Interface, das man nicht vergisst — mit Design-System-Denken, akribischem Motion-Handwerk und Performance-Budgets, die niemals reißen.",
      statLabels: [
        "Tage im Flow",
        "Einsatz",
        "Ausreden",
        "Tools im Stack",
      ],
    },
    skills: {
      eyebrow: "Zweiter Gang / Eingelegt",
      title: "Instrumententafel",
      status: "Alle Systeme nominal",
      diagnostics: "Diagnose / v.2026",
      unit: "U/min ×100",
      modules: "Zusatzmodule — alle aktiv",
    },
    projects: {
      eyebrow: "Dritter Gang / Eingelegt",
      title: "Ausgewählte Arbeiten",
      descriptions: [
        "Website für einen traditionsreichen Landgasthof: Tischreservierung, Veranstaltungen, Saal für 400 Gäste und Kegelbahn — warmes, rustikales Design auf moderner Technik.",
        "Auftritt für einen Elektrotechnik-Betrieb mit über 100 Jahren Geschichte: markante Typografie, klare Leistungsstruktur, auf Anfragen optimiert.",
        "Website für eine Dach- & Bauklempnerei: Vorher-Nachher-Slider, sechs Leistungsbereiche, FAQ und Anfrageformular in klarem Handwerks-Look.",
        "Auftritt für einen Heizungs- & Sanitär-Meisterbetrieb: Vertrauenssignale, Projektgalerie und Terminbuchung — sauber, seriös, konversionsstark.",
      ],
      visit: "Live ansehen",
      offer: {
        lead: "Gefällt Ihnen einer dieser Auftritte? Ich adaptiere Design, Inhalte und Technik komplett auf Ihr Unternehmen —",
        price: "ab 690 €",
        cta: "Projekt anfragen",
      },
    },
    experience: {
      eyebrow: "Vierter Gang / Eingelegt",
      title: "So arbeite ich",
      board: "Bordcomputer",
      ready: "System bereit",
      processTitle: "Projekt-Ablauf",
      process: [
        {
          step: "01",
          title: "Briefing",
          text: "Kostenloses Erstgespräch — Festpreis-Angebot innerhalb von 24 Stunden.",
        },
        {
          step: "02",
          title: "Design",
          text: "Ein maßgeschneiderter Entwurf. Kein Template, keine Baukasten-Optik.",
        },
        {
          step: "03",
          title: "Entwicklung",
          text: "Sauberer Code, schnelle Ladezeiten, optimiert für alle Geräte.",
        },
        {
          step: "04",
          title: "Launch",
          text: "Live-Schaltung, Feinschliff und Übergabe — alles aus einer Hand.",
        },
      ],
      tach: {
        label: "Scroll-Drehzahl",
        hint: "Scrollen Sie schneller — der Motor reagiert",
        unit: "U/min",
      },
      specsTitle: "Eckdaten",
      specs: [
        { label: "Lieferzeit", value: "7–14 Tage" },
        { label: "Erste Antwort", value: "< 24 h" },
        { label: "Korrekturen", value: "Inklusive" },
        { label: "Startpreis", value: "ab 690 €" },
      ],
      punchline: "Vom Briefing zum Launch — in zwei Wochen.",
    },
    contact: {
      eyebrow: "Fünfter Gang / Eingelegt",
      title: "Motor starten",
      status: "Cockpit / Status",
      online: "Online",
      direct: "// Direktleitung",
      fields: {
        name: "Name",
        namePh: "Max Mustermann",
        email: "E-Mail",
        emailPh: "sie@firma.de",
        message: "Ihre Nachricht",
        messagePh: "Erzählen Sie kurz von Ihrem Projekt…",
      },
      start: "Motor starten",
      ignition: "Zündung",
      sent: "Läuft",
      error: "Fehlzündung — bitte erneut versuchen oder direkt schreiben",
      hint: "Drücken zum Zünden — Nachricht geht direkt raus, Antwort innerhalb von 24 h",
      subject: "Projektanfrage",
    },
    playground: {
      eyebrow: "Rückwärtsgang / Eingelegt",
      title: "Spielwiese",
      marquee: ["Rückwärtsgang eingelegt", "Experimentierzone"],
      items: [
        {
          title: "Flüssiges Chrom",
          text: "Shader-artige Verläufe in purem CSS — Blend-Modes, Blur und sehr viel Geduld.",
        },
        {
          title: "Kinetische Typografie",
          text: "Variable-Font-Choreografie, gesteuert von Scroll-Geschwindigkeit und Cursor-Position.",
        },
        {
          title: "Physik-UI",
          text: "Federbasierte Drag-Interaktionen, die sich wie echte gefräste Bauteile anfühlen.",
        },
      ],
      footnote: "F&E — kein Kunde kam zu Schaden",
    },
    footer: {
      toTop: "In den Leerlauf",
    },
  },
  ru: {
    nav: {
      about: "Обо мне",
      skills: "Навыки",
      projects: "Проекты",
      experience: "Зажигание",
      contact: "Контакт",
      playground: "Полигон",
    },
    hud: { gear: "Передача", neutral: "Нейтраль" },
    hero: {
      role: "Frontend-разработчик и UI/UX-дизайнер",
      lines: ["Точность", "в движении."],
      tagline:
        "Дизайн и фронтенд в одних руках: собираю интерфейсы, которые работают чётко, как хорошая механика.",
      cta: "Узнать цену проекта",
      hint: "Кликни передачу — или скролль, чтобы переключить",
      scroll: "Вниз",
    },
    about: {
      eyebrow: "Первая передача / Включена",
      title: "Создан для движения",
      statement: [
        { text: "Я проектирую и собираю интерфейсы так, как строят точные машины — " },
        { text: "каждая деталь несёт нагрузку", accent: "metal" },
        { text: ", каждое движение " },
        { text: "осознанно", accent: "blue" },
        { text: " — и ничто декоративное не остаётся без причины." },
      ],
      body:
        "Frontend-разработчик и UI/UX-дизайнер. Довожу продукты от пустого холста до интерфейса, который запоминают, — через мышление дизайн-системами, дотошный моушн и performance-бюджеты, которые никогда не срываются.",
      statLabels: ["дней в потоке", "отдачи", "оправданий", "инструментов в стеке"],
    },
    skills: {
      eyebrow: "Вторая передача / Включена",
      title: "Приборная панель",
      status: "Все системы в норме",
      diagnostics: "Диагностика / v.2026",
      unit: "об/мин ×100",
      modules: "Доп. модули — все включены",
    },
    projects: {
      eyebrow: "Третья передача / Включена",
      title: "Избранные работы",
      descriptions: [
        "Сайт семейного загородного ресторана: бронирование столов, афиша событий, зал на 400 гостей и кегельбан — тёплый рустикальный дизайн на современной технике.",
        "Сайт электротехнической компании с вековой историей: смелая типографика, чёткая структура услуг, заточен под заявки.",
        "Сайт кровельной мастерской: слайдер «до/после», шесть направлений услуг, FAQ и форма заявки в строгом ремесленном стиле.",
        "Сайт инженерной компании — отопление, сантехника, солнечные панели: сигналы доверия, галерея проектов и онлайн-запись.",
      ],
      visit: "Смотреть вживую",
      offer: {
        lead: "Понравился один из этих сайтов? Полностью адаптирую дизайн, контент и техническую часть под ваш бизнес —",
        price: "от 690 €",
        cta: "Обсудить проект",
      },
    },
    experience: {
      eyebrow: "Четвёртая передача / Включена",
      title: "Как я работаю",
      board: "Бортовой компьютер",
      ready: "Система готова",
      processTitle: "Этапы проекта",
      process: [
        {
          step: "01",
          title: "Бриф",
          text: "Бесплатный первый созвон — фикс-цена в течение 24 часов.",
        },
        {
          step: "02",
          title: "Дизайн",
          text: "Индивидуальный макет. Без шаблонов и конструкторов.",
        },
        {
          step: "03",
          title: "Разработка",
          text: "Чистый код, быстрая загрузка, все устройства.",
        },
        {
          step: "04",
          title: "Запуск",
          text: "Публикация, финальная полировка и передача — всё в одних руках.",
        },
      ],
      tach: {
        label: "Обороты скролла",
        hint: "Скролль быстрее — мотор отзывается",
        unit: "об/мин",
      },
      specsTitle: "Параметры",
      specs: [
        { label: "Срок", value: "7–14 дней" },
        { label: "Первый ответ", value: "до 24 ч" },
        { label: "Правки", value: "Включены" },
        { label: "Старт", value: "от 690 €" },
      ],
      punchline: "От брифа до запуска — за две недели.",
    },
    contact: {
      eyebrow: "Пятая передача / Включена",
      title: "Запуск двигателя",
      status: "Кокпит / статус",
      online: "На связи",
      direct: "// прямая линия",
      fields: {
        name: "Имя",
        namePh: "Иван Иванов",
        email: "Email",
        emailPh: "you@company.com",
        message: "Сообщение",
        messagePh: "Расскажите коротко о вашем проекте…",
      },
      start: "Запуск",
      ignition: "Зажигание",
      sent: "Двигатель работает",
      error: "Осечка — попробуйте ещё раз или напишите напрямую",
      hint: "Нажмите для зажигания — сообщение уйдёт напрямую, ответ в течение 24 ч",
      subject: "Запрос на проект",
    },
    playground: {
      eyebrow: "Задний ход / Включён",
      title: "Полигон",
      marquee: ["Задняя передача включена", "Экспериментальная зона"],
      items: [
        {
          title: "Жидкий хром",
          text: "Шейдерные градиенты на чистом CSS — blend-режимы, blur и очень много терпения.",
        },
        {
          title: "Кинетическая типографика",
          text: "Хореография variable-шрифтов, управляемая скоростью скролла и позицией курсора.",
        },
        {
          title: "Физика в UI",
          text: "Drag-взаимодействия на пружинах, ощущающиеся как настоящие фрезерованные детали.",
        },
      ],
      footnote: "R&D — ни один клиент не пострадал",
    },
    footer: {
      toTop: "В нейтраль",
    },
  },
} satisfies Record<Lang, Dict>;
