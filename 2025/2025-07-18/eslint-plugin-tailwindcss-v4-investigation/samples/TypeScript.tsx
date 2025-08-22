import React, { FC, ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
}

// Test TypeScript component with Tailwind utility functions
const getButtonClasses = (variant: string = 'primary', size: string = 'md', disabled: boolean = false): string => {
  const baseClasses = 'font-semibold rounded focus:outline-none focus:ring-2 transition-colors';
  
  // Test class concatenation patterns
  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-300',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-300', 
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-300'
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses}`.trim();
};

const Button: FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  onClick 
}) => {
  return (
    <button
      className={getButtonClasses(variant, size, disabled)}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// Test complex component with multiple Tailwind patterns
interface CardProps {
  title: string;
  content: string;
  imageUrl?: string;
  tags?: string[];
}

const Card: FC<CardProps> = ({ title, content, imageUrl, tags = [] }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
      {imageUrl && (
        <img 
          className="w-full h-48 object-cover" 
          src={imageUrl} 
          alt={title}
        />
      )}
      
      <div className="px-6 py-4">
        {/* Test heading with responsive text sizes */}
        <h2 className="font-bold text-xl mb-2 text-gray-900 sm:text-2xl md:text-3xl">
          {title}
        </h2>
        
        {/* Test prose styling */}
        <p className="text-gray-700 text-base leading-relaxed">
          {content}
        </p>
      </div>

      {/* Test conditional rendering with Tailwind */}
      {tags.length > 0 && (
        <div className="px-6 pt-4 pb-2">
          {tags.map((tag, index) => (
            <span 
              key={index}
              className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 hover:bg-gray-300 transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Test problematic patterns that should trigger ESLint rules */}
      <div className="p-4 bg-blue-500 bg-red-500">
        Contradicting backgrounds (should be flagged)
      </div>

      <div className="padding-top-4 padding-bottom-4">
        Non-shorthand padding (should be flagged)
      </div>

      <div className="text-[red] bg-[16px]">
        Unnecessary arbitrary values (should be flagged)
      </div>

      {/* Test advanced layout patterns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        <div className="col-span-1 sm:col-span-2 lg:col-span-1 bg-gradient-to-br from-purple-400 to-pink-400 p-4 rounded-lg">
          Complex grid layout
        </div>
      </div>
    </div>
  );
};

// Test component composition with Tailwind
const Dashboard: FC = () => {
  const cardData = [
    {
      title: "Sample Card 1",
      content: "This is a sample card to test Tailwind CSS classes in TypeScript.",
      tags: ["react", "tailwind", "typescript"]
    },
    {
      title: "Sample Card 2", 
      content: "Another card with different styling patterns.",
      tags: ["css", "design"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Test header section */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tailwind TypeScript Test
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Testing various Tailwind CSS patterns in TypeScript components.
          </p>
        </header>

        {/* Test button variations */}
        <section className="mb-8 flex flex-wrap gap-4 justify-center">
          <Button variant="primary" size="sm">Primary Small</Button>
          <Button variant="secondary" size="md">Secondary Medium</Button>
          <Button variant="danger" size="lg">Danger Large</Button>
          <Button variant="primary" disabled>Disabled Button</Button>
        </section>

        {/* Test card grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cardData.map((card, index) => (
            <Card key={index} {...card} />
          ))}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;