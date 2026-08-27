const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("admin_token");
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error || `Request failed with status ${res.status}`);
  }

  return data;
}

export const login = (username, password) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

export const getProjects = () => request("/projects");

export const getProject = (id) => request(`/projects/${id}`);

export const createProject = (project) =>
  request("/projects", { method: "POST", body: JSON.stringify(project) });

export const updateProject = (id, project) =>
  request(`/projects/${id}`, { method: "PUT", body: JSON.stringify(project) });

export const deleteProject = (id) =>
  request(`/projects/${id}`, { method: "DELETE" });

export const getContent = () => request("/content");

export const updateContentSection = (section, value) =>
  request(`/content/${section}`, {
    method: "PUT",
    body: JSON.stringify(value),
  });

export const submitLead = (lead) =>
  request("/leads", { method: "POST", body: JSON.stringify(lead) });

export const getLeads = () => request("/leads");

export const updateLeadStatus = (id, status) =>
  request(`/leads/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });

export const deleteLead = (id) => request(`/leads/${id}`, { method: "DELETE" });
