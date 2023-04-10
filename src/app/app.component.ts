import { Component } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IVendaReponse } from './models/interfaces';
import { switchMap, tap } from 'rxjs/operators';
import { VendaService } from './venda.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  form: FormGroup = this.fb.group({
    discount: [false],
  });

  vendas: string[] = ['123', '124', '125', '126'];

  venda: string;

  vendaData: IVendaReponse;

  constructor(private fb: FormBuilder, private vendasService: VendaService) {}

  public ngAfterViewInit() {
    this.form
      .get('discount')
      .valueChanges.pipe(
        switchMap((discount) =>
          this.vendasService.getVendas(this.venda, discount)
        ),
        tap(console.log)
      )
      .subscribe((venda) => {
        this.vendaData = venda;
      });
  }

  nextVenda() {
    const index = this.vendas.findIndex((venda) => venda === this.venda);

    if (index === this.vendas.length - 1 || index < 0) {
      this.venda = this.vendas[0];
    } else {
      this.venda = this.vendas[index + 1];
    }

    this.vendasService
      .getVendas(this.venda, this.form.get('discount').value)
      .subscribe((venda) => {
        this.vendaData = venda;
      });
  }

  getDiscount() {
    return (
      Number(this.vendaData.total) -
      this.vendaData?.items.reduce((acc, item) => {
        acc += Number(item.preco);
        return acc;
      }, 0)
    );
  }
}
