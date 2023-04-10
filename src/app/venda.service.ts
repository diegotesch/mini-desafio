import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { IClient, IItem, IVendaReponse, IVendas } from './models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class VendaService {
  getVendas(idVenda: string, discount?: boolean): Observable<IVendaReponse> {
    return this.getVendaById(idVenda).pipe(
      switchMap((venda) =>
        forkJoin([of(venda), this.getClientById(venda.clientId)])
      ),
      map(([venda, client]) => ({
        ...venda,
        clientName: client.nome,
      })),
      switchMap((venda) => {
        const { items: itemsId } = venda;

        const items$ = forkJoin(itemsId.map((item) => this.getItemById(item)));

        return forkJoin([of(venda), items$]);
      }),
      map(([venda, itemsAll]) => {
        const { items: itemsVenda, ...vendaNew } = venda;

        const items = itemsVenda.map((item) =>
          itemsAll.find(({ id }) => id === item)
        );

        const total = items.reduce((acc, item) => {
          if (discount && item.desconto) {
            acc += Number(item.preco) * (1 - Number(item.desconto) / 100);
          } else {
            acc += Number(item.preco);
          }
          return acc;
        }, 0);

        return {
          ...vendaNew,
          items,
          total,
        };
      })
    );
  }

  private getVendaById(id: string): Observable<IVendas> {
    const vendas: IVendas[] = [
      {
        id: '123',
        clientId: '123',
        items: ['1', '2'],
      },
      {
        id: '124',
        clientId: '122',
        items: ['1', '3'],
      },
      {
        id: '125',
        clientId: '121',
        items: ['4', '2'],
      },
      {
        id: '126',
        clientId: '122',
        items: ['4', '3'],
      },
    ];

    return of(vendas.find((venda) => venda.id === id));
  }

  private getClientById(id: string): Observable<IClient> {
    const clients: IClient[] = [
      {
        id: '121',
        nome: 'fulano',
        documento: 'XX44',
      },
      {
        id: '122',
        nome: 'ciclano',
        documento: 'XX84',
      },
      {
        id: '123',
        nome: 'beltrano',
        documento: 'XX48',
      },
    ];

    return of(clients.find((client) => client.id === id));
  }

  private getItemById(id: string): Observable<IItem> {
    const items: IItem[] = [
      {
        id: '1',
        nome: 'batata',
        preco: '2.50',
        desconto: '5', //porcentagem
      },
      {
        id: '2',
        nome: 'arroz',
        preco: '10.49',
      },
      {
        id: '3',
        nome: 'sabao em po',
        preco: '22.89',
        desconto: '2', //porcentagem
      },
      {
        id: '4',
        nome: 'cafe',
        preco: '8.90',
      },
    ];

    return of(items.find((item) => item.id === id));
  }
}
