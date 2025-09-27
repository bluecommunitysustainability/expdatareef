// constants/teamColors.ts

export interface Theme {
  name: string;
  background: {
    primary: string;
    secondary: string;
    hover: string;
    disabled: string;
  };
  text: {
    primary: string;
    secondary: string;
    link: string;
  };
  ring: {
    primary: string;
  };
  border: {
    primary: string;
  };
}

export const destinationThemes: Record<string, { name: string, hex: string }> = {
  'Orlando': { name: 'orange', hex: '#f97316' },
  'St. Petersburg': { name: 'slate', hex: '#64748b' },
  'Anna Maria Island': { name: 'amber', hex: '#f59e0b' },
  'New Smyrna Beach': { name: 'blue', hex: '#3b82f6' },
  'St. Pete Beach': { name: 'red', hex: '#ef4444' },
  'Key West': { name: 'yellow', hex: '#eab308' },
  'Treasure Island': { name: 'stone', hex: '#78716c' },
  'default': { name: 'teal', hex: '#14b8a6' }
};

export const availableThemes: { name: string; value: string; hex: string }[] = [
    { name: 'Teal', value: 'teal', hex: '#14b8a6' },
    { name: 'Blue', value: 'blue', hex: '#3b82f6' },
    { name: 'Red', value: 'red', hex: '#ef4444' },
    { name: 'Orange', value: 'orange', hex: '#f97316' },
    { name: 'Amber', value: 'amber', hex: '#f59e0b' },
    { name: 'Yellow', value: 'yellow', hex: '#eab308' },
    { name: 'Green', value: 'green', hex: '#22c55e' },
    { name: 'Indigo', value: 'indigo', hex: '#6366f1' },
    { name: 'Purple', value: 'purple', hex: '#8b5cf6' },
    { name: 'Pink', value: 'pink', hex: '#ec4899' },
];


export const generateTheme = (color: string): Theme => {
  return {
    name: color,
    background: {
      primary: `bg-${color}-600`,
      secondary: `bg-${color}-500`,
      hover: `hover:bg-${color}-700`,
      disabled: `disabled:bg-${color}-800`,
    },
    text: {
      primary: `text-${color}-400`,
      secondary: `text-${color}-300`,
      link: `text-${color}-500`,
    },
    ring: {
      primary: `focus:ring-${color}-500`,
    },
    border: {
      primary: `border-${color}-500/30`,
    },
  };
};
