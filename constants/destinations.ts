// constants/destinations.ts

export interface Destination {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  zoom: number;
  color?: string;
  backgroundImage?: string; // base64 data URL for AI-generated image
}

export const destinationObjects: Destination[] = [
  { id: 1, name: "Orlando", latitude: 28.5383, longitude: -81.3792, zoom: 10 },
  { id: 2, name: "St. Petersburg", latitude: 27.7676, longitude: -82.6403, zoom: 11 },
  { id: 3, name: "Anna Maria Island", latitude: 27.5028, longitude: -82.7232, zoom: 12 },
  { id: 4, name: "New Smyrna Beach", latitude: 29.0258, longitude: -80.9270, zoom: 11 },
  { id: 5, name: "St. Pete Beach", latitude: 27.7253, longitude: -82.7412, zoom: 12 },
  { id: 6, name: "Key West", latitude: 24.5551, longitude: -81.7800, zoom: 12 },
  { id: 7, name: "Treasure Island", latitude: 27.7659, longitude: -82.7668, zoom: 13 },
  { id: 8, name: "Hawaii", latitude: 21.3069, longitude: -157.8583, zoom: 7 },
  { id: 9, name: "St. John, USVI", latitude: 18.3325, longitude: -64.7931, zoom: 12 },
];

export const destinations: string[] = destinationObjects.map(d => d.name);