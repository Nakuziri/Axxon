import knex from '@/lib/db/db'
import { LabelBaseData, CreateLabelData, DeleteLabelData, UpdateLabelData, ListAllLabelsData, GetLabelByNameData, GetLabelByIdData} from "../types/labelTypes"
import { getAvailableColor} from '../utils/colorPicker'

export class Labels {

    //destructure label return data due how insert returns work
    //insert returns in an array or objects without destructure
    static createLabel = async (data: CreateLabelData ): Promise<LabelBaseData> => {
        const trimmedName = data.name.trim();

        //checks for existing colors
        const existing = await knex('labels')
        .where({ board_id: data.board_id, name: trimmedName})
        .first();

        if (existing) {
        throw new Error('A label with this name already exists for this board.');
        }

        const color = data.color || await getAvailableColor('labels', data.board_id);
        // [] prevents the object from being return in an array by destructuring
        const [label] = await knex('labels')
        .insert( {
            board_id: data.board_id,
            name: trimmedName,
            color
        })
        .returning('*');

        return label;
    };

    static deleteLabel = async(data: DeleteLabelData ): Promise<number> => {
        return await knex('labels')
        .where({id: data.id})
        .del();
    };

    static updateLabel = async(data: UpdateLabelData): Promise<LabelBaseData | null> => {
        const {id, ...updateData } = data;

        const [label] = await knex('labels')
        .where({id})
        .update(updateData)
        .returning('*')

        return label || null;    
    };

    static listAllLabelsInBoard = async(data: ListAllLabelsData): Promise<LabelBaseData[]> =>{ 
        return await knex('labels')
        .where({board_id: data.board_id})
        .orderBy('id', 'desc');
    };
    
    static getLabelByName = async(data: GetLabelByNameData): Promise<LabelBaseData | null> => {
        const label = await knex('labels')
        .where({ name: data.name , board_id: data.board_id })
        .first();

        return label || null;
    };

    static getLabelById = async(data: GetLabelByIdData): Promise<LabelBaseData | null> => {
        return await knex('labels').where({id: data.id}).first() || null;
    };
}