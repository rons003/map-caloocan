import { Resident } from "./resident.model";

export class Establishment {
    id: number | undefined;
    code: string | undefined;
    block: string | undefined;
    address: string | undefined;
    type: string | undefined;
    residents: Resident[] | undefined;
    coordinates: any[] | undefined;
    image: string  = '';
}