import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  id: string;
  email: string;
  role: string;
  exp: number;
};

export const getUserFromToken = (token: string): JwtPayload | null => {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
};
