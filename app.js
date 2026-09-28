const state = { exercises: [], solved: new Set(JSON.parse(localStorage.getItem("solvedExercises") || "[]")) };
const list = document.querySelector("#exercise-list");
const subjectFilter = document.querySelector("#subject-filter");
const difficultyFilter = document.querySelector("#difficulty-filter");

async function loadExercises() {
  const manifest = await fetch("content/catalog.json").then((response) => response.json());
  state.exercises = await Promise.all(manifest.exercises.map((path) => fetch(path).then((response) => response.json())));
  [...new Set(state.exercises.map((exercise) => exercise.subject))].sort().forEach((subject) => subjectFilter.add(new Option(subject, subject)));
  render();
}
function saveProgress() { localStorage.setItem("solvedExercises", JSON.stringify([...state.solved])); }
function render() {
  const visible = state.exercises.filter((x) => (!subjectFilter.value || x.subject === subjectFilter.value) && (!difficultyFilter.value || x.difficulty === difficultyFilter.value));
  document.querySelector("#progress").textContent = `${state.solved.size} von ${state.exercises.length} Aufgaben gelöst`;
  list.replaceChildren();
  if (!visible.length) { list.innerHTML = '<p class="empty">Keine passenden Übungen gefunden.</p>'; return; }
  visible.forEach(renderExercise);
}
function renderExercise(exercise) {
  const card = document.querySelector("#exercise-template").content.cloneNode(true);
  card.querySelector(".exercise-meta").textContent = `${exercise.subject} · ${exercise.topic} · ${exercise.difficulty}`;
  card.querySelector("h2").textContent = exercise.title;
  card.querySelector(".prompt").textContent = exercise.prompt;
  card.querySelector(".solution div").textContent = exercise.solution.explanation;
  const form = card.querySelector("form"), feedback = card.querySelector(".feedback");
  if (exercise.type === "multiple-choice") {
    exercise.choices.forEach((choice, index) => { const label = document.createElement("label"); label.innerHTML = `<input type="radio" name="${exercise.id}" value="${index}"> ${choice}`; form.append(label); });
  } else form.innerHTML = '<input type="text" name="answer" autocomplete="off" placeholder="Deine Antwort">';
  const button = document.createElement("button"); button.type = "submit"; button.textContent = "Antwort prüfen"; form.append(button);
  form.addEventListener("submit", (event) => { event.preventDefault(); const value = new FormData(form).get(exercise.type === "multiple-choice" ? exercise.id : "answer"); const correct = exercise.type === "multiple-choice" ? Number(value) === exercise.solution.correctChoice : String(value || "").trim().toLocaleLowerCase("de-DE") === exercise.solution.acceptedAnswer.toLocaleLowerCase("de-DE"); feedback.textContent = correct ? "Richtig! Gut gemacht." : "Noch nicht ganz. Schau dir bei Bedarf die Lösung an."; feedback.className = `feedback ${correct ? "correct" : "incorrect"}`; if (correct) { state.solved.add(exercise.id); saveProgress(); render(); } });
  list.append(card);
}
subjectFilter.addEventListener("change", render); difficultyFilter.addEventListener("change", render);
loadExercises().catch(() => { list.innerHTML = '<p class="empty">Die Inhalte konnten nicht geladen werden. Öffne die Seite über einen lokalen Webserver oder GitHub Pages.</p>'; });
