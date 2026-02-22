fetch("http://localhost:3000/api/admin-number")
  .then((res) => res.json().then((data) => console.log("Status:", res.status, "Body:", data)))
  .catch((err) => console.error("Fetch error:", err));
