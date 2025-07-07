export type LabelBaseData = {
    id: number
    board_id: number
    name: string
    color: string
};

export type CreateLabelData = Pick<LabelBaseData, 'name' | 'color' | 'board_id'>;
