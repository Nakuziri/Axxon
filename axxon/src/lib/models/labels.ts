import knex from '@/lib/db/db'
import { LabelBaseData, CreateLabelData } from "./types/labelTypes"
import { dataTagErrorSymbol } from '@tanstack/react-query'

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
}