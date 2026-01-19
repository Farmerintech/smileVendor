const API_URL = "https://api.yourapp.com";

export async function createStore(payload: any) {
  const res = await fetch(`${API_URL}/stores`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }

  return res.json();
}

export async function fetchStores() {
  const res = await fetch(`${API_URL}/stores`);

  if (!res.ok) {
    throw new Error("Failed to fetch stores");
  }

  return res.json();
}
