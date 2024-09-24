import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterOutlet, Router } from '@angular/router';

import {
  PoInfoModule,
  PoTableModule,
  PoSearchModule,
  PoTableColumn,
  PoTagType,
  PoTableAction,
  PoButtonGroupModule,
  PoButtonGroupItem,
} from '@po-ui/ng-components';

@Component({
  selector: 'app-comentario',
  standalone: true,
  imports: [PoInfoModule, HttpClientModule, PoTableModule, PoSearchModule, PoButtonGroupModule, RouterOutlet],
  templateUrl: './comentario.component.html',
  styleUrl: './comentario.component.css'
})
export class ComentarioComponent {

  //Variáveis que irão definir as colunas e os dados
  public lsColumns: Array<PoTableColumn> = [];
  public lsComentarios: Array<any> = [];
  public actions: Array<PoTableAction> = [];

  //Botões acima da tabela
  public topButtons: Array<PoButtonGroupItem> = [
    { label: 'Incluir Registro', icon: 'po-icon-plus-circle', action: this.newButton.bind(this) }
  ];

  //Construtor para criar a conexão HTTP e navegação com Router
  constructor(
    private http: HttpClient,
    private router: Router
  ) {};

  //Na Inicialização da página
  ngOnInit(): void {

    //Aciona para buscar as colunas e os conteúdos delas
    this.lsColumns      = this.getColumns();
    this.lsComentarios  = this.getItems();
    this.actions        = this.getActions();

    //Cria na SESSION o código do grupo e a operação
    sessionStorage.setItem("idComentario",   "");
	sessionStorage.setItem("idPontoTuristico",   "");
    sessionStorage.setItem("operation", "");
  }

  //Busca as informações das colunas
  getColumns(): Array<PoTableColumn> {
    return [
      { property: 'idComentario' },
      { property: 'idPontoTuristico' },
      { property: 'nomeAutor' },
	  { property: 'dataInclusao' },
	  { property: 'comentario' }
    ];
  }

  //Busca as informações via API
  getItems(): Array<any> {
    var itemsRequest: Array<any> = [];
    
    //Realiza um Get no Protheus para buscar os dados
    this.http.get<any>('/zWsComentario/get_all?limit=100', {}).subscribe({
      next: (v) => {

        //Percorre os objetos e vem adicionando no array
        for(var index in v.objects) {

          itemsRequest.push(
            {
			idComentario: v.objects[index].idComentario,
			idPontoTuristico: v.objects[index].idPontoTuristico,
			nomeAutor: v.objects[index].nomeAutor,
			dataInclusao: v.objects[index].dataInclusao,
			comentario: v.objects[index].comentario
            }
          );

        }
        
      },
      error: (e) => {
        itemsRequest = [];
        console.error("Falha ao buscar os dados: " + e)
      },
      complete: () => {
        console.log('Busca dos dados completa');
      }

    });

    return itemsRequest;
  }

  //Botões na tabela
  getActions(): Array<PoTableAction> {
    return [
      { label:"Visualizar", icon: "po-icon-eye",    action: this.viewButton.bind(this) },
      { label:"Alterar",    icon: "po-icon-change", action: this.editButton.bind(this) },
      { label:"Excluir",    icon: "po-icon-delete", action: this.deleteButton.bind(this), type: "danger" }
    ]
  }

  //Ação ao clicar no Incluir
  newButton() {
     //Atualiza a SESSION e aciona a tela de manipulação
    sessionStorage.setItem("idComentario",   "");
	sessionStorage.setItem("idPontoTuristico",   "");
	sessionStorage.setItem("operation", "3");
    this.router.navigate(['/', 'manipulate']);
  }

  //Ação ao clicar no Visualizar
  viewButton(objectParam:any) {
    var grupoId = objectParam.grupo;

    //Atualiza a SESSION e aciona a tela de manipulação
    sessionStorage.setItem("idComentario",   idComentario);
	sessionStorage.setItem("idPontoTuristico",   idPontoTuristico);
    sessionStorage.setItem("operation", "2");
    this.router.navigate(['/', 'manipulate']);
  }

  //Ação ao clicar no Alterar
  editButton(objectParam:any) {
    var grupoId = objectParam.grupo;

	//Atualiza a SESSION e aciona a tela de manipulação
    sessionStorage.setItem("idComentario",   idComentario);
	sessionStorage.setItem("idPontoTuristico",   idPontoTuristico);
    sessionStorage.setItem("operation", "4");
    this.router.navigate(['/', 'manipulate']);
  }

  //Ação ao clicar no Excluir
  deleteButton(objectParam:any) {
    var grupoId = objectParam.grupo;

    //Atualiza a SESSION e aciona a tela de manipulação
    sessionStorage.setItem("idComentario",   idComentario);
	sessionStorage.setItem("idPontoTuristico",   idPontoTuristico);
    sessionStorage.setItem("operation", "5");
    this.router.navigate(['/', 'manipulate']);
  }

}
