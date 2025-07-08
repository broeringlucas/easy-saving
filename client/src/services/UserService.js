import api from "../api";

export const UserService = {
  fetchUser: async () => {
    const response = await api.get("/users/user");
    return response.data;
  },
  login: async (email, password) => {
    await api.post("/users/login", { email, password });
  },
  register: async (name, birthday, phone, email, password) => {
    const response = await api.post("/users/register", {
      name,
      birthday,
      phone,
      email,
      password,
    });
    return response.data;
  },
  logout: async () => {
    await api.post("/users/logout");
  },
};
