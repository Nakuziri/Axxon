export type LabelBaseData = {
    id: number
    board_id: number
    name: string
    color: string
    labels?: LabelBaseData[]
};

export type CreateLabelData = Pick<LabelBaseData, 'name' | 'color' | 'board_id'>;
export type DeleteLabelData = Pick<LabelBaseData,'id'>;
export type UpdateLabelData = Pick<LabelBaseData, 'id'> & Partial<Pick<LabelBaseData, 'name' | 'color'>>;
export type ListAllLabelsData = Pick<LabelBaseData,'board_id'>;
export type GetLabelByNameData = Pick<LabelBaseData, 'board_id' | 'name'>;
export type GetLabelByIdData = Pick<LabelBaseData, 'id'>;