import { Item, LivrosResultado } from './../../models/interfaces';
import { LivroService } from './../../service/livro.service';
import { Component } from '@angular/core';
import { Subscription, switchMap, map, filter, debounceTime, tap, distinctUntilChanged, catchError, throwError, EMPTY, of } from 'rxjs';
import { LivroColumeInfo } from 'src/app/models/livro-volume-info';
import { FormControl } from '@angular/forms';

const PAUSA = 300;

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent {

  campoBusca = new FormControl();
  subscription: Subscription;
  mensagemErro!: string;
  livrosResultado: LivrosResultado;

  constructor(private service: LivroService) { }

  livrosEncontrados$ = this.campoBusca.valueChanges
  .pipe(
    debounceTime(PAUSA),
    filter((valorDigitado) => valorDigitado.length >= 3),
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    map(resultado => this.livrosResultado = resultado),
    tap((retornoAPI) => console.log(retornoAPI)),
    map(resultado => resultado.items ?? []),
    map((items) => this.livrosResultadoParaLivros(items)),
    catchError((erro) => {
      console.log(erro)
      return throwError(() => new Error(this.mensagemErro ='Ops, ocorreu um erro. Recarregue a aplicação!'))
    })
  )

  livrosResultadoParaLivros(items: Item[]): LivroColumeInfo[] {
    return items.map(item => {
      return new LivroColumeInfo(item);
    })
  }
}

// switchMap - Operador de Transformação. Cancela requisições de observables anteriores,
// emitindo valores apenas do Observable projetado mais recentemente.

// filter - Operador de filtragem. Filtra os itens emitidos pelo Observable de origem,
// permitindo apenas aqueles que satisfaçam uma condição especificada.

// debounceTime - Operador de filtragem. Retorna um Observable que atrasa as emissões do
// Observable de origem pelo tempo especificado.

// distinctUntilChanged - Operador de filtragem. Retorna um Observable que emite todos os
// valores enviados pelo observable de origem se forem distintos em comparação com o último
// valor emitido pelo observable de resultado.

// catchError - Operador de Tratamento de Erros. Captura erros no observable manipulado retornando um novo
// observable ou lançando um erro.

// throwError - Operador de Criação. Cria um observable que criará uma instância de erro e a enviará ao
// consumidor como um erro imediatamente após a assinatura.

// EMPTY - Operador de Criação. Cria um Observable simples que não emite itens para o Observer e imediatamente
// emite uma notificação de complete.

// of - Operador de Criação. Converte os argumentos em observable. Um Observable que emite os argumentos descritos
// e depois conclui.
