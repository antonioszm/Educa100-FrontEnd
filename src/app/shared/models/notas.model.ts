import { User } from "./user.model";

export interface Notas {
    id: number;
    professor: User;
    nomeDaMateria: string;
    nomeDaAvaliacao: string;
    dataAvaliacao: Date;
    aluno: User;
    nota: number;
}
