import { Role } from "./role";

export class User {
    authenticated: boolean;
    id: number;
    username: string;
    password: string;
    name: string;
    surname: string;
    email: string;
    role: string;
    token?: string;
    avatar_path?: string;
}

