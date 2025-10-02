

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

// As per the user's provided code, the access token is hardcoded here.
mapboxgl.accessToken = "pk.eyJ1IjoibGFuZHN1cnZleW9ycyIsImEiOiJjbDU4cWpvYTgyNjNqM2NuenJmcGFycTZ0In0.69FMq1KPuwZs0Btd7-sSnw";

interface MapViewProps {
  height?: string | number;
  onMapLoad?: () => void;
}

export const MapView: React.FC<MapViewProps> = ({ height = '100%', onMapLoad }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (onMapLoad) onMapLoad();
  }, [onMapLoad]);

  useEffect(() => {
    if (map.current || !mapContainer.current) return; // initialize once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/landsurveyors/cmdxseqnc009m01s7f8thbezd",
      center: [-64.85, 18.34], // center between start & end
      zoom: 11
    });

    map.current.on("load", async () => {
      if (!map.current) return;
      const url =
        "https://api.mapbox.com/directions/v5/mapbox/driving/-64.9307,18.3419;-64.7930,18.3317?geometries=geojson&access_token=" +
        mapboxgl.accessToken;

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch directions');
        const data = await response.json();
  
        if (data.routes && data.routes.length > 0) {
            const route = data.routes[0].geometry;
    
            // Add the route as a source
            map.current?.addSource("route", {
              type: "geojson",
              data: {
                type: "Feature",
                properties: {},
                geometry: route
              }
            });
      
            // Add a styled line layer for the route
            map.current?.addLayer({
              id: "route",
              type: "line",
              source: "route",
              layout: {
                "line-join": "round",
                "line-cap": "round"
              },
              paint: {
                "line-color": "#ff8800",
                "line-width": 5
              }
            });
      
            // Add markers for start and end points
            const start = [-64.9307, 18.3419];
            const end = [-64.7930, 18.3317];
      
            // FIX: Cast LngLat array to a tuple [number, number] to satisfy the LngLatLike type.
            new mapboxgl.Marker({ color: "green" }).setLngLat(start as [number, number]).addTo(map.current!);
            // FIX: Cast LngLat array to a tuple [number, number] to satisfy the LngLatLike type.
            new mapboxgl.Marker({ color: "red" }).setLngLat(end as [number, number]).addTo(map.current!);
        }
      } catch (error) {
          console.error("Error fetching Mapbox directions:", error);
      }
    });

    // Clean up on unmount
    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  return (
    <div
      ref={mapContainer}
      style={{ width: "100%", height, borderRadius: "12px", overflow: "hidden" }}
    />
  );
};