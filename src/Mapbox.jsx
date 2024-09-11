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

        // Determine the layer type based on the feature's geometry
        const layerType = layer.data.features[0]?.geometry.type;

        if (layerType === 'Point') {
          // Handle Point geometry
          map.addLayer({
            id: layerId,
            type: 'circle',
            source: layerId,
            paint: {
              'circle-color': '#FF0000',
              'circle-radius': 5
            }
          });
        } else if (layerType === 'LineString' || layerType === 'MultiLineString') {
          // Handle LineString and MultiLineString geometry
          map.addLayer({
            id: layerId,
            type: 'line',
            source: layerId,
            paint: {
              'line-color': '#0000FF',
              'line-width': 2
            }
          });
        } else if (layerType === 'Polygon' || layerType === 'MultiPolygon') {
          // Handle Polygon and MultiPolygon geometry
          map.addLayer({
            id: layerId,
            type: 'fill',
            source: layerId,
            paint: {
              'fill-color': '#00FF00',
              'fill-opacity': 0.5
            }
          });
        }
      }

      // Set layer visibility
      map.setLayoutProperty(layerId, 'visibility', layer.visible ? 'visible' : 'none');
      hasVisibleLayers = true;

      // Update bounds to include the layer's features
      const data = layer.data;
      if (data.features) {
        data.features.forEach(feature => {
          const geometryType = feature.geometry.type;
          if (geometryType === 'Point') {
            bounds.extend(feature.geometry.coordinates);
          } else if (geometryType === 'LineString') {
            feature.geometry.coordinates.forEach(coord => bounds.extend(coord));
          } else if (geometryType === 'Polygon' || geometryType === 'MultiPolygon') {
            const coordinates = geometryType === 'Polygon'
              ? feature.geometry.coordinates[0] // Outer boundary of the polygon
              : feature.geometry.coordinates.flat(2); // MultiPolygon flattened coordinates

            coordinates.forEach(coord => bounds.extend(coord));
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
      const map = mapRef.current;

      // Save the current layers and sources
      const existingLayers = layers.map(layer => ({
        id: `geojson-layer-${layer.id}`,
        data: layer.data,
        visible: layer.visible
      }));

      map.setStyle(`mapbox://styles/mapbox/${newTheme}`); // Set the new theme

      // Once the new style is loaded, re-add the layers and sources
      map.once('styledata', () => {
        existingLayers.forEach(layer => {
          if (!map.getSource(layer.id)) {
            map.addSource(layer.id, { type: 'geojson', data: layer.data });

            // Check the geometry type and add the appropriate layer type
            const layerType = layer.data.features[0]?.geometry.type;
            if (layerType === 'Point') {
              map.addLayer({
                id: layer.id,
                type: 'circle',
                source: layer.id,
                paint: {
                  'circle-color': '#FF0000',
                  'circle-radius': 5
                }
              });
            } else if (layerType === 'LineString' || layerType === 'MultiLineString') {
              map.addLayer({
                id: layer.id,
                type: 'line',
                source: layer.id,
                paint: {
                  'line-color': '#0000FF',
                  'line-width': 2
                }
              });
            } else if (layerType === 'Polygon' || layerType === 'MultiPolygon') {
              map.addLayer({
                id: layer.id,
                type: 'fill',
                source: layer.id,
                paint: {
                  'fill-color': '#00FF00',
                  'fill-opacity': 0.5
                }
              });
            }
          }
          map.setLayoutProperty(layer.id, 'visibility', layer.visible ? 'visible' : 'none');
        });
      });
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
