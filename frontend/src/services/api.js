const API_URL = "http://localhost:5000";

export const fetchTodos = async () => {
    const res = await fetch(`${API_URL}/list`, { credentials: "include" });
    return res.json();
};

export const loginWithGoogle = () => {
    window.location.href = `${API_URL}/auth/google`;
};
