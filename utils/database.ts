import { get, set, del, keys } from 'idb-keyval';
import type { Answers, SectionTimestamps, UserProfile } from '../types';

const DB_PREFIX = 'assessment-';
const USER_PROFILE_PREFIX = 'user-profile-';

interface SavedData {
    answers: Answers;
    timestamps: SectionTimestamps;
}

export const saveDataToDb = (destination: string, answers: Answers, timestamps: SectionTimestamps): Promise<void> => {
    const dataToSave: SavedData = { answers, timestamps };
    return set(DB_PREFIX + destination, dataToSave);
};

export const loadDataFromDb = (destination: string): Promise<SavedData | undefined> => {
    return get<SavedData>(DB_PREFIX + destination);
};

export const deleteDataFromDb = (destination: string): Promise<void> => {
    return del(DB_PREFIX + destination);
};

export const getSavedDestinations = async (): Promise<string[]> => {
    const allKeys = await keys() as string[];
    return allKeys
        .filter(key => typeof key === 'string' && key.startsWith(DB_PREFIX))
        .map(key => (key as string).replace(DB_PREFIX, ''));
};

// --- User Profile Functions ---

export const saveUserProfile = (profile: UserProfile): Promise<void> => {
    return set(USER_PROFILE_PREFIX + profile.email, profile);
};

export const loadUserProfile = (email: string): Promise<UserProfile | undefined> => {
    return get<UserProfile>(USER_PROFILE_PREFIX + email);
};

export const deleteUserProfile = (email: string): Promise<void> => {
    return del(USER_PROFILE_PREFIX + email);
};

export const loadAllUserProfiles = async (): Promise<UserProfile[]> => {
    const allKeys = await keys() as string[];
    const userKeys = allKeys.filter(key => typeof key === 'string' && key.startsWith(USER_PROFILE_PREFIX));
    const profiles = await Promise.all(
        userKeys.map(key => get<UserProfile>(key))
    );
    return profiles.filter((p): p is UserProfile => p !== undefined);
};