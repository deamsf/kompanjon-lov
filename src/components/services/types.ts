export interface ServiceDetail {
  title: string;
  description: string;
}

export interface Service {
  id: string;
  title: string;
  subtitle: string;
  icon: 'Search' | 'Crown' | 'Sparkles';
  description: string;
  details: ServiceDetail[];
}

export interface ServiceCardProps extends Service {
  isActive: boolean;
  isLast: boolean;
  onClick: () => void;
}

export interface ServiceDetailsProps {
  details: ServiceDetail[];
  isVisible: boolean;
  isLastInSection?: boolean;
  sectionTitle: string;
}