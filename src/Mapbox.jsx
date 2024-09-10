import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import './App.css';
import ThemeSelector from './ThemeSwitcher'; // Import the new component

mapboxgl.accessToken = 'pk.eyJ1IjoidGFsaGF3YXFxYXMxNCIsImEiOiJjbHBreHhscWEwMWU4MnFyenU3ODdmeTdsIn0.8IlEgMNGcbx806t363hDJg';

const MapboxMap = ({ layers }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null); 
  const [mapLoaded, setMapLoaded] = useState(false);

  const initializeMap = useCallback(() => {
    if (mapRef.current) return; // Map is already initialized

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11', // Default theme
      center: [0, 0],
      zoom: 1,
      attributionControl: false
    });

    mapRef.current = map;

    map.on('load', () => {
      setMapLoaded(true); // Map is now loaded
    });

    map.on('resize', () => map.resize()); // Handle map resizing on window resize

    return () => map.remove(); // Clean up the map instance on component unmount
  }, []);

  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  const updateMapLayers = useCallback(() => {
    if (!mapLoaded) return;

    const map = mapRef.current;
    if (!map) return;

    // Remove layers not present in the current state
    const currentLayerIds = new Set(layers.map(layer => `geojson-layer-${layer.id}`));
    map.getStyle().layers.forEach(layer => {
      if (layer.id.startsWith('geojson-layer-') && !currentLayerIds.has(layer.id)) {
        map.removeLayer(layer.id);
        map.removeSource(layer.id);
      }
    });

    // Add or update layers based on current state
    let bounds = new mapboxgl.LngLatBounds();
    let hasVisibleLayers = false;

    layers.forEach(layer => {
      const layerId = `geojson-layer-${layer.id}`;
      const source = map.getSource(layerId);

      if (source) {
        source.setData(layer.data);
      } else {
        map.addSource(layerId, {
          type: 'geojson',
          data: layer.data
        });

        map.addLayer({
          id: layerId,
          type: 'circle',
          source: layerId,
          paint: {
            'circle-color': '#FF0000',
            'circle-radius': 5
          }
        });
      }

      map.setLayoutProperty(layerId, 'visibility', layer.visible ? 'visible' : 'none');
      hasVisibleLayers = true;

      // Update bounds to include the layer's features
      const data = layer.data;
      if (data.features) {
        data.features.forEach(feature => {
          if (feature.geometry.type === 'Point') {
            bounds.extend(feature.geometry.coordinates);
          } else if (feature.geometry.type === 'Polygon') {
            feature.geometry.coordinates[0].forEach(coord => bounds.extend(coord));
          } else if (feature.geometry.type === 'MultiPolygon') {
            feature.geometry.coordinates.flat(2).forEach(coord => bounds.extend(coord));
          }
        });
      }
    });

    // Apply zoom based on the presence of layers
    if (hasVisibleLayers) {
      map.fitBounds(bounds, { padding: 20, duration: 1000 });
    } else {
      map.easeTo({
        zoom: 1,
        duration: 1000,
        easing: t => t
      });
    }
  }, [layers, mapLoaded]);

  useEffect(() => {
    updateMapLayers();
  }, [updateMapLayers]);

  const handleThemeChange = (newTheme) => {
    if (mapRef.current) {
      mapRef.current.setStyle(`mapbox://styles/mapbox/${newTheme}`);
    }
  };

  return (
    <div className="relative">
      <div ref={mapContainerRef} className="map-container" />
      <ThemeSelector onThemeChange={handleThemeChange} /> {/* Add the ThemeSelector */}
    </div>
  );
};

export default MapboxMap;
