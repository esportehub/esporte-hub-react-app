// interfaces/AppUser.ts
import { DecodedToken } from "@/interfaces/DecodedToken";
import axios from 'axios';

export class AppUser {
    uid: string;
    displayName: string;
    birthday: Date | null;
    gender: string;
    document: string;
    about: string;
    imageHash: string;
    isActive: boolean;
    createdAt: Date;
    phone: string;
    name: string;
    middleName: string;
    email: string;
    updatedAt: Date;
    username: string;

    constructor(data: Partial<AppUser> = {}) {
        this.uid = data.uid ?? '';
        this.name = data.name ?? '';
        this.middleName = data.middleName ?? '';
        this.email = data.email ?? '';
        this.document = data.document ?? '';
        this.username = data.username ?? '';
        this.gender = data.gender ?? '';
        this.phone = data.phone ?? '';
        this.about = data.about ?? '';
        this.birthday = data.birthday ? new Date(data.birthday) : null;
        this.isActive = data.isActive ?? true;
        this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
        this.updatedAt = data.updatedAt ? this.parseUpdatedAt(data.updatedAt) : new Date();
        this.imageHash = data.imageHash ?? '';
        this.displayName = data.displayName ?? '';
    }

    private parseUpdatedAt(updatedAt: any): Date {
        // Handle Firebase timestamp format
        if (updatedAt && typeof updatedAt === 'object' && '_seconds' in updatedAt) {
            return new Date(updatedAt._seconds * 1000 + (updatedAt._nanoseconds / 1000000));
        }
        return new Date(updatedAt);
    }

    static fromDecodedToken(decoded: DecodedToken): AppUser {
        return new AppUser({
            uid: decoded.user_id,
            email: decoded.email
            // Outros campos que podem vir do token
        });
    }

    static async fromAPI(userId: string): Promise<AppUser> {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}`);
            if (response.status != 200) {
               throw new Error('Failed to fetch user data');
            } 
            const userData = await response.data;
            return new AppUser(userData);
        } catch (error) {
            console.error('Error fetching user data:', error);
            throw error;
        }
    }

    get fullName(): string {
        return [this.name, this.middleName].filter(Boolean).join(' ');
    }

    get firstName(): string {
        return this.name.trim();
    }
}