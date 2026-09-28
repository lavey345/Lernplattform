import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const required = ["id", "subject", "topic", "title", "difficulty", "type", "prompt", "solution"];
const catalog = JSON.parse(await readFile("content/catalog.json", "utf8"));
const ids = new Set(); let errors = [];
for (const file of catalog.exercises) {
  try {
    const exercise = JSON.parse(await readFile(file, "utf8"));
    required.filter((field) => !exercise[field]).forEach((field) => errors.push(`${file}: Feld '${field}' fehlt.`));
    if (ids.has(exercise.id)) errors.push(`${file}: id '${exercise.id}' ist nicht eindeutig.`); ids.add(exercise.id);
    if (!["leicht", "mittel", "schwer"].includes(exercise.difficulty)) errors.push(`${file}: ungültige Schwierigkeit.`);
    if (!["multiple-choice", "short-answer"].includes(exercise.type)) errors.push(`${file}: unbekannter Übungstyp.`);
    if (exercise.type === "multiple-choice" && (!Array.isArray(exercise.choices) || !Number.isInteger(exercise.solution.correctChoice))) errors.push(`${file}: Auswahl und korrekte Antwort fehlen.`);
    if (exercise.type === "short-answer" && !exercise.solution.acceptedAnswer) errors.push(`${file}: Musterantwort fehlt.`);
  } catch (error) { errors.push(`${file}: nicht lesbar (${error.message}).`); }
}
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log(`${catalog.exercises.length} Übungen sind gültig.`);
