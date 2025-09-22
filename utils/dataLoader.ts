// This file contains unused code and is deprecated.
import type { Answers } from '../types';

export const loadDataFromFile = (file: File): Promise<{destination: string, answers: Answers}> => {
    return Promise.reject(new Error("This function is deprecated."));
};

export {};
