import { User } from "./user.model";

export interface Turma {
    id: number;
    nome: string;
    dataInicio: Date;
    dataTermino: Date;
    horario: string;
    professor: User;
}
