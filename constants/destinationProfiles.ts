export interface DestinationProfile {
    profile: string[];
    focus: string[];
}

export const destinationProfiles: Record<string, DestinationProfile> = {
  'Orlando': {
    profile: ['Urban', 'Inland'],
    focus: ['Theme Park Tourism', 'Family Entertainment', 'Conventions'],
  },
  'St. Petersburg': {
    profile: ['Coastal', 'Urban'],
    focus: ['Arts & Culture', 'Beach Tourism', 'Boating'],
  },
  'Anna Maria Island': {
    profile: ['Coastal', 'Island', 'Beach Town'],
    focus: ['Relaxation', 'Beach Tourism', 'Family Vacations'],
  },
  'New Smyrna Beach': {
    profile: ['Coastal', 'Beach Town'],
    focus: ['Surfing', 'Arts Community', 'Boutique Shopping'],
  },
  'St. Pete Beach': {
    profile: ['Coastal', 'Barrier Island'],
    focus: ['Beach Resorts', 'Watersports', 'Family Tourism'],
  },
  'Key West': {
    profile: ['Coastal', 'Island', 'Historic'],
    focus: ['Cultural Tourism', 'Nightlife', 'Watersports', 'Cruises'],
  },
  'Treasure Island': {
    profile: ['Coastal', 'Barrier Island'],
    focus: ['Beach Tourism', 'Family-friendly Activities', 'Retro Motels'],
  },
  'Hawaii': {
    profile: ['Coastal', 'Island', 'Volcanic', 'Archipelago'],
    focus: ['Eco-Tourism', 'Cultural Heritage', 'Beach Resorts', 'Nature'],
  },
};