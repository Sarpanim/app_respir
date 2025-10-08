
import React, { useState } from 'react';
import AdminPageLayout from './AdminPageLayout';
import { Course } from '../../types';
import CourseInfoTab from './CourseInfoTab';
import CourseStructureTab from './CourseStructureTab';
import CourseStatsTab from './CourseStatsTab';

interface AdminCourseDetailViewProps {
    course: Course;
    onBack: () => void;
}

const AdminCourseDetailView: React.FC<AdminCourseDetailViewProps> = ({ course, onBack }) => {
    const [activeTab, setActiveTab] = useState('info');

    const TabButton: React.FC<{tabName: string, label: string}> = ({ tabName, label }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors duration-300 ${activeTab === tabName ? 'bg-white/30 dark:bg-black/20 border-b-2 border-accent text-accent' : 'text-gray-500'}`}
        >
            {label}
        </button>
    );

    return (
        <AdminPageLayout title={course.title} onBack={onBack}>
            <div className="flex border-b border-black/10 dark:border-white/10 mb-6">
                <TabButton tabName="info" label="Informations" />
                <TabButton tabName="structure" label="Structure" />
                <TabButton tabName="stats" label="Statistiques" />
            </div>
            <div className="p-4 bg-white/30 dark:bg-black/20 rounded-xl">
                {activeTab === 'info' && <CourseInfoTab course={course} />}
                {activeTab === 'structure' && <CourseStructureTab course={course} />}
                {activeTab === 'stats' && <CourseStatsTab course={course} />}
            </div>
        </AdminPageLayout>
    );
};

export default AdminCourseDetailView;
