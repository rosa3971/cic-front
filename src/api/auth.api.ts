import api from "./axiosInstance.ts";
import {jwtDecode} from "jwt-decode";

/**
 * 로컬스토리지 키
 */
export const STORAGE_KEY = "cic.auth";


interface DecodedToken {
    id: number;
    email: string;
    role: string;
    exp: number; // 만료 시각 (초 단위 UNIX timestamp)
}


/**
 * 로그인 요청 (DB 기반)
 */
export const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    return res.data;
};
/**
 * 토큰 가져오기
 */
export function getToken(): string | null {
    return localStorage.getItem(STORAGE_KEY);
}

/**
 * 토큰을 디코딩해서 유저 정보 반환.
 * 토큰이 없거나, 형식이 깨졌거나, 만료됐으면 null role 반환.
 */
export function getUserFromToken(): { role: string | null } {
    const token = getToken();
    if (!token) return { role: null };

    try {
        const decoded = jwtDecode<DecodedToken>(token);

        // 만료 체크
        const now = Date.now() / 1000;
        if (decoded.exp < now) {
            localStorage.removeItem(STORAGE_KEY);
            return { role: null };
        }

        return { role: decoded.role };
    } catch {
        localStorage.removeItem(STORAGE_KEY);
        return { role: null };
    }
}

export function logout() {
    localStorage.removeItem(STORAGE_KEY);
}