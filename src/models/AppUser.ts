import { DecodedToken } from "@/interfaces/DecodedToken";

export class AppUser {
    id: string;
    name: string;
    middleName: string;
    email: string;
    document?: string;
    username?: string;
    gender?: string;
    phone?: string;
    about?: string;
    birthday?: Date | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    imageHash?: string;

    constructor(data: Partial<AppUser>) {
        this.id = data.id ?? '';
        this.name = data.name ?? '';
        this.middleName = data.middleName ?? '';
        this.email = data.email ?? '';
        this.document = data.document ?? '';
        this.username = data.username ?? '';
        this.gender = data.gender ?? '';
        this.phone = data.phone ?? '';
        this.about = data.about ?? '';
        this.birthday = data.birthday ?? new Date();
        this.isActive = data.isActive ?? true;
        this.createdAt = data.createdAt ?? new Date();
        this.updatedAt = data.updatedAt ?? new Date();
        this.imageHash = data.imageHash ?? '';
    }

    static fromDecodedToken(decoded: DecodedToken) : AppUser {
        return new AppUser(
            decoded
        )
    }

    get getId(): string {
        return this.id;
    }

    get getFirstName(): string {
        return this.name.trim();
    }

    get fullName(): string {
        return this.getFirstName + " " + this.middleName;
    }

    
}