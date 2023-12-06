import { Usuario } from "../entities/auth.entity";

export interface ListResponse{
    usuarios: Usuario[],
    token: string
}