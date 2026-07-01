const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
        this.name = "ApiError";
    }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    let res: Response;
    try {
        res = await fetch(`${API_URL}${path}`, {
            headers: { "Content-Type": "application/json" },
            ...options,
        });
    } catch {
        throw new ApiError(
            `Não foi possível conectar ao backend em ${API_URL}. Verifique se ele está rodando.`,
            0
        );
    }

    if (!res.ok) {
        let msg = `Erro ${res.status} ao chamar ${path}`;
        try {
            const body = await res.json();
            msg = body.message || body.error || msg;
        } catch {
            /* corpo vazio ou não-JSON, mantém msg padrão */
        }
        throw new ApiError(msg, res.status);
    }

    if (res.status === 204) return undefined as T;

    const text = await res.text();
    return (text ? JSON.parse(text) : undefined) as T;
}

const get = <T>(path: string) => request<T>(path);
const post = <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) });
const put = <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) });
const patch = <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) });
const del = <T>(path: string) => request<T>(path, { method: "DELETE" });

/* ──────────────────────────  Tipos (DTOs)  ────────────────────────── */

export type Residencia = {
    id: number;
    nome: string;
    endereco: string;
    cep: string;
    telefone: string;
    email: string;
    cor: string;
    totalQuartos: number;
    disponiveis: number;
    ocupados: number;
};

export type ResidenciaRequest = {
    nome: string;
    endereco?: string;
    cep?: string;
    telefone?: string;
    email?: string;
    cor?: string;
};

export type ComodidadeQuarto = { nome: string; inclusa: boolean };

export type Quarto = {
    id: number;
    nome: string;
    tipo: "Individual" | "Duplo" | "Familia";
    residenciaId: number;
    residencia: string;
    valorBase: number;
    preco: number;
    precoFormatado: string;
    status: "disponivel" | "ocupado";
    comodidades: ComodidadeQuarto[];
    descricao: string;
    cor: string;
};

export type QuartoRequest = {
    nome: string;
    tipo: "Individual" | "Duplo" | "Familia";
    valorBase: number;
    status?: string;
    cor?: string;
    residenciaId: number;
    comodidadeIds?: number[];
};

export type Comodidade = {
    id: number;
    nome: string;
    preco: number;
    precoFormatado: string;
};

export type ComodidadeRequest = { nome: string; preco: number };

export type Cliente = {
    id: number;
    nome: string;
    cpf: string;
    email: string;
    telefone: string;
    endereco: string;
    ultimaHospedagem: string;
    statusTipo: "ativo" | "data" | "reserva";
};

export type ClienteRequest = {
    nome: string;
    cpf: string;
    email: string;
    telefone?: string;
    endereco?: string;
};

export type Aluguel = {
    id: number;
    clienteId: number;
    cliente: string;
    residenciaId: number;
    residencia: string;
    quartoId: number;
    quarto: string;
    entrada: string; // "dd/MM HH:mm"
    saida: string; // "dd/MM HH:mm"
    diarias: number;
    valorFinal: string;
    status: "reserva" | "ocupado" | "concluido";
    acaoLabel: "Ver" | "Recibo";
};

export type AluguelRequest = {
    clienteId: number;
    quartoId: number;
    entrada: string; // ISO LocalDateTime, ex: 2026-04-17T12:00:00
    saida: string;
    status?: string;
};

export type HistoricoCliente = { cliente: Cliente; historico: Aluguel[] };

export type DashboardResumo = {
    totalResidencias: number;
    totalQuartos: number;
    quartosDisponiveis: number;
    quartosOcupados: number;
    totalClientes: number;
    reservasAtivas: number;
    estadiasEmAndamento: number;
    estadiasConcluidas: number;
    receitaTotal: string;
    receitaTotalReservas: string;
    ultimasReservas: Aluguel[];
};

export type Recibo = {
    id: number;
    aluguelId: number;
    numero: string;
    emitidoEm: string;
    hospede: { nome: string; cpf: string; email: string };
    acomodacao: { nome: string; endereco: string };
    entrada: string;
    entradaHora: string;
    saida: string;
    saidaHora: string;
    diarias: number;
    itens: { label: string; valor: string }[];
    totalFinal: string;
    formaPagamento: string;
};

/* ──────────────────────────  Endpoints  ────────────────────────── */

export const api = {
    residencias: {
        listar: () => get<Residencia[]>("/api/residencias"),
        buscar: (id: number) => get<Residencia>(`/api/residencias/${id}`),
        criar: (req: ResidenciaRequest) => post<Residencia>("/api/residencias", req),
        atualizar: (id: number, req: ResidenciaRequest) =>
            put<Residencia>(`/api/residencias/${id}`, req),
        deletar: (id: number) => del<void>(`/api/residencias/${id}`),
    },

    quartos: {
        listar: (residencia?: string, tipo?: string) => {
            const params = new URLSearchParams();
            if (residencia && residencia !== "Todas") params.set("residencia", residencia);
            if (tipo && tipo !== "Todos") params.set("tipo", tipo);
            const qs = params.toString();
            return get<Quarto[]>(`/api/quartos${qs ? `?${qs}` : ""}`);
        },
        buscar: (id: number) => get<Quarto>(`/api/quartos/${id}`),
        criar: (req: QuartoRequest) => post<Quarto>("/api/quartos", req),
        atualizar: (id: number, req: QuartoRequest) => put<Quarto>(`/api/quartos/${id}`, req),
        deletar: (id: number) => del<void>(`/api/quartos/${id}`),
    },

    comodidades: {
        listar: () => get<Comodidade[]>("/api/comodidades"),
        criar: (req: ComodidadeRequest) => post<Comodidade>("/api/comodidades", req),
        atualizar: (id: number, req: ComodidadeRequest) =>
            put<Comodidade>(`/api/comodidades/${id}`, req),
        deletar: (id: number) => del<void>(`/api/comodidades/${id}`),
    },

    clientes: {
        listar: () => get<Cliente[]>("/api/clientes"),
        buscar: (id: number) => get<Cliente>(`/api/clientes/${id}`),
        historico: (id: number) => get<HistoricoCliente>(`/api/clientes/${id}/historico`),
        criar: (req: ClienteRequest) => post<Cliente>("/api/clientes", req),
        atualizar: (id: number, req: ClienteRequest) => put<Cliente>(`/api/clientes/${id}`, req),
        deletar: (id: number) => del<void>(`/api/clientes/${id}`),
    },

    alugueis: {
        listar: (residencia?: string) => {
            const qs = residencia && residencia !== "Todas" ? `?residencia=${encodeURIComponent(residencia)}` : "";
            return get<Aluguel[]>(`/api/alugueis${qs}`);
        },
        buscar: (id: number) => get<Aluguel>(`/api/alugueis/${id}`),
        criar: (req: AluguelRequest) => post<Aluguel>("/api/alugueis", req),
        atualizar: (id: number, req: AluguelRequest) => put<Aluguel>(`/api/alugueis/${id}`, req),
        atualizarStatus: (id: number, status: string) =>
            patch<Aluguel>(`/api/alugueis/${id}/status`, { status }),
        cancelar: (id: number) => del<void>(`/api/alugueis/${id}`),
    },

    recibos: {
        porAluguel: (aluguelId: number, formaPagamento?: string) => {
            const qs = formaPagamento ? `?formaPagamento=${encodeURIComponent(formaPagamento)}` : "";
            return get<Recibo>(`/api/alugueis/${aluguelId}/recibo${qs}`);
        },
        buscar: (id: number) => get<Recibo>(`/api/recibos/${id}`),
        atualizarPagamento: (id: number, formaPagamento: string) =>
            patch<Recibo>(`/api/recibos/${id}/pagamento`, { formaPagamento }),
        enviarEmail: (id: number) => post<void>(`/api/recibos/${id}/enviar-email`, {}),
    },

    dashboard: {
        resumo: () => get<DashboardResumo>("/api/dashboard"),
    },
};