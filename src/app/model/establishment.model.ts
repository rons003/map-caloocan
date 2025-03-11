import { Resident } from "./resident.model";

export class Establishment {
    id: number | undefined;
    code: string = '';
    block: string = '';
    address: string = '';
    type: string = '';
    residents: Resident[] = [];
    coordinates: any[] = [];
    image: string  = '';
}