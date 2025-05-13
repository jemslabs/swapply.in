
type user = {
    id: number;
    name: string;
    email: string;
    password: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}

type loginData= {
    name?: string;
    email: string;
    password: string;
}
export type useAuthType = {
    user: user | null;
    login: (data: loginData) => void
}