import React, { useEffect, useState } from 'react';
import { supabase } from '../../integrations/supabase';
import SliderSection from './SliderSection';
import { HomepageSlide } from '../../types';

const HomepageSlider: React.FC = () => {
  const [slides, setSlides] = useState<HomepageSlide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      const { data, error } = await supabase
        .from('homepage_slides')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) console.error('Erreur de chargement des slides:', error);
      else setSlides(data || []);
      setLoading(false);
    };

    fetchSlides();
  }, []);

  if (loading) return <div className="h-64 flex items-center justify-center">Chargement...</div>;
  if (!slides.length) return <div className="h-64 flex items-center justify-center">Aucune diapositive</div>;

  return (
    <div className="space-y-8">
      {slides.map((slide) => (
        <SliderSection key={slide.id} slide={slide} />
      ))}
    </div>
  );
};

export default HomepageSlider;
