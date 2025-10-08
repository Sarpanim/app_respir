
import React from 'react';
import { Course } from '../../types';
import { PencilIcon, TrashIcon, PlusIcon } from '../Icons';

const CourseStructureTab: React.FC<{ course: Course }> = ({ course }) => {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">Structure du Cours</h3>
                <button className="flex items-center gap-1 text-sm bg-accent text-white px-3 py-1 rounded-lg"><PlusIcon className="w-4 h-4" /> Ajouter une section</button>
            </div>
            {course.sections.map(section => (
                <div key={section.id} className="bg-black/5 dark:bg-white/5 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">{section.title}</h4>
                        <div>
                            <button className="p-1"><PencilIcon className="w-4 h-4" /></button>
                            <button className="p-1"><TrashIcon className="w-4 h-4 text-red-500" /></button>
                        </div>
                    </div>
                    <ul className="space-y-1 pl-4">
                        {section.lessons.map(lesson => (
                             <li key={lesson.id} className="text-sm flex justify-between items-center">
                                <span>{lesson.title} ({Math.floor(lesson.duration/60)} min)</span>
                                <div>
                                    <button className="p-1"><PencilIcon className="w-4 h-4" /></button>
                                    <button className="p-1"><TrashIcon className="w-4 h-4 text-red-500" /></button>
                                </div>
                            </li>
                        ))}
                    </ul>
                     <button className="text-xs text-accent mt-2 flex items-center gap-1"><PlusIcon className="w-3 h-3"/> Ajouter une leçon</button>
                </div>
            ))}
        </div>
    );
};

export default CourseStructureTab;
