import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterOutlet, Router } from '@angular/router';

import {
  PoInfoModule,
  PoButtonGroupModule,
  PoButtonGroupItem,
  PoFieldModule,
  PoNotificationService
} from '@po-ui/ng-components';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manipulate_comentario',
  standalone: true,
  imports: [PoInfoModule, PoButtonGroupModule, HttpClientModule, RouterOutlet, PoFieldModule, FormsModule],
  templateUrl: './manipulate_comentario.component.html',
  styleUrl: './manipulate_comentario.component.css',
  providers: [PoNotificationService]
})
export class ManipulateComentarioComponent {
  private idcomentario   : string = "";
  private operation : string = "";

  public observacao : string = "Abaixo revise os campos informados e depois efetive clicando no botão Confirmar";

  //Conteúdo dos campos
  public idComentario : string = "";
  public idPontoTuristico : string = "";
  public nomeAutor : string = "";
  public comentario : string = "";
  public data : string = "";

  //Botões acima dos campos
  public actionButtons: Array<PoButtonGroupItem> = [
    { label: 'Cancelar',  icon: 'po-icon-close', action: this.cancelButton.bind(this) }
  ];

  //Construtor para criar a conexão HTTP e navegação com Router
  constructor(
    private http: HttpClient,
    private router: Router,
    private poNotification: PoNotificationService
  ) {};

  //Na Inicialização da página
  ngOnInit(): void {
   
    this.idComentario   = sessionStorage.getItem('idComentario') ?? '';
    this.idPontoTuristico   = sessionStorage.getItem('idPontoTuristico') ?? '';
    this.operation = sessionStorage.getItem('operation') ?? '';

    //Adiciona no texto de observação qual é a operação usada
    if (this.operation == "3")
      this.observacao += " (Inclusão de Registro)";
    else if (this.operation == "4")
      this.observacao += " (Alteração de Registro)";
    else if (this.operation == "5")
      this.observacao += " (Exclusão de Registro)";
    else if (this.operation == "2")
      this.observacao += " (Visualização de Registro)";

    //Somente vai ter o botão de Confirmar, caso não seja visualização
    if (this.operation != "2")
      this.actionButtons.push({ label: 'Confirmar', icon: 'po-icon-ok',    action: this.confirmButton.bind(this), selected: true });

    //Se não for inclusão, vai buscar os dados
    if (this.operation != "3") {
      //Atualiza os campos na tela
      this.idComentario = this.idComentario;

      //Realiza um Get no Protheus para buscar os campos desse id
      this.http.get<any>('/zWsComentario/get_id?id=' + this.idcomentario, {}).subscribe({
        next: (v) => {
          this.idPontoTuristico = v.idPontoTuristico;
          this.nomeAutor = v.nomeAutor;
          this.comentario = v.comentario;
          this.data = this.formatDate(v.data);
        },
        error: (e) => {
          console.error("Falha buscar os dados: " + e)
        },
        complete: () => {
          console.log('Busca dos dados completa');
        }

      });
    }

    //Define a duração das mensagens (em milissegundos)
    this.poNotification.setDefaultDuration(4000);
  }

  //Botão de Confirmar
  confirmButton() {
    //Monta o Body da requisição
    var httpBody = {
      "idcomentario": this.idcomentario,
      "idPontoTuristico": this.idPontoTuristico,
      "nomeAutor": this.nomeAutor,
      "comentario": this.comentario,
      "data": this.data
    };

    //Se for inclusão
    if (this.operation == "3") {

      //Realiza um Post para incluir no Protheus
      this.http.post<any>('/zWsComentario/new', httpBody, {}).subscribe({
        next: (v) => {
          this.poNotification.success('Comentario incluído com sucesso!');
          this.router.navigate(['/', 'browse']);
        },
        error: (e) => {
          this.poNotification.error('Falha na inclusão!');
          console.error("Falha na gravação: " + e)
        },
        complete: () => {
          console.log('Busca dos dados completa');
        }

      });
    }
    //Senão se for alteração
    else if (this.operation == "4") {
      //Realiza um Put para alterar no Protheus
      this.http.put<any>('/zWsComentario/update?id=' + this.idcomentario, httpBody, {}).subscribe({
        next: (v) => {
          this.poNotification.success('Comentario alterado com sucesso!');
          this.router.navigate(['/', 'browse']);
        },
        error: (e) => {
          this.poNotification.error('Falha na alteração!');
          console.error("Falha na gravação: " + e)
        },
        complete: () => {
          console.log('Busca dos dados completa');
        }

      });
    }
    //Senão se for exclusão
    else if (this.operation == "5") {
      //Realiza um Delete para exclusão no Protheus
      this.http.delete<any>('/zWsComentario/erase?id=' + this.idcomentario, {}).subscribe({
        next: (v) => {
          this.poNotification.success('Comentario excluído com sucesso.');
          this.router.navigate(['/', 'browse']);
        },
        error: (e) => {
          this.poNotification.error('Falha na exclusão.');
          console.error("Falha na gravação: " + e)
        },
        complete: () => {
          console.log('Busca dos dados completa');
        }

      });
    }
  }

  //Botão de Cancelar
  cancelButton() {
    this.router.navigate(['/', 'browse']);
  }

  //Formata a data de YYYYMMDD para YYYY-MM-DD
  formatDate(s: string) {
    s = s.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');
    return s;
  }
}
