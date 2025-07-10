import knex from '@/lib/db/db'
import { LabelBaseData, CreateLabelData, DeleteLabelData, UpdateLabelData, ListAllLabelsData } from "./types/labelTypes"
import { getAvailableColor} from '../utils/colorPicker'

class Labels {
    id: number
    board_id: number
    name: string
    color: string

    constructor({id, board_id, name, color}: LabelBaseData){
        this.id = id
        this.board_id = board_id
        this.name = name
        this.color = color
    }

    //destructure label return data due how insert returns work
    //insert returns in an array or objects without destructure
    static createLabel = async (data: CreateLabelData ): Promise<LabelBaseData> => {
        const [label] = await knex('labels')
        .insert( {
            board_id: data.board_id,
            name: data.name,
            color: data.color
        })
        .returning('*');

        return label;
    }

    static deleteLabel = async (data: DeleteLabelData ): Promise<number> => {
        return await knex('labels')
        .where({id: data.id})
        .del();
    }

    static updateLabel = async (data: UpdateLabelData): Promise<LabelBaseData | null> => {
        const {id, ...updateData } = data;

        const [label] = await knex('labels')
        .where({id})
        .update(updateData)
        .returning('*')

        return label || null;    
    }

    static listAllLabelsInBoard = async(data: ListAllLabelsData): Promise<LabelBaseData[]> =>{ 
    return await knex('labels')
     .where({board_id: data.board_id})
     .orderBy('id', 'desc');
    }
}