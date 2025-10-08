import React, { useMemo } from 'react';
import { CATEGORIES } from '../constants';
import CategoryCard from './CategoryCard';
import { useAppContext } from '../context/AppContext';
import { useCourses } from '../context/CourseContext';
import CourseCard from './CourseCard';
import { Category, Course } from '../types';

// Section-specific components
const HeaderSection: React.FC = () => {
    const { generalSettings } = useAppContext();
    const { header } = generalSettings.discoverPageSettings;
    const headerWithImage = header.image.url && header.image.position !== 'none';
    const headerPosition = header.image.position;

    const textAlignClasses: Record<typeof header.textAlign, string> = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
    };
    
    const objectPositionClasses: Record<typeof header.image.objectPosition, string> = {
        top: 'object-top',
        center: 'object-center',
        bottom: 'object-bottom',
    };

    const flexAlignClasses: Record<typeof header.textAlign, string> = {
        left: 'items-start',
        center: 'items-center',
        right: 'items-end',
    }
  
    if (headerPosition === 'background' && headerWithImage) {
        return (
             <div className={`relative rounded-2xl overflow-hidden min-h-[250px] md:min-h-[300px] flex flex-col justify-center p-8 sm:p-12 md:p-16`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20 z-10"></div>
                <img src={header.image.url} alt="En-tête de la page Découvrir" className={`absolute inset-0 w-full h-full object-cover z-0 ${objectPositionClasses[header.image.objectPosition]}`} />
                <div className={`relative z-20 w-full max-w-4xl flex flex-col ${flexAlignClasses[header.textAlign]} ${textAlignClasses[header.textAlign]}`}>
                    <h1 className="text-4xl sm:text-5xl font-elsie font-bold mb-4 text-white" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>{header.title}</h1>
                    <p className="text-gray-100 sm:text-lg max-w-2xl" style={{ textShadow: '0 1px 5px rgba(0,0,0,0.8)' }}>{header.description}</p>
                </div>
            </div>
        );
    }
  
    return (
      <div className={`flex gap-8 items-center ${headerPosition === 'right' ? 'flex-col-reverse md:flex-row-reverse' : 'flex-col md:flex-row'}`}>
        {headerWithImage && (headerPosition === 'left' || headerPosition === 'right') && (
          <div className={`w-full md:w-1/3`}>
            <img 
              src={header.image.url} 
              alt="Découvrir" 
              className={`w-full h-full object-cover rounded-2xl shadow-lg ${objectPositionClasses[header.image.objectPosition]}`}
              style={{ aspectRatio: header.image.ratio.replace(':', '/') }}
            />
          </div>
        )}
        <div className={`flex flex-col ${headerWithImage && (headerPosition === 'left' || headerPosition === 'right') ? 'w-full md:w-2/3' : 'w-full'} ${textAlignClasses[header.textAlign]} ${flexAlignClasses[header.textAlign]}`}>
          <h1 className="text-3xl sm:text-4xl font-elsie font-bold mb-4">{header.title}</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">{header.description}</p>
        </div>
      </div>
    );
};

const CategoriesSection: React.FC = () => {
    const { generalSettings } = useAppContext();
    const { categories } = generalSettings.discoverPageSettings;
    
    const orderedCategories = useMemo(() => {
        return categories.items
            .filter(item => item.enabled)
            .map(item => CATEGORIES.find(c => c.id === item.id))
            .filter((c): c is Category => !!c);
    }, [categories.items]);

    if(orderedCategories.length === 0) return null;

    return (
        <section>
            <h2 className="text-2xl font-elsie font-bold mb-6">{categories.title}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {orderedCategories.map(category => <CategoryCard key={category.id} category={category} />)}
            </div>
        </section>
    );
};

const CourseListSection: React.FC = () => {
    const { generalSettings } = useAppContext();
    const { courses } = useCourses();
    const { courseList } = generalSettings.discoverPageSettings;

    const featuredCourses = useMemo(() => 
        courseList.featuredCourseIds
            .map(id => courses.find(c => c.id === id && c.status === 'Publié'))
            .filter((c): c is Course => !!c),
    [courses, courseList.featuredCourseIds]);

    if (featuredCourses.length === 0) return null;

    return (
        <section>
            <h2 className="text-2xl font-elsie font-bold mb-6">{courseList.title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredCourses.map(course => <CourseCard key={course.id} course={course} />)}
            </div>
        </section>
    );
};

const QuoteSection: React.FC = () => {
    const { generalSettings } = useAppContext();
    const { quote } = generalSettings.discoverPageSettings;
    return (
        <section className="text-center py-8">
            <blockquote className="max-w-2xl mx-auto">
                <p className="text-xl sm:text-2xl font-elsie italic text-gray-700 dark:text-gray-300">
                    "{quote.text}"
                </p>
                <cite className="block font-semibold text-gray-500 dark:text-gray-400 mt-4 not-italic">
                    — {quote.author}
                </cite>
            </blockquote>
        </section>
    );
};


const DiscoverView: React.FC = () => {
  const { generalSettings } = useAppContext();
  const { sections, categories: settingsCategories } = generalSettings.discoverPageSettings;

  const sectionComponents = {
      header: <HeaderSection />,
      categories: <CategoriesSection />,
      'course-list': <CourseListSection />,
      quote: <QuoteSection />,
  };
  
  const orderedSections = useMemo(() => {
    // We create a temporary map for quick lookups
    const settingsMap = new Map(settingsCategories.items.map(item => [item.id, item]));
    // Then filter and map the original CATEGORIES array
    return CATEGORIES
      .map(category => {
        const setting = settingsMap.get(category.id);
        // Return an object that includes the original category and its settings
        return setting ? { ...category, ...setting } : null;
      })
      .filter(item => item && item.enabled) as (Category & { enabled: boolean })[];
  }, [settingsCategories.items]);


  return (
    <div className="animate-fade-in space-y-12">
      {sections.map(section => 
        section.enabled 
        ? <div key={section.id}>{sectionComponents[section.type]}</div>
        : null
      )}
    </div>
  );
};

export default DiscoverView;