export interface Event {
    //Todo quitarle ? a name y date 
    _id?:string,
    name: string,
    description?: string,
    location?: string,
    date: Date,
    durationHour?: number,
    durationMinute?: number,
    category?: string,
    programs?: [string],
    relatedLinks?:[string],
    idOrganizer?: string,
    idUsers?: [string],
    idUsersCalendar?:[string],
    status?: boolean,
    photos?: string[];
    currentImgIndex?: number; 
    coordinates?: number[];
}
