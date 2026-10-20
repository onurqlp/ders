const YOUTUBE_PLAYLIST = "https://youtube.com/playlist?list=PLVPOPYVm4frMH0CdRkNU9t1PUMWzqJ4M-&si=0loVzhNhbarZQ4UC";

const letter = (i) => String.fromCharCode(65 + i);

const bases = [
  { person: "Mina", city: "Graz", topic: "Bäckerei", item: "Brot", place: "Marktplatz", activity: "einkaufen", image: "Zwei Personen stehen an einer Kasse und bezahlen Brot.", role: "Sie möchten ein frisches Brot kaufen, aber es ist ausverkauft." },
  { person: "Okan", city: "Linz", topic: "Fahrrad", item: "Helm", place: "Bahnhof", activity: "fahren", image: "Zwei Personen stehen neben Fahrrädern vor dem Bahnhof.", role: "Fragen Sie nach dem Weg zum Fahrradparkplatz." },
  { person: "Sara", city: "Wien", topic: "Arzttermin", item: "Versicherungskarte", place: "Praxis", activity: "warten", image: "Zwei Personen sitzen im Wartezimmer und sprechen leise.", role: "Sie brauchen einen neuen Termin am Nachmittag." },
  { person: "Emre", city: "Salzburg", topic: "Sprachkurs", item: "Heft", place: "Volkshochschule", activity: "lernen", image: "Zwei Personen sitzen im Kursraum mit Heften auf dem Tisch.", role: "Bitten Sie Ihren Kurskollegen um Hilfe bei den Hausaufgaben." },
  { person: "Lea", city: "Innsbruck", topic: "Wohnung", item: "Schlüssel", place: "Hausflur", activity: "umziehen", image: "Zwei Personen tragen Kartons in eine Wohnung.", role: "Fragen Sie den Nachbarn nach dem Müllraum." },
  { person: "Nico", city: "Bregenz", topic: "Supermarkt", item: "Milch", place: "Kühlregal", activity: "suchen", image: "Zwei Personen vergleichen Produkte im Supermarkt.", role: "Fragen Sie, wo die günstige Milch steht." },
  { person: "Aylin", city: "Klagenfurt", topic: "Post", item: "Paket", place: "Postfiliale", activity: "abholen", image: "Zwei Personen stehen mit einem Paket am Schalter.", role: "Sie möchten ein Paket abholen und zeigen Ihren Ausweis." },
  { person: "Tom", city: "St. Pölten", topic: "Restaurant", item: "Speisekarte", place: "Terrasse", activity: "bestellen", image: "Zwei Personen sitzen am Tisch und sehen in die Speisekarte.", role: "Bestellen Sie ein Getränk ohne Zucker." },
  { person: "Daria", city: "Eisenstadt", topic: "Bibliothek", item: "Buch", place: "Lesesaal", activity: "lesen", image: "Zwei Personen suchen Bücher in einem Regal.", role: "Fragen Sie, ob Sie das Buch zwei Wochen behalten dürfen." },
  { person: "Jonas", city: "Dornbirn", topic: "Sport", item: "Turnschuhe", place: "Sporthalle", activity: "trainieren", image: "Zwei Personen machen Pause nach dem Training.", role: "Fragen Sie nach der Uhrzeit des nächsten Kurses." },
  { person: "Elif", city: "Wels", topic: "Kindergarten", item: "Rucksack", place: "Eingang", activity: "bringen", image: "Zwei Erwachsene sprechen vor einem Kindergarten.", role: "Sagen Sie, dass Ihr Kind heute früher abgeholt wird." },
  { person: "Paul", city: "Villach", topic: "Hotel", item: "Zimmerkarte", place: "Rezeption", activity: "einchecken", image: "Zwei Personen stehen mit Koffern an der Rezeption.", role: "Fragen Sie nach dem Frühstück und WLAN." },
  { person: "Nora", city: "Steyr", topic: "Schwimmbad", item: "Handtuch", place: "Kasse", activity: "bezahlen", image: "Zwei Personen stehen mit Taschen vor dem Schwimmbad.", role: "Kaufen Sie eine Tageskarte und fragen Sie nach dem Preis." },
  { person: "Kaan", city: "Leoben", topic: "Apotheke", item: "Tropfen", place: "Theke", activity: "fragen", image: "Zwei Personen sprechen in einer Apotheke.", role: "Erklären Sie, dass Sie Kopfschmerzen haben." },
  { person: "Iris", city: "Mödling", topic: "Kino", item: "Ticket", place: "Eingang", activity: "treffen", image: "Zwei Personen zeigen Kinokarten am Eingang.", role: "Fragen Sie, ob noch Plätze nebeneinander frei sind." },
  { person: "Ben", city: "Traun", topic: "Bank", item: "Karte", place: "Automat", activity: "abheben", image: "Zwei Personen stehen vor einem Bankautomaten.", role: "Bitten Sie um Hilfe, weil der Automat nicht funktioniert." },
  { person: "Zeynep", city: "Amstetten", topic: "Friseur", item: "Termin", place: "Salon", activity: "warten", image: "Zwei Personen sprechen vor einem Spiegel im Salon.", role: "Sagen Sie, wie kurz die Haare werden sollen." },
  { person: "Mara", city: "Kapfenberg", topic: "Markt", item: "Äpfel", place: "Obststand", activity: "kaufen", image: "Zwei Personen wählen Obst auf einem Markt aus.", role: "Fragen Sie nach einem Kilo Äpfeln und dem Preis." },
  { person: "Arda", city: "Krems", topic: "Bus", item: "Fahrkarte", place: "Haltestelle", activity: "fahren", image: "Zwei Personen warten mit Taschen an einer Bushaltestelle.", role: "Fragen Sie, welcher Bus ins Zentrum fährt." },
  { person: "Sofia", city: "Baden", topic: "Café", item: "Kaffee", place: "Fensterplatz", activity: "arbeiten", image: "Zwei Personen sitzen mit Kaffee und Laptop im Café.", role: "Bestellen Sie Kaffee und fragen Sie nach einem freien Tisch." }
];

const formTasks = [
  { prompt: "Sie melden sich in einem Deutschkurs an. Fuellen Sie das Kursformular auf Deutsch aus.", fields: ["Vorname", "Familienname", "Geburtsdatum", "Telefon", "Kurstag", "Unterschrift"] },
  { prompt: "Sie moechten eine Bibliothekskarte bekommen. Fuellen Sie das Formular auf Deutsch aus.", fields: ["Name", "Adresse", "Wohnort", "E-Mail", "Lieblingsbuch", "Datum"] },
  { prompt: "Sie reservieren ein Zimmer in einer Pension. Ergaenzen Sie die Angaben auf Deutsch.", fields: ["Familienname", "Ankunft", "Abreise", "Personen", "Zimmerart", "Telefon"] },
  { prompt: "Sie melden Ihr Kind fuer einen Sportkurs an. Fuellen Sie das Anmeldeformular aus.", fields: ["Name des Kindes", "Alter", "Kurs", "Wochentag", "Name der Eltern", "Notfallnummer"] },
  { prompt: "Sie brauchen einen Termin beim Arzt. Schreiben Sie die Daten in das Formular.", fields: ["Patient/in", "Geburtsjahr", "Beschwerde", "Wunschtermin", "Krankenkasse", "Telefon"] },
  { prompt: "Sie bestellen eine Kundenkarte im Supermarkt. Ergaenzen Sie das Formular.", fields: ["Vorname", "Nachname", "Strasse", "PLZ/Ort", "E-Mail", "Unterschrift"] },
  { prompt: "Sie geben ein Paket bei der Post auf. Fuellen Sie den Paketschein aus.", fields: ["Absender", "Empfaenger", "Strasse", "Ort", "Inhalt", "Datum"] },
  { prompt: "Sie moechten an einem Kochabend teilnehmen. Tragen Sie Ihre Daten ein.", fields: ["Name", "Telefon", "Teilnehmerzahl", "Essenwunsch", "Termin", "Unterschrift"] },
  { prompt: "Sie leihen ein Fahrrad aus. Fuellen Sie das Leihformular aus.", fields: ["Name", "Ausweisnummer", "Startzeit", "Rueckgabezeit", "Fahrradtyp", "Telefon"] },
  { prompt: "Sie melden sich im Fitnessstudio an. Ergaenzen Sie das Formular.", fields: ["Vorname", "Nachname", "Geburtsdatum", "Trainingsziel", "Startdatum", "Unterschrift"] },
  { prompt: "Sie fuellen eine Kindergarten-Information aus. Schreiben Sie kurze Angaben.", fields: ["Kind", "Alter", "Abholperson", "Telefon", "Allergie", "Datum"] },
  { prompt: "Sie checken im Hotel ein. Fuellen Sie die Gaestekarte aus.", fields: ["Name", "Land", "Passnummer", "Naechte", "Zimmernummer", "Unterschrift"] },
  { prompt: "Sie kaufen eine Schwimmbad-Jahreskarte. Ergaenzen Sie das Formular.", fields: ["Name", "Adresse", "Geburtsdatum", "Kartentyp", "Telefon", "Datum"] },
  { prompt: "Sie bestellen ein Medikament in der Apotheke. Fuellen Sie den Bestellschein aus.", fields: ["Name", "Telefon", "Medikament", "Menge", "Abholtag", "Unterschrift"] },
  { prompt: "Sie reservieren Kinokarten. Schreiben Sie die Informationen in das Formular.", fields: ["Name", "Film", "Tag", "Uhrzeit", "Anzahl Karten", "Telefon"] },
  { prompt: "Sie eroeffnen ein einfaches Konto. Ergaenzen Sie die Kundendaten.", fields: ["Vorname", "Nachname", "Adresse", "Geburtsdatum", "Beruf", "Unterschrift"] },
  { prompt: "Sie machen einen Termin beim Friseur. Fuellen Sie die Terminkarte aus.", fields: ["Name", "Telefon", "Wunschtag", "Uhrzeit", "Wunsch", "Datum"] },
  { prompt: "Sie bestellen Obst fuer eine Feier. Ergaenzen Sie den Bestellschein.", fields: ["Name", "Telefon", "Obstsorte", "Kilo", "Abholzeit", "Datum"] },
  { prompt: "Sie kaufen eine Monatskarte fuer den Bus. Fuellen Sie das Formular aus.", fields: ["Name", "Adresse", "Zone", "Startmonat", "Geburtsdatum", "Unterschrift"] },
  { prompt: "Sie reservieren einen Tisch im Cafe. Schreiben Sie die Angaben auf Deutsch.", fields: ["Name", "Telefon", "Datum", "Uhrzeit", "Personen", "Wunschplatz"] }
];

const emailTasks = [
  { prompt: "Schreiben Sie eine E-Mail an Ihre Kursleiterin. Schreiben Sie ungefaehr 30 Woerter.", bullets: ["Sie koennen morgen nicht zum Kurs kommen.", "Nennen Sie den Grund.", "Fragen Sie nach den Hausaufgaben."] },
  { prompt: "Schreiben Sie eine Nachricht an Ihren Nachbarn. Schreiben Sie ungefaehr 30 Woerter.", bullets: ["Sie machen am Samstag eine kleine Feier.", "Sagen Sie die Uhrzeit.", "Entschuldigen Sie sich fuer moeglichen Laerm."] },
  { prompt: "Schreiben Sie eine E-Mail an ein Hotel. Schreiben Sie ungefaehr 30 Woerter.", bullets: ["Sie moechten ein Zimmer reservieren.", "Nennen Sie Datum und Personenzahl.", "Fragen Sie nach dem Preis."] },
  { prompt: "Schreiben Sie eine Nachricht an eine Freundin. Schreiben Sie ungefaehr 30 Woerter.", bullets: ["Sie laden sie zum Essen ein.", "Sagen Sie Ort und Zeit.", "Bitten Sie um Antwort."] },
  { prompt: "Schreiben Sie eine E-Mail an die Arztpraxis. Schreiben Sie ungefaehr 30 Woerter.", bullets: ["Sie brauchen einen Termin.", "Sagen Sie Ihr Problem.", "Fragen Sie nach einem Termin am Nachmittag."] },
  { prompt: "Schreiben Sie eine Nachricht an Ihren Bruder. Schreiben Sie ungefaehr 30 Woerter.", bullets: ["Sie gehen einkaufen.", "Sagen Sie, was Sie kaufen.", "Fragen Sie, ob er etwas braucht."] },
  { prompt: "Schreiben Sie eine E-Mail an die Post. Schreiben Sie ungefaehr 30 Woerter.", bullets: ["Ihr Paket ist nicht angekommen.", "Nennen Sie Ihre Adresse.", "Bitten Sie um Hilfe."] },
  { prompt: "Schreiben Sie eine Nachricht an einen Freund. Schreiben Sie ungefaehr 30 Woerter.", bullets: ["Sie treffen sich im Restaurant.", "Sagen Sie, dass Sie spaeter kommen.", "Bitten Sie ihn zu warten."] },
  { prompt: "Schreiben Sie eine E-Mail an die Bibliothek. Schreiben Sie ungefaehr 30 Woerter.", bullets: ["Sie moechten ein Buch laenger behalten.", "Nennen Sie den Titel.", "Fragen Sie nach einer Verlaengerung."] },
  { prompt: "Schreiben Sie eine Nachricht an Ihre Sportgruppe. Schreiben Sie ungefaehr 30 Woerter.", bullets: ["Sie kommen heute nicht zum Training.", "Nennen Sie den Grund.", "Wuenschen Sie viel Spass."] },
  { prompt: "Schreiben Sie eine Nachricht an die Erzieherin. Schreiben Sie ungefaehr 30 Woerter.", bullets: ["Ihr Kind ist krank.", "Es kommt heute nicht.", "Fragen Sie nach wichtigen Informationen."] },
  { prompt: "Schreiben Sie eine E-Mail an die Rezeption. Schreiben Sie ungefaehr 30 Woerter.", bullets: ["Sie kommen spaeter im Hotel an.", "Nennen Sie die Uhrzeit.", "Bitten Sie, das Zimmer zu behalten."] },
  { prompt: "Schreiben Sie eine Nachricht an eine Freundin. Schreiben Sie ungefaehr 30 Woerter.", bullets: ["Sie moechten ins Schwimmbad gehen.", "Sagen Sie Treffpunkt und Zeit.", "Fragen Sie, ob sie mitkommt."] },
  { prompt: "Schreiben Sie eine E-Mail an die Apotheke. Schreiben Sie ungefaehr 30 Woerter.", bullets: ["Sie brauchen ein Medikament.", "Fragen Sie, ob es da ist.", "Sagen Sie, wann Sie kommen."] },
  { prompt: "Schreiben Sie eine Nachricht an Ihren Cousin. Schreiben Sie ungefaehr 30 Woerter.", bullets: ["Sie moechten ins Kino gehen.", "Schlagen Sie einen Film vor.", "Fragen Sie nach seiner Zeit."] },
  { prompt: "Schreiben Sie eine E-Mail an Ihre Bank. Schreiben Sie ungefaehr 30 Woerter.", bullets: ["Ihre Karte funktioniert nicht.", "Sagen Sie seit wann.", "Bitten Sie um einen Termin."] },
  { prompt: "Schreiben Sie eine Nachricht an den Friseur. Schreiben Sie ungefaehr 30 Woerter.", bullets: ["Sie koennen den Termin nicht nehmen.", "Bitten Sie um einen neuen Termin.", "Sagen Sie einen passenden Tag."] },
  { prompt: "Schreiben Sie eine Nachricht an Ihre Kollegin. Schreiben Sie ungefaehr 30 Woerter.", bullets: ["Sie kaufen Obst fuer das Buero.", "Fragen Sie nach Wuenschen.", "Sagen Sie, wann Sie zurueck sind."] },
  { prompt: "Schreiben Sie eine E-Mail an den Verkehrsbetrieb. Schreiben Sie ungefaehr 30 Woerter.", bullets: ["Sie haben Ihre Fahrkarte verloren.", "Nennen Sie die Linie.", "Fragen Sie, was Sie tun sollen."] },
  { prompt: "Schreiben Sie eine Nachricht an einen Freund. Schreiben Sie ungefaehr 30 Woerter.", bullets: ["Sie moechten im Cafe lernen.", "Sagen Sie Uhrzeit und Adresse.", "Bitten Sie, ein Buch mitzubringen."] }
];

const speakingCards = [
  ["Name", "Wohnort", "Deutsch lernen", "Lieblingsessen", "Wochenende", "Telefonnummer buchstabieren"],
  ["Vorname", "Herkunft", "Familie", "Verkehrsmittel", "Hobby", "E-Mail-Adresse buchstabieren"],
  ["Name", "Alter", "Beruf", "Arbeitszeit", "Lieblingsgetraenk", "Adresse nennen"],
  ["Vorname", "Land", "Sprachen", "Kurszeiten", "Freizeit", "Geburtsdatum sagen"],
  ["Name", "Wohnung", "Zimmer", "Nachbarn", "Einkaufen", "Strasse buchstabieren"],
  ["Vorname", "Stadt", "Supermarkt", "Lieblingsprodukt", "Bezahlen", "Postleitzahl sagen"],
  ["Name", "Adresse", "Paket", "Oeffnungszeiten", "Ausweis", "Familienname buchstabieren"],
  ["Vorname", "Restaurant", "Lieblingsessen", "Getraenk", "Freunde", "Uhrzeit nennen"],
  ["Name", "Bibliothek", "Lesen", "Lieblingsbuch", "Ruhe", "Kartennummer sagen"],
  ["Vorname", "Sport", "Trainingstag", "Kleidung", "Gesundheit", "Telefonnummer sagen"],
  ["Name", "Familie", "Kindergarten", "Tagesablauf", "Essen", "Name des Kindes buchstabieren"],
  ["Vorname", "Reise", "Hotel", "Fruehstueck", "Zimmer", "Passnummer sagen"],
  ["Name", "Schwimmen", "Sommer", "Eintritt", "Freunde", "Geburtsjahr sagen"],
  ["Vorname", "Gesundheit", "Apotheke", "Medizin", "Koerperteile", "Adresse sagen"],
  ["Name", "Kino", "Film", "Uhrzeit", "Wochenende", "Filmname buchstabieren"],
  ["Vorname", "Bank", "Geld", "Karte", "Termin", "Kontonummer kurz sagen"],
  ["Name", "Friseur", "Aussehen", "Termin", "Farbe", "Wunschtag nennen"],
  ["Vorname", "Markt", "Obst", "Preis", "Kochen", "Menge nennen"],
  ["Name", "Bus", "Ticket", "Haltestelle", "Weg", "Liniennummer sagen"],
  ["Vorname", "Cafe", "Lernen", "Kaffee", "Freunde", "Treffpunkt buchstabieren"]
];

function makeExam(base, index) {
  const n = index + 1;
  const lesen1Situations = [
    `Sie möchten am Samstag ${base.activity} und brauchen Informationen zu ${base.topic}.`,
    `Ein Freund sucht in ${base.city} einen günstigen Ort für ${base.item}.`,
    `Sie haben wenig Zeit und brauchen einen Service am Abend.`,
    `Ihre Nachbarin möchte einen Kurs oder Treffpunkt für Anfänger besuchen.`,
    `Sie suchen einen ruhigen Platz für eine kurze Pause.`
  ];
  const lesen1Ads = [
    { title: `${base.topic} am ${base.place}`, text: `Heute offen bis 18 Uhr. Beratung für Anfänger, kleine Preise und freundlicher Service.` },
    { title: `Abend-Service ${n}`, text: `Montag bis Freitag bis 21 Uhr geöffnet. Schnelle Hilfe ohne Anmeldung.` },
    { title: `Café Morgenrot`, text: `Ruhige Tische, kleine Snacks, Zeitungen und kostenloses Wasser im Zentrum.` },
    { title: `Treffpunkt Start`, text: `Jeden Dienstag lernen Anfänger zusammen. Keine Vorkenntnisse nötig.` },
    { title: `Preiswert in ${base.city}`, text: `Gute Angebote für ${base.item}. Beratung auf Deutsch und Englisch.` },
    { title: `Wochenend-Info`, text: `Samstag geöffnet. Informationen zu ${base.topic}, Anmeldung und Preisen direkt vor Ort.` }
  ];
  const lesen1Answers = ["F", "E", "B", "D", "C"];

  const lesen2Ads = [
    { title: `${base.topic} Kompakt`, text: `Geöffnet von 9 bis 17 Uhr. Am Sonntag geschlossen. Sie können telefonisch reservieren.` },
    { title: `Familientag ${base.city}`, text: `Kinder bis sechs Jahre zahlen nichts. Hunde dürfen nicht in den Innenraum.` },
    { title: `Schnell & Nah`, text: `Online bestellen und nach 30 Minuten abholen. Bezahlung nur mit Karte.` }
  ];
  const lesen2Questions = [
    { text: "Das erste Angebot ist auch am Sonntag geöffnet.", answer: "NEIN" },
    { text: "Beim ersten Angebot kann man anrufen und reservieren.", answer: "JA" },
    { text: "Kinder unter sechs Jahren müssen beim Familientag bezahlen.", answer: "NEIN" },
    { text: "Hunde dürfen beim Familientag überall hinein.", answer: "NEIN" },
    { text: "Bei Schnell & Nah kann man online bestellen.", answer: "JA" },
    { text: "Bei Schnell & Nah kann man bar bezahlen.", answer: "NEIN" }
  ];

  const lesen3Texts = [
    `Bitte bringen Sie morgen Ihr ${base.item} mit.`,
    `Der Treffpunkt ist um 10 Uhr am ${base.place}.`,
    `Heute gibt es eine kurze Pause von 12 bis 13 Uhr.`,
    `Rufen Sie bitte zuerst an und kommen Sie nicht ohne Termin.`,
    `Die Tür ist rechts neben dem Eingang.`
  ];
  const lesen3Images = [
    `Bild A: Ein Gegenstand liegt auf einem Tisch: ${base.item}.`,
    `Bild B: Zwei Menschen warten am ${base.place}.`,
    "Bild C: Eine Uhr zeigt Mittagspause.",
    "Bild D: Eine Person telefoniert und schreibt einen Termin auf.",
    "Bild E: Ein Pfeil zeigt zu einer Tür rechts.",
    "Bild F: Eine Person kauft Blumen im Park."
  ];
  const lesen3Answers = ["A", "B", "C", "D", "E"];

  return {
    id: n,
    title: `Deneme ${n}`,
    theme: `${base.topic} - ${base.city}`,
    lesen: {
      aufgabe1: { situations: lesen1Situations, ads: lesen1Ads, answers: lesen1Answers },
      aufgabe2: { ads: lesen2Ads, questions: lesen2Questions },
      aufgabe3: { texts: lesen3Texts, images: lesen3Images, answers: lesen3Answers }
    },
    schreiben: {
      aufgabe1: formTasks[index],
      aufgabe2: emailTasks[index]
    },
    sprechen: {
      teil1: speakingCards[index],
      teil2: base.image,
      teil3: base.role
    }
  };
}

window.EXAMS = bases.map(makeExam);
window.YOUTUBE_PLAYLIST = YOUTUBE_PLAYLIST;
