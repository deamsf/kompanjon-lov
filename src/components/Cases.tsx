import React from 'react';

const cases = [
  {
    title: 'Digital Transformation',
    category: 'Enterprise',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800&h=500',
    description: 'Complete digital transformation for a leading financial institution'
  },
  {
    title: 'E-commerce Evolution',
    category: 'Retail',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=800&h=500',
    description: 'Modernizing the online shopping experience'
  },
  {
    title: 'SaaS Platform Launch',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800&h=500',
    description: 'From concept to successful market launch'
  }
];

const Cases = () => {
  return (
    <section id="cases" className="py-20 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">Success Stories</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cases.map((case_, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg aspect-video cursor-pointer"
            >
              <img
                src={case_.image}
                alt={case_.title}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 p-6">
                  <span className="text-accent text-sm font-medium mb-2 block">
                    {case_.category}
                  </span>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {case_.title}
                  </h3>
                  <p className="text-gray-300">{case_.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Cases;