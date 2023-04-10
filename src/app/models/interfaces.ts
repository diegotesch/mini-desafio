export interface IVendas {
  id: string;
  clientId: string;
  clientName?: string;
  items: string[];
}

export interface IItem {
  id: string;
  nome: string;
  preco: string;
  desconto?: string;
}

export interface IClient {
  id: string;
  nome: string;
  documento: string;
}

export interface IVendaReponse {
  id: string;
  clientName: string;
  items: IItem[];
  total?: number;
}
