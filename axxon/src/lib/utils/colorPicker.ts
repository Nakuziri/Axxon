import knex from '@/lib/db/db';

const fallbackColors = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#22D3EE',
  '#A855F7', '#EAB308', '#4ADE80', '#F43F5E', '#94A3B8',
];

//restricted to only categories and labels tables
export const getAvailableColor = async (table: 'categories' | 'labels', board_id: number,userProvidedColor?: string
): Promise<string> => {
    
    //guard clause for user input
  if (userProvidedColor) return userProvidedColor;

  //query to find all of the used colors
  const usedColors = await knex(table)
    .where({ board_id })
    .select('color');

  //checks existing colors 
  const existingColors = usedColors.map(c => c.color);
  const availableColors = fallbackColors.filter(
    color => !existingColors.includes(color)
  );

  //returns a random color that isn't being used
  return availableColors.length > 0
    ? availableColors[Math.floor(Math.random() * availableColors.length)]
    : '#9CA3AF'; // default to gray
};
