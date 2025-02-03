import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ServiceDescription {
  keyword: string;
  details: string;
}

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: ServiceDescription[];
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-secondary/20 p-8 rounded-lg">
      <div className="flex justify-center mb-8">
        <div className="p-4 rounded-full bg-tertiary/10">
          <Icon className="w-8 h-8 text-highlight stroke-1" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-white mb-4 text-center">{title}</h3>
      <ul className="space-y-4">
        {description.map((item, index) => (
          <li 
            key={index} 
            className="text-gray-300 flex items-start"
          >
            <span className="text-tertiary mr-2">•</span>
            <span>{item.keyword}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServiceCard;