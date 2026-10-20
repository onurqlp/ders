const WORDS = window.AYDA_WORDS || [];
const TIPS = window.AYDA_TIPS || {};
const LINKS = window.AYDA_EXTERNAL_LINKS || {};
const STORAGE_KEY = "aydaA2KelimeAntrenmani";
const SET_SIZE = 10;

const home = document.getElementById("home");
const study = document.getElementById("study");
const exerciseArea = document.getElementById("exercise-area");
const studyTitle = document.getElementById("study-title");
const studyKicker = document.getElementById("study-kicker");
const examTip = document.getElementById("exam-tip");
const progressText = document.getElementById("progress-text");
const progressBar = document.getElementById("progress-bar");
const shuffleButton = document.getElementById("shuffle-button");
const homeButton = document.getElementById("home-button");
const closeStudyButton = document.getElementById("close-study");

const moduleConfig = {
  cards: {
    title: "Kelime Kartları",
    kicker: "Kelime öğrenme",
    shuffle: "Yeni 10 Kelime Çalış",
    type: "cards"
  },
  meaning: {
    title: "Anlamını Seç",
    kicker: "Kelime testi",
    shuffle: "Yeni Karışık Set Başlat",
    type: "meaning"
  },
  blank: {
    title: "Cümlede Boşluk Doldur",
    kicker: "Cümle içinde kelime",
    shuffle: "Soruları Karıştır",
    type: "blank"
  },
  reverse: {
    title: "Türkçeden Almancaya",
    kicker: "Anlamdan kelimeye",
    shuffle: "Yeni Karışık Set Başlat",
    type: "reverse"
  },
  formWords: {
    title: "Form Kelimeleri",
    kicker: "Form ve resmi alanlar",
    shuffle: "Yeni Form Kelime Seti",
    type: "formWords"
  },
  category: {
    title: "Konuya Göre Kelimeler",
    kicker: "Kategori çalışması",
    shuffle: "Kategorileri Göster",
    type: "category"
  },
  mixed: {
    title: "Karışık 10 Kelime",
    kicker: "Hızlı tekrar",
    shuffle: "Yeni Karışık Set Başlat",
    type: "mixed"
  },
  review: {
    title: "Yanlışlarımı Tekrar Et",
    kicker: "Tekrar listesi",
    shuffle: "Yanlışlardan Yeni Set",
    type: "review"
  }
};

let progress = loadProgress();
let session = null;

document.querySelectorAll("[data-module]").forEach((button) => {
  button.addEventListener("click", () => openModule(button.dataset.module));
});

homeButton.addEventListener("click", returnHome);
closeStudyButton.addEventListener("click", returnHome);
shuffleButton.addEventListener("click", () => {
  if (!session) return;
  if (session.module === "category" && !session.category) {
    renderCategoryPicker();
    return;
  }
  startModuleSet(session.module, session.category);
});

setExternalLinks();
updateProgressStrip();

function setExternalLinks() {
  const map = {
    "reading-link": LINKS.reading,
    "writing-link": LINKS.writing,
    "speaking-link": LINKS.speaking,
    "exam-link": LINKS.exam
  };

  Object.entries(map).forEach(([id, href]) => {
    const link = document.getElementById(id);
    if (link) link.href = href || "#";
  });
}

function openModule(moduleName) {
  const config = moduleConfig[moduleName];
  if (!config) return;

  session = createSession(moduleName);
  studyTitle.textContent = config.title;
  studyKicker.textContent = config.kicker;
  examTip.textContent = TIPS[moduleName] || TIPS.mixed || "";
  shuffleButton.textContent = config.shuffle;

  home.hidden = true;
  study.hidden = false;
  window.scrollTo(0, 0);

  if (moduleName === "category") {
    renderCategoryPicker();
    return;
  }

  startModuleSet(moduleName);
}

function createSession(moduleName) {
  return {
    module: moduleName,
    category: null,
    words: [],
    questions: [],
    index: 0,
    revealed: false,
    answered: false,
    score: {
      correct: 0,
      wrong: 0,
      wrongWords: []
    }
  };
}

function startModuleSet(moduleName, category = null) {
  const config = moduleConfig[moduleName];
  if (!config) return;

  session = createSession(moduleName);
  session.category = category;
  studyTitle.textContent = category ? `${config.title}: ${category}` : config.title;
  studyKicker.textContent = config.kicker;
  examTip.textContent = TIPS[moduleName] || "";
  shuffleButton.textContent = moduleName === "cards" ? "Yeni 10 Kelime Çalış" : config.shuffle;
  if (moduleName === "category" && category) {
    shuffleButton.textContent = "Bu Konudan Yeni 10 Kelime";
  }

  if (moduleName === "cards") {
    session.words = sampleWords(WORDS, SET_SIZE);
    session.index = 0;
    renderWordCard();
    return;
  }

  if (moduleName === "review") {
    const wrongIds = Object.keys(progress.wrongWords || {});
    const reviewWords = wrongIds
      .map((id) => WORDS.find((word) => word.id === id))
      .filter(Boolean);

    if (!reviewWords.length) {
      renderEmptyReview();
      return;
    }

    session.words = sampleWords(reviewWords, SET_SIZE);
    session.questions = buildQuestionSet("mixed", session.words, true);
    renderQuestion();
    return;
  }

  if (moduleName === "category" && category) {
    const categoryWords = WORDS.filter((word) => word.theme === category);
    session.words = sampleWords(categoryWords, SET_SIZE);
    session.questions = buildQuestionSet("category", session.words);
    renderQuestion();
    return;
  }

  if (moduleName === "formWords") {
    const formWords = getFormWords();
    session.words = sampleWords(formWords, SET_SIZE);
    session.questions = buildQuestionSet("formWords", session.words);
    renderQuestion();
    return;
  }

  if (moduleName === "mixed") {
    session.words = sampleWords(WORDS, SET_SIZE);
    session.questions = buildQuestionSet("mixed", session.words);
    renderQuestion();
    return;
  }

  const pool = moduleName === "blank" ? getClozeWords() : WORDS;
  session.words = sampleWords(pool, SET_SIZE);
  session.questions = buildQuestionSet(moduleName, session.words);
  renderQuestion();
}

function renderCategoryPicker() {
  const categories = [...new Set(WORDS.map((word) => word.theme))].sort((a, b) => a.localeCompare(b, "tr"));
  session.category = null;
  studyTitle.textContent = moduleConfig.category.title;
  progressText.textContent = "Kategori seç";
  progressBar.style.width = "0%";
  shuffleButton.textContent = "Kategorileri Göster";

  exerciseArea.innerHTML = `
    <div class="question-card">
      <span class="question-type">Kategori seçimi</span>
      <p class="question-text">Hangi konuda 10 kelime çalışmak istersin?</p>
      <div class="topic-grid">
        ${categories.map((category) => `<button type="button" class="topic-button" data-category="${escapeHtml(category)}">${escapeHtml(category)}</button>`).join("")}
      </div>
    </div>
  `;

  exerciseArea.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => startModuleSet("category", button.dataset.category));
  });
}

function renderWordCard() {
  const word = session.words[session.index];
  if (!word) {
    renderResults();
    return;
  }

  session.revealed = false;
  session.answered = false;
  updateStudyProgress();

  exerciseArea.innerHTML = `
    <div class="word-card">
      <div class="word-main">
        <span>${escapeHtml(word.theme)} · ${escapeHtml(word.type)}</span>
        <strong>${escapeHtml(formatWord(word))}</strong>
      </div>

      <div id="word-details" class="word-details" aria-live="polite">
        <div class="meta-grid">
          <div><span>Türkçe anlam</span><strong>${escapeHtml(word.meaning)}</strong></div>
          <div><span>Çoğul</span><strong>${escapeHtml(word.plural || "Yok / gerekmez")}</strong></div>
          <div><span>Sınav bağlantısı</span><strong>${escapeHtml(word.use)}</strong></div>
          <div><span>Zorluk</span><strong>${escapeHtml(word.level)}</strong></div>
        </div>
        <div class="reading-text">
          <strong>${escapeHtml(word.example)}</strong><br>
          ${escapeHtml(word.exampleTr)}
        </div>
      </div>

      <div class="next-row">
        <button id="reveal-card" type="button" class="primary-button">Cevabı Göster</button>
        <button id="known-card" type="button" class="secondary-button">Biliyorum</button>
        <button id="repeat-card" type="button" class="secondary-button">Tekrar Sor</button>
        <button id="next-card" type="button" class="secondary-button">Sonraki Kelime</button>
        <button id="new-cards" type="button" class="primary-button">Yeni 10 Kelime Çalış</button>
      </div>
    </div>
  `;

  document.getElementById("reveal-card").addEventListener("click", () => {
    document.getElementById("word-details").classList.add("show");
  });

  document.getElementById("known-card").addEventListener("click", () => {
    recordCardAnswer(word, true);
    goNext();
  });

  document.getElementById("repeat-card").addEventListener("click", () => {
    recordCardAnswer(word, false);
    goNext();
  });

  document.getElementById("next-card").addEventListener("click", goNext);
  document.getElementById("new-cards").addEventListener("click", () => startModuleSet("cards"));
}

function renderQuestion() {
  const question = session.questions[session.index];
  if (!question) {
    renderResults();
    return;
  }

  session.answered = false;
  updateStudyProgress();

  const context = question.context
    ? `<div class="reading-text">${question.context}</div>`
    : "";

  exerciseArea.innerHTML = `
    <div class="question-card">
      <span class="question-type">${escapeHtml(question.badge)}</span>
      ${context}
      <p class="question-text">${escapeHtml(question.prompt)}</p>
      <div class="answers">
        ${question.options.map((option, index) => `
          <button type="button" class="answer-button" data-option="${index}">
            ${escapeHtml(option.label)}
          </button>
        `).join("")}
      </div>
      <div id="feedback" class="feedback"></div>
      <div class="next-row">
        <button id="next-question" type="button" class="primary-button" hidden>Sonraki Soru</button>
      </div>
    </div>
  `;

  exerciseArea.querySelectorAll("[data-option]").forEach((button) => {
    button.addEventListener("click", () => answerQuestion(Number(button.dataset.option)));
  });

  document.getElementById("next-question").addEventListener("click", goNext);
}

function answerQuestion(optionIndex) {
  if (session.answered) return;
  session.answered = true;

  const question = session.questions[session.index];
  const selected = question.options[optionIndex];
  const isCorrect = selected.correct;
  const buttons = [...exerciseArea.querySelectorAll(".answer-button")];

  buttons.forEach((button, index) => {
    const option = question.options[index];
    button.disabled = true;
    if (option.correct) button.classList.add("correct");
    if (index === optionIndex && !option.correct) button.classList.add("wrong");
  });

  if (isCorrect) {
    session.score.correct += 1;
    recordProgress(true, question.word, session.module);
  } else {
    session.score.wrong += 1;
    session.score.wrongWords.push(question.word);
    recordProgress(false, question.word, session.module);
  }

  const feedback = document.getElementById("feedback");
  feedback.className = `feedback show ${isCorrect ? "ok" : "bad"}`;
  feedback.innerHTML = isCorrect
    ? `<strong>Doğru.</strong> ${escapeHtml(question.success)}`
    : `<strong>Yanlış.</strong> Doğru cevap: <strong>${escapeHtml(question.correctLabel)}</strong><br>${escapeHtml(question.explanation)}`;

  const next = document.getElementById("next-question");
  next.hidden = false;
  next.textContent = session.index === session.questions.length - 1 ? "Sonuçları Göster" : "Sonraki Soru";
  updateProgressStrip();
}

function recordCardAnswer(word, known) {
  if (session.answered) return;
  session.answered = true;

  if (known) {
    session.score.correct += 1;
    progress.knownWords[word.id] = true;
    delete progress.repeatWords[word.id];
    recordProgress(true, word, session.module);
  } else {
    session.score.wrong += 1;
    session.score.wrongWords.push(word);
    progress.repeatWords[word.id] = true;
    recordProgress(false, word, session.module);
  }

  updateProgressStrip();
}

function goNext() {
  session.index += 1;

  if (session.module === "cards") {
    renderWordCard();
    return;
  }

  renderQuestion();
}

function renderResults() {
  const total = session.score.correct + session.score.wrong;
  const percent = total ? Math.round((session.score.correct / total) * 100) : 0;
  const wrongWords = uniqueById(session.score.wrongWords);
  progressText.textContent = "Set tamamlandı";
  progressBar.style.width = "100%";

  const message = percent >= 80
    ? "Çok iyi. Bu set güçlü geçti."
    : percent >= 50
      ? "İyi gidiyorsun. Yanlış kelimeleri kısa bir tekrar güçlendirir."
      : "Sorun değil. Bu kelimeler tekrar listene eklendi.";

  exerciseArea.innerHTML = `
    <div class="result-card">
      <h3>Set Bitti</h3>
      <p>${escapeHtml(message)}</p>
      <div class="score-grid">
        <div><span>Doğru</span><strong>${session.score.correct}</strong></div>
        <div><span>Yanlış</span><strong>${session.score.wrong}</strong></div>
        <div><span>Başarı</span><strong>%${percent}</strong></div>
      </div>
      ${wrongWords.length ? `
        <div>
          <strong>Tekrar edilecek kelimeler</strong>
          <ul class="wrong-list">
            ${wrongWords.map((word) => `<li>${escapeHtml(formatWord(word))} — ${escapeHtml(word.meaning)}</li>`).join("")}
          </ul>
        </div>
      ` : `<div class="answer-note">Bu sette yanlış kelime yok.</div>`}
      <div class="next-row">
        <button id="result-new" type="button" class="primary-button">Yeni Karışık Set Başlat</button>
        <button id="result-review" type="button" class="secondary-button">Yanlışlarımı Tekrar Et</button>
        <button id="result-home" type="button" class="secondary-button">Ana Sayfaya Dön</button>
      </div>
    </div>
  `;

  document.getElementById("result-new").addEventListener("click", () => {
    if (session.module === "category" && session.category) {
      startModuleSet("category", session.category);
    } else {
      startModuleSet(session.module);
    }
  });
  document.getElementById("result-review").addEventListener("click", () => openModule("review"));
  document.getElementById("result-home").addEventListener("click", returnHome);
}

function renderEmptyReview() {
  progressText.textContent = "Tekrar listesi boş";
  progressBar.style.width = "0%";
  exerciseArea.innerHTML = `
    <div class="empty-state">
      Henüz yanlış kelimen yok. Önce bir alıştırma çözebilir, sonra yanlışlarını burada tekrar edebilirsin.
      <div class="next-row">
        <button id="empty-mixed" type="button" class="primary-button">Karışık 10 Kelime Çalış</button>
        <button id="empty-home" type="button" class="secondary-button">Ana Sayfaya Dön</button>
      </div>
    </div>
  `;
  document.getElementById("empty-mixed").addEventListener("click", () => openModule("mixed"));
  document.getElementById("empty-home").addEventListener("click", returnHome);
}

function returnHome() {
  study.hidden = true;
  home.hidden = false;
  session = null;
  updateProgressStrip();
  window.scrollTo(0, 0);
}

function buildQuestionSet(mode, words, reviewMode = false) {
  return words.map((word, index) => {
    if (mode === "meaning") return makeMeaningQuestion(word);
    if (mode === "blank") return canCloze(word) ? makeBlankQuestion(word) : makeMeaningQuestion(word);
    if (mode === "reverse") return makeReverseQuestion(word);
    if (mode === "formWords") return makeFormQuestion(word);
    if (mode === "category") {
      const types = ["meaning", "reverse", "blank"];
      return makeQuestionByType(types[index % types.length], word);
    }
    if (mode === "mixed") {
      const types = reviewMode
        ? ["meaning", "reverse", "blank"]
        : ["meaning", "blank", "reverse", "formWords"];
      return makeQuestionByType(types[index % types.length], word);
    }
    return makeMeaningQuestion(word);
  });
}

function makeQuestionByType(type, word) {
  if (type === "blank" && canCloze(word)) return makeBlankQuestion(word);
  if (type === "reverse") return makeReverseQuestion(word);
  if (type === "formWords") {
    const formPool = getFormWords();
    const formWord = formPool.find((item) => item.id === word.id) || sampleWords(formPool, 1)[0] || word;
    return makeFormQuestion(formWord);
  }
  return makeMeaningQuestion(word);
}

function makeMeaningQuestion(word) {
  const options = makeOptions(word, WORDS, (item) => item.meaning);
  return {
    badge: "Anlamını seç",
    prompt: `${formatWord(word)} ne demek?`,
    context: `${word.example}<br>${word.exampleTr}`,
    word,
    options,
    correctLabel: word.meaning,
    success: `${formatWord(word)} = ${word.meaning}`,
    explanation: `${formatWord(word)} kelimesinin anlamı: ${word.meaning}.`
  };
}

function makeReverseQuestion(word) {
  const options = makeOptions(word, WORDS, formatWord);
  return {
    badge: "Türkçeden Almancaya",
    prompt: `"${word.meaning}" Almanca hangisi?`,
    context: word.use ? `Sınav bağlantısı: ${word.use}` : "",
    word,
    options,
    correctLabel: formatWord(word),
    success: `${word.meaning} = ${formatWord(word)}`,
    explanation: `"${word.meaning}" için doğru kelime ${formatWord(word)}.`
  };
}

function makeBlankQuestion(word) {
  const cloze = makeCloze(word);
  const options = makeOptions(word, getClozeWords(), (item) => item.word);
  return {
    badge: "Cümlede boşluk",
    prompt: cloze,
    context: "Boş bırakılan yere doğru Almanca kelimeyi seç.",
    word,
    options,
    correctLabel: word.word,
    success: word.exampleTr,
    explanation: `Doğru cümle: ${word.example}`
  };
}

function makeFormQuestion(word) {
  const options = makeOptions(word, getFormWords(), (item) => item.meaning);
  const prompts = [
    `Formda "${word.word}" ne demek?`,
    `"${word.word}" alanında hangi bilgi istenir?`,
    `Bu form kelimesinin Türkçe anlamı nedir: ${formatWord(word)}`
  ];
  return {
    badge: "Form kelimesi",
    prompt: prompts[Math.floor(Math.random() * prompts.length)],
    context: `Örnek: ${word.example}`,
    word,
    options,
    correctLabel: word.meaning,
    success: `Formlarda ${word.word} için "${word.meaning}" bilgisi gerekir.`,
    explanation: `${formatWord(word)} = ${word.meaning}.`
  };
}

function makeOptions(correctWord, pool, labeler) {
  const correctLabel = labeler(correctWord);
  const usedLabels = new Set([correctLabel]);
  const options = [{ label: correctLabel, correct: true }];
  const candidates = shuffle(pool.filter((word) => word.id !== correctWord.id));

  for (const candidate of candidates) {
    const label = labeler(candidate);
    if (!label || usedLabels.has(label)) continue;
    usedLabels.add(label);
    options.push({ label, correct: false });
    if (options.length === 4) break;
  }

  return shuffle(options);
}

function formatWord(word) {
  return word.article ? `${word.article} ${word.word}` : word.word;
}

function getFormWords() {
  return WORDS.filter((word) =>
    word.theme === "Form Kelimeleri" ||
    word.theme === "Kişisel Bilgiler" ||
    word.use.includes("Form")
  );
}

function getClozeWords() {
  return WORDS.filter(canCloze);
}

function canCloze(word) {
  return getWordRegex(word).test(word.example);
}

function makeCloze(word) {
  return word.example.replace(getWordRegex(word), "$1____");
}

function getWordRegex(word) {
  const escaped = word.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^A-Za-zÄÖÜäöüß-])${escaped}(?=[^A-Za-zÄÖÜäöüß-]|$)`, "i");
}

function sampleWords(pool, count) {
  return shuffle(pool).slice(0, Math.min(count, pool.length));
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function uniqueById(words) {
  const seen = new Set();
  return words.filter((word) => {
    if (!word || seen.has(word.id)) return false;
    seen.add(word.id);
    return true;
  });
}

function updateStudyProgress() {
  const total = session.module === "cards" ? session.words.length : session.questions.length;
  const current = Math.min(session.index + 1, total);
  progressText.textContent = `${current} / ${total}`;
  progressBar.style.width = total ? `${Math.round((current / total) * 100)}%` : "0%";
}

function recordProgress(isCorrect, word, moduleName) {
  resetTodayIfNeeded();
  progress.total += 1;
  progress.todayCount += 1;
  progress.lastStudyDate = todayKey();

  if (isCorrect) {
    progress.correct += 1;
    if (progress.wrongWords[word.id]) {
      progress.wrongWords[word.id].success = (progress.wrongWords[word.id].success || 0) + 1;
      if (moduleName === "review" || progress.wrongWords[word.id].success >= 2) {
        delete progress.wrongWords[word.id];
      }
    }
  } else {
    progress.wrong += 1;
    progress.wrongWords[word.id] = {
      id: word.id,
      count: (progress.wrongWords[word.id]?.count || 0) + 1,
      success: 0,
      lastWrongAt: new Date().toISOString()
    };
  }

  progress.moduleStats[moduleName] = progress.moduleStats[moduleName] || { total: 0, correct: 0, wrong: 0 };
  progress.moduleStats[moduleName].total += 1;
  progress.moduleStats[moduleName][isCorrect ? "correct" : "wrong"] += 1;

  saveProgress();
}

function loadProgress() {
  const fallback = {
    total: 0,
    correct: 0,
    wrong: 0,
    todayDate: todayKey(),
    todayCount: 0,
    lastStudyDate: "",
    wrongWords: {},
    knownWords: {},
    repeatWords: {},
    moduleStats: {}
  };

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!saved) return fallback;
    const merged = { ...fallback, ...saved };
    if (merged.todayDate !== todayKey()) {
      merged.todayDate = todayKey();
      merged.todayCount = 0;
    }
    return merged;
  } catch {
    return fallback;
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function resetTodayIfNeeded() {
  if (progress.todayDate !== todayKey()) {
    progress.todayDate = todayKey();
    progress.todayCount = 0;
  }
}

function todayKey() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function updateProgressStrip() {
  resetTodayIfNeeded();
  document.getElementById("today-count").textContent = progress.todayCount;
  document.getElementById("correct-count").textContent = progress.correct;
  document.getElementById("wrong-count").textContent = progress.wrong;

  const motivation = document.getElementById("motivation");
  if (progress.todayCount === 0) {
    motivation.textContent = "Bugün kısa bir kelime seti bile iyi bir başlangıç.";
  } else if (progress.todayCount < 10) {
    motivation.textContent = "Güzel başlangıç. Bir seti tamamlamak yeterli.";
  } else if (progress.wrong > 0) {
    motivation.textContent = "İyi gidiyorsun. Yanlış kelimeler tekrar listende hazır.";
  } else {
    motivation.textContent = "Harika. Bugünkü tekrarın temiz ilerliyor.";
  }
  saveProgress();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
