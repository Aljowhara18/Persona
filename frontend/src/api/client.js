const BASE_URL = "https://persona-x8me.onrender.com";

async function handle(response) {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `خطأ ${response.status}`);
  }
  return response.json();
}

export function getCharacters(type) {
  const query = type ? `?type=${type}` : "";
  return fetch(`${BASE_URL}/characters${query}`).then(handle);
}

export function getCharacter(id) {
  return fetch(`${BASE_URL}/characters/${id}`).then(handle);
}

export function getQuizQuestions() {
  return fetch(`${BASE_URL}/quiz/questions`).then(handle);
}

export function submitQuiz(answers) {
  return fetch(`${BASE_URL}/quiz/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  }).then(handle);
}

export function getComments(characterId) {
  return fetch(`${BASE_URL}/characters/${characterId}/comments`).then(handle);
}

export function addComment(characterId, { author, text }) {
  return fetch(`${BASE_URL}/characters/${characterId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ author, text }),
  }).then(handle);
}

export function uploadScript(file) {
  const formData = new FormData();
  formData.append("file", file);
  return fetch(`${BASE_URL}/scripts/upload`, {
    method: "POST",
    body: formData,
  }).then(handle);
}
