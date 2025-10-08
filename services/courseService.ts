
import { COURSES } from '../constants';
import { Course } from '../types';

// Simulate an API call
export const getCourses = (): Course[] => {
    // In a real app, this would be an API call, e.g., fetch('/api/courses')
    // For now, we return the mock data directly.
    return COURSES;
};
