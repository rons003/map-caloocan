import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

export class Resident {
    id: number | undefined;
    first_name: string | undefined;
    middle_name: string | undefined;
    last_name: string | undefined;
    occupation: string | undefined;
    present_address: string | undefined;
    age: number | undefined;
    gender: string | undefined;
    nationality: string | undefined;
    civil_status: string | undefined;
    birth_date: string | undefined;
    contact_no: string | undefined;
    emergency_name: string | undefined;
    emergency_address: string | undefined;
    emergency_contact_no: string | undefined;
    attachment: string | undefined;
    files: any = {}
    id_no: string | undefined;
    info_filename: string | undefined;
}