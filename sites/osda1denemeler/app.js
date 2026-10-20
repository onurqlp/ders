const app = document.querySelector("#app");
const backBtn = document.querySelector("#backBtn");
const homeBtn = document.querySelector("#homeBtn");

let state = {
  screen: "home",
  examId: null,
  section: "lesen",
  history: [],
  answers: {}
};

const sections = ["lesen", "hoeren", "schreiben", "sprechen"];
const sectionLabels = { lesen: "Lesen", hoeren: "Hören", schreiben: "Schreiben", sprechen: "Sprechen" };

function exam() {
  return window.EXAMS.find((item) => item.id === state.examId);
}

function key(name) {
  return `${state.examId}:${name}`;
}

function setScreen(next, push = true) {
  if (push) state.history.push({ screen: state.screen, examId: state.examId, section: state.section });
  Object.assign(state, next);
  render();
}

function goHome() {
  state = { ...state, screen: "home", examId: null, section: "lesen", history: [] };
  render();
}

function goBack() {
  const prev = state.history.pop();
  if (!prev) return goHome();
  Object.assign(state, prev);
  render();
}

function saveRadio(group, value) {
  state.answers[key(group)] = value;
  updateProgress();
}

function saveText(group, value) {
  state.answers[key(group)] = value;
}

function getAnswer(group) {
  return state.answers[key(group)] || "";
}

function progressTotal(current) {
  return 5 + 6 + 5 + current.schreiben.aufgabe1.fields.length + 1;
}

function progressDone(current) {
  let done = 0;
  current.lesen.aufgabe1.situations.forEach((_, i) => { if (getAnswer(`l1-${i}`)) done++; });
  current.lesen.aufgabe2.questions.forEach((_, i) => { if (getAnswer(`l2-${i}`)) done++; });
  current.lesen.aufgabe3.texts.forEach((_, i) => { if (getAnswer(`l3-${i}`)) done++; });
  current.schreiben.aufgabe1.fields.forEach((_, i) => { if (getAnswer(`s1-${i}`).trim()) done++; });
  if (getAnswer("s2").trim()) done++;
  return done;
}

function updateProgress() {
  const current = exam();
  const bar = document.querySelector(".progress > span");
  const text = document.querySelector("#progressText");
  if (!current || !bar || !text) return;
  const total = progressTotal(current);
  const done = progressDone(current);
  bar.style.width = `${Math.round((done / total) * 100)}%`;
  text.textContent = `${done}/${total}`;
}

function renderShell(inner) {
  const current = exam();
  backBtn.classList.toggle("hidden", state.screen === "home");
  homeBtn.classList.toggle("hidden", state.screen === "home");
  app.innerHTML = inner;
  if (current) updateProgress();
}

function renderHome() {
  renderShell(`
    <section class="hero">
      <div>
        <h2>20 özgün ÖSD A1 tam deneme</h2>
        <p>Lesen, Schreiben ve Sprechen bölümleri günlük hayat konularıyla hazırlanmıştır. Hören bölümü AYDA Hören Eğitim Merkezi'ne yönlendirilir.</p>
      </div>
      <div class="exam-grid">
        ${window.EXAMS.map((item) => `
          <button class="exam-card" type="button" data-exam="${item.id}">
            <strong>${item.title}</strong>
            <span>${item.theme}</span>
            <span>16 otomatik Lesen maddesi + Schreiben + Sprechen</span>
          </button>
        `).join("")}
      </div>
    </section>
  `);
  document.querySelectorAll("[data-exam]").forEach((button) => {
    button.addEventListener("click", () => setScreen({ screen: "exam", examId: Number(button.dataset.exam), section: "lesen" }));
  });
}

function renderExam() {
  const current = exam();
  renderShell(`
    <section>
      <p class="badge">${current.theme}</p>
      <h2 class="screen-title">${current.title}</h2>
      <div class="progress-wrap">
        <div class="progress-meta"><span>İlerleme</span><span id="progressText">0/0</span></div>
        <div class="progress"><span></span></div>
      </div>
      <nav class="tabs">
        ${sections.map((section) => `<button class="tab ${state.section === section ? "active" : ""}" data-section="${section}" type="button">${sectionLabels[section]}</button>`).join("")}
      </nav>
      <div class="section-stack">${renderSection(current)}</div>
      <div class="actions">
        <button class="secondary-btn" type="button" id="answerBtn">Cevap Anahtarı</button>
        <button class="primary-btn" type="button" id="resultBtn">Sonuç</button>
      </div>
    </section>
  `);
  bindSectionEvents(current);
  document.querySelectorAll("[data-section]").forEach((button) => {
    button.addEventListener("click", () => { state.section = button.dataset.section; render(); });
  });
  document.querySelector("#answerBtn").addEventListener("click", () => setScreen({ screen: "answers" }));
  document.querySelector("#resultBtn").addEventListener("click", () => setScreen({ screen: "result" }));
}

function renderSection(current) {
  if (state.section === "lesen") return renderLesen(current);
  if (state.section === "hoeren") return renderHoeren();
  if (state.section === "schreiben") return renderSchreiben(current);
  return renderSprechen(current);
}

function renderLesen(current) {
  const l = current.lesen;
  return `
    <article class="panel">
      <p class="small-title">Lesen Aufgabe 1</p>
      <h3>5 durum ve 6 ilanı eşleştirin.</h3>
      <div class="split">
        <div class="task-list">${l.aufgabe1.situations.map((text, i) => `<div class="mini-box"><b>${i + 1}</b>${text}${choices(`l1-${i}`, 6)}</div>`).join("")}</div>
        <div class="ad-list">${l.aufgabe1.ads.map((ad, i) => `<div class="mini-box"><b>${letter(i)}. ${ad.title}</b>${ad.text}</div>`).join("")}</div>
      </div>
    </article>
    <article class="panel">
      <p class="small-title">Lesen Aufgabe 2</p>
      <h3>İlanlara göre JA veya NEIN seçin.</h3>
      <div class="ad-list">${l.aufgabe2.ads.map((ad, i) => `<div class="mini-box"><b>Anzeige ${i + 1}: ${ad.title}</b>${ad.text}</div>`).join("")}</div>
      <div class="task-list">${l.aufgabe2.questions.map((q, i) => `<div class="mini-box"><b>${i + 1}. ${q.text}</b>${yesNo(`l2-${i}`)}</div>`).join("")}</div>
    </article>
    <article class="panel">
      <p class="small-title">Lesen Aufgabe 3</p>
      <h3>5 kısa metni 6 resim açıklamasıyla eşleştirin.</h3>
      <div class="split">
        <div class="task-list">${l.aufgabe3.texts.map((text, i) => `<div class="mini-box"><b>${i + 1}</b>${text}${choices(`l3-${i}`, 6)}</div>`).join("")}</div>
        <div class="image-grid">${l.aufgabe3.images.map((img, i) => visualCard(letter(i), img)).join("")}</div>
      </div>
    </article>
  `;
}

function choices(group, count) {
  return `<div class="choice-row">${Array.from({ length: count }, (_, i) => radio(group, letter(i), letter(i))).join("")}</div>`;
}

function yesNo(group) {
  return `<div class="choice-row">${radio(group, "JA", "JA")}${radio(group, "NEIN", "NEIN")}</div>`;
}

function radio(group, value, label) {
  const checked = getAnswer(group) === value ? "checked" : "";
  return `<label class="choice"><input type="radio" name="${group}" value="${value}" ${checked}><span>${label}</span></label>`;
}

function visualCard(label, text) {
  return `
    <div class="visual-card">
      <div class="visual-scene" aria-label="${escapeHtml(text)}">
        <span class="sun"></span>
        <span class="person one"></span>
        <span class="person two"></span>
        <span class="table-shape"></span>
      </div>
      <b>${label}</b>
      <span>${text}</span>
    </div>
  `;
}

function renderHoeren() {
  return `
    <article class="notice-card">
      <p class="small-title">Hören</p>
      <h3>Hören bölümü için AYDA Hören Eğitim Merkezi'ni kullanın.</h3>
      <p class="lead">Bu merkezde Hören sorusu üretilmez; dinleme çalışmaları için playlist butonunu kullanın.</p>
      <p><a class="yt-btn" href="${window.YOUTUBE_PLAYLIST}" target="_blank" rel="noreferrer">YouTube Playlist'i Aç</a></p>
    </article>
  `;
}

function renderSchreiben(current) {
  const s = current.schreiben;
  return `
    <article class="panel">
      <p class="small-title">Schreiben Aufgabe 1</p>
      <h3>Form doldurma</h3>
      <p class="lead">${s.aufgabe1.prompt}</p>
      <div class="form-grid">
        ${s.aufgabe1.fields.map((field, i) => `<label>${field}<input data-text="s1-${i}" value="${escapeHtml(getAnswer(`s1-${i}`))}" autocomplete="off"></label>`).join("")}
      </div>
    </article>
    <article class="panel">
      <p class="small-title">Schreiben Aufgabe 2</p>
      <h3>E-Mail yazma</h3>
      <p class="lead">${s.aufgabe2.prompt}</p>
      <div class="mini-box">${s.aufgabe2.bullets.map((b) => `- ${b}`).join("<br>")}</div>
      <textarea data-text="s2" placeholder="Yaklaşık 30 kelime yazın...">${escapeHtml(getAnswer("s2"))}</textarea>
    </article>
  `;
}

function renderSprechen(current) {
  return `
    <article class="panel">
      <p class="small-title">Sprechen Teil 1</p>
      <h3>Kendinizi tanıtın.</h3>
      <div class="mini-box">${current.sprechen.teil1.map((x) => `- ${x}`).join("<br>")}</div>
    </article>
    <article class="panel">
      <p class="small-title">Sprechen Teil 2</p>
      <h3>Resmi açıklayın.</h3>
      ${visualCard("Sprechen", current.sprechen.teil2)}
    </article>
    <article class="panel">
      <p class="small-title">Sprechen Teil 3</p>
      <h3>Rollenspiel yapın.</h3>
      <div class="mini-box">${current.sprechen.teil3}</div>
    </article>
  `;
}

function bindSectionEvents() {
  document.querySelectorAll("input[type='radio']").forEach((input) => {
    input.addEventListener("change", () => saveRadio(input.name, input.value));
  });
  document.querySelectorAll("[data-text]").forEach((input) => {
    input.addEventListener("input", () => saveText(input.dataset.text, input.value));
  });
}

function score(current) {
  let right = 0;
  current.lesen.aufgabe1.answers.forEach((answer, i) => { if (getAnswer(`l1-${i}`) === answer) right++; });
  current.lesen.aufgabe2.questions.forEach((q, i) => { if (getAnswer(`l2-${i}`) === q.answer) right++; });
  current.lesen.aufgabe3.answers.forEach((answer, i) => { if (getAnswer(`l3-${i}`) === answer) right++; });
  const lesenPoints = Math.round((right / 16) * 40);
  const schreibenFilled = current.schreiben.aufgabe1.fields.filter((_, i) => getAnswer(`s1-${i}`).trim()).length;
  const mailWords = getAnswer("s2").trim().split(/\s+/).filter(Boolean).length;
  const schreibenPoints = Math.min(30, schreibenFilled * 3 + Math.min(12, Math.round(mailWords / 3)));
  const sprechenPoints = 30;
  const total = lesenPoints + schreibenPoints + sprechenPoints;
  return { right, lesenPoints, schreibenPoints, sprechenPoints, total };
}

function renderAnswers() {
  const current = exam();
  renderShell(`
    <section class="result-card">
      <h2 class="screen-title">${current.title} Cevap Anahtarı</h2>
      <div class="answer-key">
        <div><b>Lesen Aufgabe 1:</b> ${current.lesen.aufgabe1.answers.map((a, i) => `${i + 1}-${a}`).join(", ")}</div>
        <div><b>Lesen Aufgabe 2:</b> ${current.lesen.aufgabe2.questions.map((q, i) => `${i + 1}-${q.answer}`).join(", ")}</div>
        <div><b>Lesen Aufgabe 3:</b> ${current.lesen.aufgabe3.answers.map((a, i) => `${i + 1}-${a}`).join(", ")}</div>
        <div><b>Schreiben:</b> Form alanları eksiksiz, e-mail yaklaşık 30 kelime ve 3 maddeyi karşılamalıdır.</div>
        <div><b>Sprechen:</b> Tanıtma, resim açıklama ve rollenspiel akıcı şekilde yapılmalıdır.</div>
      </div>
      <p><button class="primary-btn" id="backExam" type="button">Denemeye Dön</button></p>
    </section>
  `);
  document.querySelector("#backExam").addEventListener("click", goBack);
}

function renderResult() {
  const current = exam();
  const s = score(current);
  const passed = s.total >= 60;
  renderShell(`
    <section class="result-card">
      <h2 class="screen-title">Sonuç Ekranı</h2>
      <p class="lead">${current.title} için tahmini puanınız hesaplandı.</p>
      <div class="answer-key">
        <div><b>Lesen doğru:</b> ${s.right}/16</div>
        <div><b>Lesen puanı:</b> ${s.lesenPoints}/40</div>
        <div><b>Schreiben tahmini:</b> ${s.schreibenPoints}/30</div>
        <div><b>Sprechen çalışma puanı:</b> ${s.sprechenPoints}/30</div>
        <div><b>Toplam:</b> <span class="${passed ? "correct" : "wrong"}">${s.total}/100 - ${passed ? "Başarılı" : "Tekrar çalışın"}</span></div>
      </div>
      <p class="lead">Not: Schreiben ve Sprechen bölümlerinde otomatik puan yaklaşık değerlendirmedir; öğretmen kontrolü önerilir.</p>
      <p><button class="primary-btn" id="backExam" type="button">Denemeye Dön</button></p>
    </section>
  `);
  document.querySelector("#backExam").addEventListener("click", goBack);
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
}

function render() {
  if (state.screen === "home") return renderHome();
  if (state.screen === "answers") return renderAnswers();
  if (state.screen === "result") return renderResult();
  return renderExam();
}

backBtn.addEventListener("click", goBack);
homeBtn.addEventListener("click", goHome);
render();
