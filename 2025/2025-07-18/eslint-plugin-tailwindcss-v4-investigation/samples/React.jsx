import React, { useState } from 'react';

// Test React component with Tailwind classes
const TailwindTestComponent = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Test dynamic classes */}
      <div className={`p-4 rounded ${isActive ? 'bg-green-500' : 'bg-gray-500'} text-white`}>
        Dynamic background
      </div>

      {/* Test template literals with Tailwind classes */}
      <div className={`
        flex items-center justify-center
        ${'bg-blue-500'} text-white
        px-6 py-3 rounded-lg
        hover:bg-blue-600 transition-colors
      `}>
        Template literal classes
      </div>

      {/* Test class ordering issues */}
      <button 
        className="px-4 bg-red-500 py-2 text-white rounded hover:bg-red-600"
        onClick={() => setIsActive(!isActive)}
      >
        Unordered button classes
      </button>

      {/* Test contradicting classes */}
      <div className="flex block items-center justify-center">
        Contradicting display classes
      </div>

      {/* Test shorthand opportunities */}
      <div className="margin-top-4 margin-bottom-4 margin-left-auto margin-right-auto">
        Should use my-4 mx-auto
      </div>

      {/* Test arbitrary values */}
      <div className="bg-[#ff6600] text-[clamp(1rem,2.5vw,2rem)] p-[calc(1rem+2px)]">
        Complex arbitrary values
      </div>

      {/* Test unnecessary arbitrary values */}
      <div className="text-[red] bg-[blue] p-[16px]">
        Unnecessary arbitrary values
      </div>

      {/* Test Grid and Flexbox */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-purple-500 text-white p-4 rounded">Grid item 1</div>
        <div className="bg-purple-600 text-white p-4 rounded">Grid item 2</div>
        <div className="bg-purple-700 text-white p-4 rounded">Grid item 3</div>
      </div>

      {/* Test animations and transitions */}
      <div className="animate-pulse bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white">
        Animated gradient
      </div>

      {/* Test forms */}
      <form className="space-y-4 mt-8">
        <input 
          type="text" 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter text"
        />
        
        <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
          <option>Option 1</option>
          <option>Option 2</option>
        </select>

        <button 
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default TailwindTestComponent;