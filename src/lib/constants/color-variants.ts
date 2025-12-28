export type ColorName = keyof typeof colorVariants;

export const colorVariants = {
    blue: { bg: 'bg-blue-700 hover:bg-blue-600 text-white', color: '#1d4ed8' },
    orange: { bg: 'bg-orange-700 hover:bg-orange-600 text-white', color: '#c2410c' },
    amber: { bg: 'bg-amber-600 hover:bg-amber-500 text-black', color: '#d97706' },
    yellow: { bg: 'bg-yellow-700 hover:bg-yellow-600 text-black', color: '#a16207' },
    emerald: { bg: 'bg-emerald-700 hover:bg-emerald-600 text-white', color: '#047857' },
    teal: { bg: 'bg-teal-700 hover:bg-teal-600 text-white', color: '#0f766e' },
    indigo: { bg: 'bg-indigo-800 hover:bg-indigo-700 text-white', color: '#3730a3' },
    violet: { bg: 'bg-violet-700 hover:bg-violet-600 text-white', color: '#6d28d9' },
    pink: { bg: 'bg-pink-600 hover:bg-pink-500 text-white', color: '#db2777' },
    purple: { bg: 'bg-purple-600 hover:bg-purple-500 text-white', color: '#9333ea' },
    red: { bg: 'bg-red-700 hover:bg-red-600 text-white', color: '#b91c1c' },
    green: { bg: 'bg-green-600 hover:bg-green-500 text-white', color: '#16a34a' },
    lime: { bg: 'bg-lime-600 hover:bg-lime-500 text-black', color: '#65a30d' },
    cyan: { bg: 'bg-cyan-600 hover:bg-cyan-500 text-white', color: '#0891b2' },
    sky: { bg: 'bg-sky-600 hover:bg-sky-500 text-white', color: '#0284c7' },
    rose: { bg: 'bg-rose-700 hover:bg-rose-600 text-white', color: '#be123c' },
    fuchsia: { bg: 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white', color: '#c026d3' },
};
