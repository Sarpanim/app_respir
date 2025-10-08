import React from 'react';
import { Course } from '../../types';

const CourseInfoTab: React.FC<{ course: Course }> = ({ course }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold">Informations Générales</h3>
            <p><span className="font-semibold">Description:</span> {course.description}</p>
            <p><span className="font-semibold">Niveau:</span> {course.level}</p>
            <p><span className="font-semibold">Premium:</span> {course.requiredPlan !== 'free' ? 'Oui' : 'Non'}</p>
        </div>
    );
};

export default CourseInfoTab;