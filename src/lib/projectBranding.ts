export type ProjectBannerStyle = 'gradient' | 'image';

export interface ProjectBannerGradientOption {
  id: string;
  name: string;
  description: string;
  gradient: string;
  stops: string[];
}

export const DEFAULT_PROJECT_BANNER_GRADIENT = 'sunrise';

export const PROJECT_BANNER_GRADIENTS: ProjectBannerGradientOption[] = [
  {
    id: 'sunrise',
    name: 'Sunrise Ember',
    description: 'Warm orange to taupe fade inspired by EntreHive primaries.',
    gradient: 'linear-gradient(135deg, #F3AC3B 0%, #E79F74 52%, #8A6B53 100%)',
    stops: ['#F3AC3B', '#E79F74', '#8A6B53'],
  },
  {
    id: 'imperial-dusk',
    name: 'Imperial Dusk',
    description: 'Deep imperial red that softens into terracotta and charcoal.',
    gradient: 'linear-gradient(135deg, #770B0B 0%, #E79F74 55%, #36454F 100%)',
    stops: ['#770B0B', '#E79F74', '#36454F'],
  },
  {
    id: 'charcoal-glow',
    name: 'Charcoal Glow',
    description: 'Charcoal and taupe blend with a hint of warm orange.',
    gradient: 'linear-gradient(135deg, #000000 0%, #36454F 45%, #F3AC3B 100%)',
    stops: ['#000000', '#36454F', '#F3AC3B'],
  },
  {
    id: 'midnight-wave',
    name: 'Midnight Wave',
    description: 'Navy blue accented with charcoal and a subtle golden highlight.',
    gradient: 'linear-gradient(135deg, #000080 0%, #36454F 48%, #F3AC3B 100%)',
    stops: ['#000080', '#36454F', '#F3AC3B'],
  },
];

export const getProjectBannerGradient = (id?: string): ProjectBannerGradientOption => {
  return PROJECT_BANNER_GRADIENTS.find((gradient) => gradient.id === id) ||
    PROJECT_BANNER_GRADIENTS.find((gradient) => gradient.id === DEFAULT_PROJECT_BANNER_GRADIENT)!;
};
