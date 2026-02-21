fetch("http://localhost:3000/api/link/toefl", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ id: 1, saluran_whatsapp: "wa", saluran_telegram: "tg", grup: "gp" }),
})
  .then((res) => res.json().then((data) => console.log("Status:", res.status, "Body:", data)))
  .catch((err) => console.error("Fetch error:", err));
