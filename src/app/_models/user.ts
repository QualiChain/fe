import { Role } from "./role";

export default class User {
    authenticated?: boolean;
    id: number;
    userName: string;
    password?: string;
    name: string;
    surname: string;
    email: string;
    role: string;
    token?: string;
    avatar_path?: string;
    university?: string;
    pilotId?: number;
    fullName?: string;
    gender?: string;
    birthDate?: string;
    country?: string;
    city?: string;
    address?: string;
    zipCode?: string;
    mobilePhone?: string;
    homePhone?: string;
    organizations?: string[]
}

