export enum TableFilterType {
    dropDown = 1,
    text = 2,
    number = 3,
    multiSelect = 4,
    global,
    date
}

export interface AbstractResponseData {
    id: number;
    nameAr: string;
    nameEn: string;
}