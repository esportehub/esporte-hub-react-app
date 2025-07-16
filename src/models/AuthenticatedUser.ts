export class AuthenticatedUser {
    id: string;
    name: string;
    email: string;

    constructor (data: Partial<AuthenticatedUser>) {
        this.id = data.id ?? '';
        this.name = data.name ?? '';
        this.email = data.email ?? '';
    }
}