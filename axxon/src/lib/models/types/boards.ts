export type BoardBaseData = {
  id: number;
  name: string;
  created_by: number;
  created_at: string;
  updated_at: string;
};

export type BoardCreation = {
    name: string;
    created_by: number;
}

//Setup for future use, Partial allows fields to be optional meaning 
// that not everything needs to be updated
//keeps id required while name is optional
export type UpdateBoard = {
    id: number;
} & Partial<{
    name: string;
}>
