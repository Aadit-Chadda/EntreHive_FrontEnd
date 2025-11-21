'use client';

import { createContext, useContext, ReactNode, useCallback } from 'react';
import { driver, DriveStep, Config } from 'driver.js';
import 'driver.js/dist/driver.css';
import { feedTourSteps, projectsTourSteps, profileTourSteps, projectDetailsTourSteps } from '@/lib/tourSteps';

type TourType = 'feed' | 'projects' | 'profile' | 'project-details';

interface TourContextType {
  startTour: (tourType?: TourType) => void;
  skipTour: (tourType?: TourType) => void;
  startFeedTour: () => void;
  startProjectsTour: () => void;
  startProfileTour: () => void;
  startProjectDetailsTour: () => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

// Separate storage keys for each tour type
const TOUR_STORAGE_KEYS = {
  feed: 'entrehive_feed_tour_completed',
  projects: 'entrehive_projects_tour_completed',
  profile: 'entrehive_profile_tour_completed',
  'project-details': 'entrehive_project_details_tour_completed',
};

export function TourProvider({ children }: { children: ReactNode }) {
  const markTourAsCompleted = useCallback((tourType: TourType = 'feed') => {
    localStorage.setItem(TOUR_STORAGE_KEYS[tourType], 'true');
  }, []);

  const startTour = useCallback((tourType: TourType = 'feed') => {
    // Select appropriate tour steps based on type
    let steps: DriveStep[];
    switch (tourType) {
      case 'projects':
        steps = projectsTourSteps;
        break;
      case 'profile':
        steps = profileTourSteps;
        break;
      case 'project-details':
        steps = projectDetailsTourSteps;
        break;
      case 'feed':
      default:
        steps = feedTourSteps;
        break;
    }

    const driverConfig: Config = {
      showProgress: true,
      steps,
      progressText: '{{current}} of {{total}}',
      nextBtnText: 'Next →',
      prevBtnText: '← Back',
      doneBtnText: 'Get Started!',
      smoothScroll: true,
      animate: true,
      stagePadding: 5,
      allowClose: true,
      disableActiveInteraction: false,
      onDestroyStarted: () => {
        markTourAsCompleted(tourType);
        driverObj.destroy();
      },
      onDestroyed: () => {
        markTourAsCompleted(tourType);
      },
      onHighlightStarted: () => {
        // Small delay to ensure smooth transitions
        return new Promise(resolve => setTimeout(resolve, 100));
      },
    };

    const driverObj = driver(driverConfig);
    driverObj.drive();
  }, [markTourAsCompleted]);

  const skipTour = useCallback((tourType: TourType = 'feed') => {
    markTourAsCompleted(tourType);
  }, [markTourAsCompleted]);

  const startFeedTour = useCallback(() => startTour('feed'), [startTour]);
  const startProjectsTour = useCallback(() => startTour('projects'), [startTour]);
  const startProfileTour = useCallback(() => startTour('profile'), [startTour]);
  const startProjectDetailsTour = useCallback(() => startTour('project-details'), [startTour]);

  return (
    <TourContext.Provider value={{
      startTour,
      skipTour,
      startFeedTour,
      startProjectsTour,
      startProfileTour,
      startProjectDetailsTour
    }}>
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
}

export function shouldShowTour(tourType: TourType = 'feed'): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(TOUR_STORAGE_KEYS[tourType]) !== 'true';
}
