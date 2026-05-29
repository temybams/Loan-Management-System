const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getStoredAuth() {
  try {
    return JSON.parse(localStorage.getItem("loan_os_auth") || "null");
  } catch {
    return null;
  }
}

function normalizeError(payload, fallback) {
  if (Array.isArray(payload?.message)) return payload.message.join(", ");
  return payload?.message || fallback;
}

export async function request(path, options = {}) {
  const auth = getStoredAuth();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (auth?.token) {
    headers.Authorization = `Bearer ${auth.token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(normalizeError(payload, "Request failed"));
  }

  return payload;
}

export const api = {
  signup: (body) =>
    request("/users/signup", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  login: async (body) => {
    const response = await request("/users/login", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const loginData = response.data?.token || response.data;
    const token = loginData?.token;
    const { password, ...safeUser } = loginData?.user || {};

    return {
      token,
      user: safeUser,
    };
  },

  logout: () => request("/users/logout", { method: "POST" }),

  getMyLoans: () => request("/loan/my-loans"),
  getLoanDetails: (loanId) => request(`/loan/${loanId}`),
  getLoanSchedule: (loanId) => request(`/loan/${loanId}/schedule`),
  getLoanSummary: (loanId) => request(`/loan/${loanId}/summary`),
  applyForLoan: (body) =>
    request("/loan/apply", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  repayLoan: (body) =>
    request("/loan/repay", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getAllLoans: () => request("/loan/admin"),
  updateLoanStatus: (loanId, status) =>
    request(`/loan/admin/${loanId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};
