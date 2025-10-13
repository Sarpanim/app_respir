import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { HomepageSection } from '../types';

// Import section components
import NewReleasesSection from './homepage/NewReleasesSection';
import CategorySection from './homepage/CategorySection';
import AmbienceSection from './homepage/AmbienceSection';
import CourseGrid from './CourseGrid';
import QuoteSection from './homepage/QuoteSection';
import HomepageSlider from './homepage/HomepageSlider'; // ✅ nouveau composant dynamique
import ImageTextSection from './homepage/ImageTextSection';
import ReviewsSection from './homepage/ReviewsSection';
import MentorsSection from './homepage/MentorsSection';

const HomepageView: React.FC = () => {
  const { generalSettings } = useAppContext();

  const sortedSections = useMemo(() => {
    return generalSettings.homepageSections
      .filter(section => section.enabled)
      .sort((a, b) => a.position - b.position);
  }, [generalSettings.homepageSections]);

  const isVisible = (section: HomepageSection) => true;

  const getVisibilityClasses = (enabledFor: 'mobile' | 'desktop' | 'both') => {
    if (enabledFor === 'mobile') return 'block md:hidden';
    if (enabledFor === 'desktop') return 'hidden md:block';
    return 'block';
  };

  const renderSection = (section: HomepageSection) => {
    switch (section.type) {
      case 'new-releases':
        return <NewReleasesSection />;
      case 'category':
        return <CategorySection />;
      case 'ambience':
        return <AmbienceSection />;
      case 'course-grid':
        return <CourseGrid />;
      case 'quote':
        return <QuoteSection />;
      case 'slider':
        return <HomepageSlider />; // ✅ dynamique via Supabase
      case 'slider2':
        return <HomepageSlider />; // (tu peux dupliquer si tu veux plusieurs sliders)
      case 'slider3':
        return <HomepageSlider />;
      case 'image-text':
        return <ImageTextSection />;
      case 'reviews':
        return <ReviewsSection />;
      case 'mentors':
        return <MentorsSection />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-12">
      {sortedSections.map(section => {
        if (!isVisible(section)) return null;

        // Les sliders n’ont pas besoin de titre
        if (section.type.startsWith('slider')) {
          return (
            <div key={section.id} className={getVisibilityClasses(section.enabledFor)}>
              {renderSection(section)}
            </div>
          );
        }

        return (
          <section key={section.id} className={getVisibilityClasses(section.enabledFor)}>
            <h2 className="text-3xl sm:text-4xl font-elsie font-bold mb-6">{section.title}</h2>
            {renderSection(section)}
          </section>
        );
      })}
    </div>
  );
};

export default HomepageView;
