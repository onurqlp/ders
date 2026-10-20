const introTopics = [
  {
    title: "Name",
    question: "Wie heißen Sie?",
    answer: "Ich heiße Maria Schmidt. Mein Vorname ist Maria und mein Familienname ist Schmidt. Meine Freunde nennen mich Maria.",
    patterns: ["Ich heiße ...", "Mein Name ist ...", "Mein Vorname ist ..."]
  },
  {
    title: "Alter",
    question: "Wie alt sind Sie?",
    answer: "Ich bin zweiundzwanzig Jahre alt. Ich habe im Mai Geburtstag. Ich bin noch jung, aber ich arbeite schon.",
    patterns: ["Ich bin ... Jahre alt.", "Ich bin jung.", "Ich bin ..."]
  },
  {
    title: "Herkunft",
    question: "Woher kommen Sie?",
    answer: "Ich komme aus der Türkei. Meine Heimatstadt ist Ankara. Ankara ist eine große Stadt und die Hauptstadt der Türkei.",
    patterns: ["Ich komme aus ...", "Meine Heimatstadt ist ...", "Ich bin aus ..."]
  },
  {
    title: "Wohnort",
    question: "Wo wohnen Sie?",
    answer: "Ich wohne in Istanbul. Ich wohne dort mit meiner Familie. Unsere Wohnung ist nicht sehr groß, aber sie ist gemütlich.",
    patterns: ["Ich wohne in ...", "Ich lebe in ...", "Dort wohne ich seit ..."]
  },
  {
    title: "Familie",
    question: "Erzählen Sie bitte etwas über Ihre Familie.",
    answer: "Meine Familie ist klein. Ich habe eine Schwester. Meine Eltern wohnen auch in Istanbul und wir sehen uns oft.",
    patterns: ["Meine Familie ist ...", "Ich habe ...", "Meine Eltern ..."]
  },
  {
    title: "Beruf",
    question: "Was sind Sie von Beruf?",
    answer: "Ich bin Verkäuferin. Ich arbeite in einem Geschäft. Meine Arbeit beginnt um neun Uhr und ich spreche viel mit Kunden.",
    patterns: ["Ich bin ... von Beruf.", "Ich arbeite als ...", "Ich arbeite in ..."]
  },
  {
    title: "Ausbildung",
    question: "Was machen Sie beruflich oder in der Ausbildung?",
    answer: "Ich mache eine Ausbildung als Koch. Der Unterricht ist interessant. Ich lerne viel und möchte später in einem guten Restaurant arbeiten.",
    patterns: ["Ich mache eine Ausbildung als ...", "Ich studiere ...", "Ich besuche einen Kurs."]
  },
  {
    title: "Hobbys",
    question: "Was machen Sie gern in Ihrer Freizeit?",
    answer: "In meiner Freizeit höre ich Musik und gehe spazieren. Am Wochenende treffe ich Freunde. Manchmal koche ich auch zu Hause.",
    patterns: ["In meiner Freizeit ...", "Ich mache gern ...", "Am Wochenende ..."]
  },
  {
    title: "Sprachen",
    question: "Welche Sprachen sprechen Sie?",
    answer: "Ich spreche Türkisch, ein bisschen Englisch und Deutsch auf A2-Niveau. Ich lerne jeden Tag neue Wörter. Deutsch ist für mich wichtig.",
    patterns: ["Ich spreche ...", "Ich lerne Deutsch.", "Ich spreche ein bisschen ..."]
  },
  {
    title: "Zukunftspläne",
    question: "Was möchten Sie in der Zukunft machen?",
    answer: "In der Zukunft möchte ich gut Deutsch sprechen und in Österreich arbeiten. Ich möchte eine gute Arbeit finden. Außerdem möchte ich neue Menschen kennenlernen.",
    patterns: ["Ich möchte ...", "In der Zukunft will ich ...", "Mein Plan ist ..."]
  }
];

const scenes = [
  ["Zwei Freunde im Café", "Bir kafede iki arkadaş oturuyor. Kahve içiyorlar ve sohbet ediyorlar.", ["das Café", "der Kaffee", "sprechen", "sitzen", "Freunde", "blau", "rot", "der Tisch"], "Wo sind die Personen? Wer sind sie? Was machen sie? Was tragen sie?", "Auf dem Bild sehe ich zwei Personen. Sie sind in einem Café und sitzen an einem Tisch. Vielleicht sind sie Freunde. Sie sprechen miteinander und trinken Kaffee. Auf dem Tisch sehe ich zwei Tassen. Eine Person trägt ein blaues Oberteil, die andere Person trägt ein rotes Oberteil. Im Hintergrund sehe ich ein Fenster. Die Situation ist ruhig und freundlich."],
  ["Kunde und Kassiererin", "Bir müşteri ve kasiyer markette konuşuyor.", ["der Kunde", "die Kassiererin", "bezahlen", "einkaufen", "die Kasse", "die Tasche", "grün"], "Wo sind die Personen? Was macht der Kunde? Was sehen Sie auf dem Foto?", "Auf dem Bild sehe ich einen Kunden und eine Kassiererin. Sie sind in einem Supermarkt an der Kasse. Der Kunde bezahlt seine Einkäufe. Die Kassiererin arbeitet und spricht mit dem Kunden. Ich sehe eine Kasse, eine Tasche und Produkte. Der Kunde trägt vielleicht eine Jacke, die Kassiererin trägt ein grünes Oberteil. Ich denke, der Kunde kauft Lebensmittel."],
  ["Arzt und Patient", "Doktor ve hasta muayene odasında konuşuyor.", ["der Arzt", "der Patient", "krank", "helfen", "die Praxis", "weiß", "der Stuhl"], "Wer ist auf dem Bild? Wo sind sie? Wie fühlt sich der Patient?", "Auf dem Bild sehe ich einen Arzt und einen Patienten. Sie sind in einer Arztpraxis. Der Patient sitzt auf einem Stuhl und spricht mit dem Arzt. Vielleicht hat er Kopfschmerzen oder ist krank. Der Arzt trägt einen weißen Kittel und hört zu. Auf dem Bild sehe ich auch einen Tisch und vielleicht ein Heft. Die Situation ist ernst, aber der Arzt möchte helfen."],
  ["Mutter und Kind beim Einkaufen", "Anne ve çocuk alışverişte ürün seçiyor.", ["die Mutter", "das Kind", "einkaufen", "der Korb", "fragen", "Obst", "gelb"], "Was kaufen sie? Wo sind sie? Was macht das Kind?", "Ich sehe eine Mutter und ein Kind. Sie sind in einem Geschäft oder Supermarkt. Die Mutter hat einen Korb in der Hand. Das Kind zeigt auf ein Produkt und fragt vielleicht etwas. Auf dem Foto sehe ich Lebensmittel, vielleicht Obst und Brot. Die Mutter trägt ein helles Oberteil, das Kind trägt ein gelbes oder buntes T-Shirt. Vielleicht kaufen sie etwas für das Abendessen."],
  ["Zwei Schüler im Klassenzimmer", "İki öğrenci sınıfta birlikte çalışıyor.", ["die Schüler", "lernen", "das Heft", "die Klasse", "zusammen", "der Stift", "schwarz"], "Wo sind die Schüler? Was machen sie? Was liegt auf dem Tisch?", "Auf dem Bild sehe ich zwei Schüler im Klassenzimmer. Sie sitzen zusammen an einem Tisch und lernen. Auf dem Tisch liegen Hefte, Bücher und Stifte. Ein Schüler schreibt, der andere schaut ins Heft. Sie tragen normale Kleidung, zum Beispiel ein blaues und ein schwarzes Oberteil. Vielleicht machen sie Hausaufgaben oder lernen für eine Prüfung. Ich denke, sie helfen einander."],
  ["Zwei Personen an der Bushaltestelle", "İki kişi otobüs durağında bekliyor.", ["die Bushaltestelle", "warten", "der Bus", "die Tasche", "fahren", "grau", "die Straße"], "Worauf warten die Personen? Wo stehen sie? Was tragen sie?", "Ich sehe zwei Personen an einer Bushaltestelle. Sie stehen auf der Straße und warten auf den Bus. Eine Person hat eine Tasche in der Hand. Die andere Person schaut vielleicht auf das Handy. Sie tragen Jacken, vielleicht eine graue und eine blaue Jacke. Im Hintergrund sehe ich die Straße und ein Schild. Vielleicht fahren sie zur Arbeit oder nach Hause."],
  ["Zwei Personen im Restaurant", "Restoranda iki kişi sipariş veriyor.", ["das Restaurant", "bestellen", "die Speisekarte", "der Kellner", "essen", "rot", "weiß"], "Wo sind die Personen? Was machen sie? Was sehen Sie auf dem Tisch?", "Auf dem Bild sehe ich zwei Personen in einem Restaurant. Sie sitzen an einem Tisch und lesen die Speisekarte. Vielleicht bestellen sie Essen beim Kellner. Auf dem Tisch sehe ich Gläser, Teller und eine Speisekarte. Eine Person trägt ein rotes Oberteil, die andere trägt ein weißes Hemd. Die Personen sprechen miteinander. Ich denke, sie möchten zusammen essen."],
  ["Zwei Freunde im Park", "Parkta iki arkadaş bankta sohbet ediyor.", ["der Park", "die Bank", "reden", "sonnig", "Freizeit", "grün", "die Bäume"], "Wie ist das Wetter? Wo sind die Freunde? Was machen sie?", "Ich sehe zwei Freunde im Park. Sie sitzen auf einer Bank und reden miteinander. Das Wetter ist schön und sonnig. Im Hintergrund sehe ich Bäume und viel Grün. Eine Person trägt vielleicht ein blaues T-Shirt, die andere trägt eine helle Jacke. Sie lachen und sehen entspannt aus. Vielleicht sprechen sie über das Wochenende oder ihre Freizeit."],
  ["Vorstellungsgespräch", "İş görüşmesinde iki kişi konuşuyor.", ["das Büro", "das Gespräch", "die Arbeit", "fragen", "antworten", "schwarz", "der Tisch"], "Welche Situation ist das? Wer sind die Personen? Was tragen sie?", "Auf dem Bild sehe ich zwei Personen in einem Büro. Vielleicht ist das ein Vorstellungsgespräch. Eine Person stellt Fragen und die andere Person antwortet. Beide sitzen an einem Tisch. Auf dem Tisch sehe ich Papier und vielleicht einen Stift. Die Personen tragen elegante Kleidung, zum Beispiel ein schwarzes Jackett oder ein weißes Hemd. Die Situation ist offiziell, aber freundlich."],
  ["Urlaubsplanung", "İki arkadaş tatil planı yapıyor.", ["der Urlaub", "planen", "reisen", "das Handy", "der Kalender", "Sommer", "blau"], "Was planen die Freunde? Was sehen Sie auf dem Foto? Wohin möchten sie reisen?", "Auf dem Bild sehe ich zwei Freunde. Sie sitzen zusammen und planen einen Urlaub. Auf dem Tisch sehe ich ein Handy, einen Kalender und vielleicht eine Karte. Sie sprechen miteinander und suchen ein Reiseziel. Eine Person trägt ein blaues Oberteil, die andere trägt ein rotes Oberteil. Vielleicht möchten sie im Sommer ans Meer fahren. Ich denke, sie freuen sich auf die Reise."]
];

const roles = [
  ["Geburtstag organisieren", "Sie planen mit einem Freund eine Geburtstagsparty.", "Person A möchte feiern. Person B hilft bei der Planung.", ["Tag", "Uhrzeit", "Ort", "Essen", "Gäste"], "A: Hast du am Freitag Zeit?\nB: Ja, gern. Was machen wir?\nA: Ich möchte eine Geburtstagsparty machen.\nB: Gute Idee. Wo feiern wir?\nA: Bei mir zu Hause um 19 Uhr.\nB: Super. Ich bringe Kuchen mit."],
  ["Ins Kino gehen", "Sie möchten zusammen ins Kino gehen.", "Person A macht einen Vorschlag. Person B fragt nach Details.", ["Film", "Tag", "Uhrzeit", "Treffpunkt"], "A: Wollen wir am Samstag ins Kino gehen?\nB: Ja, gern. Welchen Film sehen wir?\nA: Eine Komödie.\nB: Um wie viel Uhr?\nA: Um 18 Uhr vor dem Kino.\nB: Das passt gut."],
  ["Urlaub planen", "Sie planen zusammen einen kurzen Urlaub.", "Person A möchte reisen. Person B spricht über Zeit und Geld.", ["Reiseziel", "Datum", "Hotel", "Preis"], "A: Wohin fahren wir im Sommer?\nB: Vielleicht nach Wien.\nA: Gute Idee. Wann hast du Zeit?\nB: Im Juli.\nA: Suchen wir ein günstiges Hotel?\nB: Ja, bitte."],
  ["Kurs anmelden", "Sie möchten sich für einen Deutschkurs anmelden.", "Person A fragt nach Informationen. Person B arbeitet im Kursbüro.", ["Kursbeginn", "Preis", "Zeit", "Unterlagen"], "A: Guten Tag, ich möchte einen Deutschkurs machen.\nB: Gern. Wann möchten Sie beginnen?\nA: Nächste Woche. Was kostet der Kurs?\nB: 180 Euro.\nA: Wann ist der Unterricht?\nB: Montag und Mittwoch um 18 Uhr."],
  ["Fitnessstudio", "Sie sprechen über eine Mitgliedschaft im Fitnessstudio.", "Person A möchte trainieren. Person B gibt Informationen.", ["Preis", "Öffnungszeiten", "Kurs", "Vertrag"], "A: Guten Tag, was kostet die Mitgliedschaft?\nB: Sie kostet 30 Euro im Monat.\nA: Wann ist das Studio geöffnet?\nB: Von 7 bis 22 Uhr.\nA: Gibt es auch Kurse?\nB: Ja, Yoga und Zumba."],
  ["Restaurant reservieren", "Sie reservieren einen Tisch im Restaurant.", "Person A ruft an. Person B nimmt die Reservierung an.", ["Datum", "Uhrzeit", "Personen", "Name"], "A: Guten Abend, ich möchte einen Tisch reservieren.\nB: Für wann bitte?\nA: Für Samstag um 20 Uhr.\nB: Für wie viele Personen?\nA: Für vier Personen. Mein Name ist Kaya.\nB: In Ordnung, Herr Kaya."],
  ["Arzttermin", "Sie möchten einen Termin beim Arzt vereinbaren.", "Person A ist krank. Person B arbeitet in der Praxis.", ["Problem", "Tag", "Uhrzeit", "Name"], "A: Guten Morgen, ich brauche einen Termin.\nB: Was haben Sie?\nA: Ich habe Kopfschmerzen.\nB: Können Sie morgen um 10 Uhr kommen?\nA: Ja, das passt.\nB: Wie ist Ihr Name?"],
  ["Freund einladen", "Sie laden einen Freund zu sich nach Hause ein.", "Person A lädt ein. Person B fragt nach Essen und Zeit.", ["Tag", "Uhrzeit", "Adresse", "Essen"], "A: Kommst du am Sonntag zu mir?\nB: Ja, gern. Um wie viel Uhr?\nA: Um 16 Uhr.\nB: Was machen wir?\nA: Wir essen zusammen und trinken Tee.\nB: Schön, ich komme."],
  ["Einkaufsplan", "Sie planen zusammen einen Einkauf.", "Person A braucht Lebensmittel. Person B schlägt ein Geschäft vor.", ["Geschäft", "Liste", "Zeit", "Geld"], "A: Wir müssen einkaufen gehen.\nB: Was brauchen wir?\nA: Brot, Käse und Obst.\nB: Gehen wir zum Supermarkt?\nA: Ja, um 17 Uhr.\nB: Gut, ich nehme Geld mit."],
  ["Wochenendprogramm", "Sie planen ein Treffen am Wochenende.", "Person A macht Vorschläge. Person B wählt eine Aktivität.", ["Tag", "Uhrzeit", "Ort", "Aktivität"], "A: Hast du am Samstag Zeit?\nB: Ja, gern.\nA: Wollen wir ins Kino gehen?\nB: Gute Idee.\nA: Um 18 Uhr?\nB: Ja, das passt."]
];

function toggleButton(html) {
  return `<button class="answer-toggle" type="button" aria-expanded="false">Cevabı göster</button><div class="answer">${html}</div>`;
}

function chipList(items) {
  return `<div class="chips">${items.map(item => `<span>${item}</span>`).join("")}</div>`;
}

function makePersonScene(index) {
  const colors = ["#5b8def", "#d86f45", "#0f766e", "#e0b443"];
  const c1 = colors[index % colors.length];
  const c2 = colors[(index + 1) % colors.length];
  return `<svg viewBox="0 0 320 300" role="img" aria-label="Zwei Personen Illustration">
    <rect width="320" height="300" fill="#eaf6f3"/>
    <rect x="0" y="205" width="320" height="95" fill="#f5e3bd"/>
    <rect x="35" y="42" width="250" height="74" rx="10" fill="#fff" opacity=".85"/>
    <circle cx="112" cy="108" r="33" fill="#f1c7a2"/>
    <circle cx="210" cy="108" r="33" fill="#f1c7a2"/>
    <path d="M74 195c4-48 22-74 38-74s35 26 39 74z" fill="${c1}"/>
    <path d="M172 195c4-48 22-74 38-74s35 26 39 74z" fill="${c2}"/>
    <rect x="88" y="190" width="150" height="16" rx="8" fill="#8d6748"/>
    <rect x="102" y="207" width="16" height="54" rx="8" fill="#8d6748"/>
    <rect x="208" y="207" width="16" height="54" rx="8" fill="#8d6748"/>
    <path d="M74 75c18-31 59-24 70 8-20-8-42-9-70-8z" fill="#47352d"/>
    <path d="M174 75c18-31 59-24 70 8-20-8-42-9-70-8z" fill="#47352d"/>
    <circle cx="142" cy="96" r="5" fill="#12211f"/>
    <circle cx="240" cy="96" r="5" fill="#12211f"/>
    <path d="M153 93c16-17 33-17 47 0" stroke="#12211f" stroke-width="5" fill="none" stroke-linecap="round"/>
  </svg>`;
}

document.getElementById("introGrid").innerHTML = introTopics.map(topic => `
  <article class="practice-card">
    <h3>${topic.title}</h3>
    <p class="label">Frage</p>
    <p>${topic.question}</p>
    <p class="label">Nützliche Redemittel</p>
    ${chipList(topic.patterns)}
    ${toggleButton(`<p>${topic.answer}</p>`)}
  </article>
`).join("");

document.getElementById("sceneList").innerHTML = scenes.map((scene, index) => `
  <article class="scene-card">
    <div class="scene-art">${makePersonScene(index)}</div>
    <div class="scene-copy">
      <h3>${scene[0]}</h3>
      <p class="label">Sahne tasviri</p>
      <p>${scene[1]}</p>
      <p class="label">Hilfswörter</p>
      ${chipList(scene[2])}
      <p class="label">Redemittel</p>
      ${chipList(["Auf dem Bild sehe ich ...", "Ich sehe zwei Personen.", "Vielleicht ...", "Ich denke, ..."])}
      <p class="label">Beispielfragen</p>
      <p>${scene[3]}</p>
      ${toggleButton(`<p>${scene[4]}</p>`)}
    </div>
  </article>
`).join("");

document.getElementById("roleGrid").innerHTML = roles.map(role => `
  <article class="role-card">
    <h3>${role[0]}</h3>
    <p class="label">Aufgabe</p>
    <p>${role[1]}</p>
    <p class="label">Rollen</p>
    <p>${role[2]}</p>
    <p class="label">Gesprächspunkte</p>
    <div class="topics">${role[3].map(item => `<span>${item}</span>`).join("")}</div>
    <p class="label">Redemittel</p>
    ${chipList(["Hast du Zeit?", "Wollen wir ...?", "Das passt.", "Gute Idee.", "Wann treffen wir uns?"])}
    ${toggleButton(`<p class="dialogue">${role[4]}</p>`)}
  </article>
`).join("");

document.addEventListener("click", event => {
  const button = event.target.closest(".answer-toggle");
  if (!button) return;
  const answer = button.nextElementSibling;
  const open = answer.classList.toggle("open");
  button.setAttribute("aria-expanded", open ? "true" : "false");
  button.textContent = open ? "Cevabı gizle" : "Cevabı göster";
});
