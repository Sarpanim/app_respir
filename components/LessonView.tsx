import React from 'react';
import { Lesson } from '../types';

interface LessonViewProps {
  lesson: Lesson;
}

const LessonView: React.FC<LessonViewProps> = ({ lesson }) => {
  return (
    <div>
      <h2>{lesson.title}</h2>
      <p>Duration: {Math.floor(lesson.duration / 60)} minutes</p>
      {/* This component is a placeholder to resolve build errors.
          The main lesson player UI is within Player.tsx. */}
    </div>
  );
};

export default LessonView;
