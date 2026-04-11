export interface AdminAccount {
    _id: string;
    username: string;
    createdAt: string;
    updatedAt: string;
}
export interface CustomerAccount {
    _id: string;
    email: string;
    fullname: string;
    birthday?: string;
    phone?: string;
    address?: string; 
    loyaltyPoints?: number;
    totalSpent?: number;
    totalOrders?: number;
}

export interface AuthState {
    loading: boolean,
    accessToken: null | string;
    admin: AdminAccount | null;
    customer: CustomerAccount | null;
    clearSession: () => void;
    adminLogin: (username:string, password: string) => Promise<boolean>;
    fetchProfile: () => Promise<void>;
    logout: () => Promise<void>;
}