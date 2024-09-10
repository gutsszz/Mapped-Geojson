import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa'; // Dropdown arrow icon

const ThemeSelector = ({ onThemeChange }) => {
  const [isOpen, setIsOpen] = useState(false); // Control dropdown open/close state
  const [selectedTheme, setSelectedTheme] = useState('streets-v11'); // Default theme

  const handleChange = (theme) => {
    setSelectedTheme(theme); // Update selected theme
    onThemeChange(theme); // Call parent function to change the map style
    setIsOpen(false); // Close dropdown after selection
  };

  const themes = [
    { value: 'streets-v11', label: 'Streets' },
    { value: 'outdoors-v11', label: 'Outdoors' },
    { value: 'light-v10', label: 'Light' },
    { value: 'dark-v10', label: 'Dark' },
    { value: 'satellite-v9', label: 'Satellite' },
    { value: 'satellite-streets-v11', label: 'Satellite Streets' },
    { value: 'navigation-day-v1', label: 'Navigation Day' },
    { value: 'navigation-night-v1', label: 'Navigation Night' },
  ];

  return (
    <div className="absolute top-2 left-2 z-10">
      {/* Button to toggle the dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 hover:bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg focus:outline-none"
      >
        <FaChevronDown className="w-4 h-4" />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute mt-2 w-48 bg-white rounded-md shadow-lg z-20">
          <ul className="py-2">
            {themes.map((theme) => (
              <li
                key={theme.value}
                onClick={() => handleChange(theme.value)}
                className={`px-4 py-2 text-sm cursor-pointer hover:bg-blue-100 ${
                  selectedTheme === theme.value
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700'
                }`}
              >
                {theme.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
