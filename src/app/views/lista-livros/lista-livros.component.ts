import { Item } from './../../models/interfaces';
import { LivroService } from './../../service/livro.service';
import { Component } from '@angular/core';
import { Subscription, switchMap, map } from 'rxjs';
import { LivroColumeInfo } from 'src/app/models/livro-volume-info';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent {

  campoBusca = new FormControl();
  subscription: Subscription

  constructor(private service: LivroService) { }

  livrosEncontrados$ = this.campoBusca.valueChanges
  .pipe(
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    map(items => this.livrosResultadoParaLivros(items))
  );

  livrosResultadoParaLivros(items: Item[]):  LivroColumeInfo[] {
    return items.map(item => {
      return new LivroColumeInfo(item);
    })
  }
}



