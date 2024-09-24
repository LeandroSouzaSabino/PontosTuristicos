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
  selector: 'app-pontoturistico',
  standalone: true,
  imports: [PoInfoModule, HttpClientModule, PoTableModule, PoSearchModule, PoButtonGroupModule, RouterOutlet],
  templateUrl: 'pontoturistico./.component.html',
  styleUrl: './pontoturistico.component.css'
})
export class pontoturisticoComponent {

  //Variáveis que irão definir as colunas e os dados
  public lsColumns: Array<PoTableColumn> = [];
  public lsPontoTuristicos: Array<any> = [];
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
    this.lsColumns = this.getColumns();
    this.lsPontoTuristicos   = this.getItems();
    this.actions = this.getActions();

    //Cria na SESSION 
    sessionStorage.setItem("idPontoTuristico",   "");
    sessionStorage.setItem("operation", "");
  }

  //Busca as informações das colunas
  getColumns(): Array<PoTableColumn> {
    return [
      { property: 'idPontoTuristico'},
      { property: 'pais' },
      { property: 'cidade'},
	  { property: 'pontoturistico'},
	  { property: 'estacaoAno'}     
    ];
  }

  //Busca as informações via API
  getItems(): Array<any> {
    var itemsRequest: Array<any> = []
    
    //Realiza um Get no Protheus para buscar os dados
    this.http.get<any>('/zWsPontoTuristico/get_all?limit=100', {}).subscribe({
      next: (v) => {

        //Percorre os objetos e vem adicionando no array
        for(var index in v.objects) {

            itemsRequest.push(
            {
				idPontoTuristico: v.objects[index].idPontoTuristico,
				pais: v.objects[index].pais,
				cidade: v.objects[index].cidade,
				pontoturistico: v.objects[index].pontoturistico,
				estacaoAno: v.objects[index].estacaoAno
            }
          );

        }
        
      },
      error: (e) => {
        itemsRequest = [];
        console.error("Falha buscar os dados: " + e)
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
	  { label:"Comentario", icon: "po-icon-change", action: this.comentarioButton.bind(this) },
      { label:"Excluir",    icon: "po-icon-delete", action: this.deleteButton.bind(this), type: "danger" }
    ]
  }

  //Ação ao clicar no Incluir
  newButton() {
    //console.log("cliquei no Incluir");

    //Atualiza a SESSION e aciona a tela de manipulação
    sessionStorage.setItem("idpontoturistico",   "");
    sessionStorage.setItem("operation", "3");
    this.router.navigate(['/', 'manipulate']);
  }

  //Ação ao clicar no Visualizar
  viewButton(objectParam:any) {
    var idpontoturistico = objectParam.idpontoturistico;


    //Atualiza a SESSION e aciona a tela de manipulação
    sessionStorage.setItem("idpontoturistico",   idpontoturistico);
    sessionStorage.setItem("operation", "2");
    this.router.navigate(['/', 'manipulate']);
  }

  //Ação ao clicar no Alterar
  editButton(objectParam:any) {
    var idpontoturistico = objectParam.idpontoturistico;

   //Atualiza a SESSION e aciona a tela de manipulação
    sessionStorage.setItem("idpontoturistico",   idpontoturistico);
    sessionStorage.setItem("operation", "4");
    this.router.navigate(['/', 'manipulate']);
  }

  //Ação ao clicar no Excluir
  deleteButton(objectParam:any) {
    var idpontoturistico = objectParam.idpontoturistico;

	//Atualiza a SESSION e aciona a tela de manipulação
    sessionStorage.setItem("idpontoturistico",   idpontoturistico);
    sessionStorage.setItem("operation", "5");
    this.router.navigate(['/', 'manipulate']);
  }

  //Ação ao clicar no Excluir
  comentarioButton(objectParam:any) {
    var idpontoturistico = objectParam.idpontoturistico;

	//Atualiza a SESSION e aciona a tela de cadastro de comentario
    sessionStorage.setItem("idpontoturistico",   idpontoturistico);
    sessionStorage.setItem("operation", "0");
    this.router.navigate(['/', 'manipulate']);
  }


}
