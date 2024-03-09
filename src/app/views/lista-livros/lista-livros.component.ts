import { Item, Livro } from './../../models/interfaces';
import { LivroService } from './../../service/livro.service';
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent implements OnDestroy {

  listaLivros: Livro[];
  livro: Livro;
  campoBusca!: string;
  subscription: Subscription

  constructor(private service: LivroService) { }

  buscarLibros() : void {
    this.subscription = this.service.buscar(this.campoBusca).subscribe(
      {
        next: (items) => {
          this.listaLivros = this.livrosResultadoParaLivros(items)
        },
        error: error => console.log(error),
      });
  }

  livrosResultadoParaLivros(items): Livro[] {
    const livros: Livro[] = []

    items.forEach(item => {
      livros.push(this.livro = {
        title: item.volumeInfo?.title,
        authors: item.volumeInfo?.authors,
        publisher: item.volumeInfo?.publisher,
        publishedDate: item.volumeInfo?.publishedDate,
        description: item.volumeInfo?.description,
        previewLink: item.volumeInfo?.previewLink,
        thumbnail: item.volumeInfo?.imageLinks?.thumbnail
      })
    })

    return livros
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}



