import { Turma } from "./turma.model";

export interface User {
    id: number;
    nomeCompleto: string;
    email?: string;
    senha: string;
    papel: string;
    genero: string;
    dataDeNascimento: Date;
    cpf: string;
    rg: string;
    telefone: string;
    naturalidade: string;
    endereco: Endereco;
    turmas: Turma[];
    materias: string;
}
export interface Endereco {
    cep: string;
    cidade: string;
    estado: string;
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    pontoDeReferencia: string;
}