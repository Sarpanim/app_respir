
import React from 'react';
import { Course } from '../../types';

const CourseStatsTab: React.FC<{ course: Course }> = ({ course }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold">Statistiques du Cours</h3>
            <p><span className="font-semibold">Étudiants inscrits:</span> {course.studentCount}</p>
            <p><span className="font-semibold">Note moyenne:</span> {course.rating} / 5</p>
            <p><span className="font-semibold">Nombre d'avis:</span> {course.reviewCount}</p>
        </div>
    );
};

export default CourseStatsTab;
