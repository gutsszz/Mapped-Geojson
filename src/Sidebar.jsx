import { useRef } from 'react';
import { EyeIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import './App.css';

const Sidebar = ({ onGeoJsonUpload, layers, onToggleLayer, onSaveLayer, setSelectedLayerId, onDeleteLayer }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const geojson = JSON.parse(reader.result);
          const fileName = file.name.split('.').slice(0, -1).join('.');
          onGeoJsonUpload(geojson, fileName);
          event.target.value = ''; // Clear file input after upload
        } catch (error) {
          console.error('Invalid GeoJSON file:', error); // Changed alert to console log
        }
      };
      reader.readAsText(file);
    }
  };

  const handleLayerSelect = (event) => {
    setSelectedLayerId(event.target.value);
  };

  return (
    <div className="fixed right-0 top-0 z-20 w-64 h-full bg-white shadow-md border-l border-gray-300 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-300 p-2 bg-gray-100">
        <h3 className="font-semibold text-gray-800 text-sm">Layers</h3>
        <button
          className="text-blue-500 hover:text-blue-600 p-1"
          onClick={() => fileInputRef.current.click()}
        >
          <PlusIcon className="h-5 w-5" />
        </button>
        <input
          type="file"
          accept=".geojson"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>

      {/* Layer List */}
      <div className="flex flex-col p-2 space-y-2 overflow-y-auto flex-grow">
        {layers.length > 0 ? (
          layers.map(layer => (
            <div key={layer.id} className="flex items-center justify-between mb-1 border-b py-1">
              <div className="flex items-center space-x-2">
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => onToggleLayer(layer.id)}
                >
                  <EyeIcon className={`h-5 w-5 ${layer.visible ? '' : 'opacity-50'}`} />
                </button>
                <span className="text-gray-800 text-sm">{layer.name}</span>
              </div>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => onDeleteLayer(layer.id)}
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-center text-sm">No layers uploaded yet</div>
        )}
      </div>

      {/* Layer Selection and Save Button */}
      <div className="flex flex-col p-2 mt-auto">
        <label htmlFor="layer-select" className="text-gray-800 mb-1 text-sm">Select Layer:</label>
        <select
          id="layer-select"
          className="border border-gray-300 rounded p-1 text-sm"
          onChange={handleLayerSelect}
        >
          <option value="">--Select a Layer--</option>
          {layers.map(layer => (
            <option key={layer.id} value={layer.id}>
              {layer.name}
            </option>
          ))}
        </select>
        <button
          className="mt-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 w-full text-sm"
          onClick={onSaveLayer}
          disabled={!layers.some(layer => layer.visible)} // Disable save button if no layers are selected
        >
          Save Layer
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
