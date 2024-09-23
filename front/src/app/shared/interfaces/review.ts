export interface Review {
    _id?: string;
    idPerson?: string;
    personUserName?: string;
    personPhoto?: string;
    idEvent?:string;
    comment?: string;
    date?: Date;
    status?:Boolean;
}
