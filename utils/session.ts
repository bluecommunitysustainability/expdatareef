const CURRENT_USER_KEY = 'currentUserEmail';

export const getCurrentUserEmail = (): string | null => {
    return localStorage.getItem(CURRENT_USER_KEY);
};

export const setCurrentUserEmail = (email: string | null) => {
    if (email) {
        localStorage.setItem(CURRENT_USER_KEY, email);
    } else {
        localStorage.removeItem(CURRENT_USER_KEY);
    }
};
