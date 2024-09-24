import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PoNotificationService, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { map, tap } from 'rxjs';
import { HttpService } from '../service/http-service.service';

@Component({
	selector: 'app-paises',
	templateUrl: './paises.component.html',
	styleUrls: ['./paises.component.css']
})
export class PaisesComponent implements OnInit {
	lsActions: Array<PoTableAction> = this.carregarActions();
	lsColumns: Array<PoTableColumn> = this.carregarColunas();
	lsPaises: Array<Pais> = []

	constructor(
		private httpService: HttpService,
		private poNotification: PoNotificationService,
		private router: Router,
		private activatedRoute: ActivatedRoute) { }

	ngOnInit(): void {
		this.carregarPaises()
	}

	carregarActions(): Array<PoTableAction> {
		return [
			{
				label: 'Editar',
				icon: 'po-icon-edit',
				action: (row: Pais)=>{ this.navegarParaCadastro(row.id) }
			},
			{
				label: 'Excluir',
				icon: 'po-icon-delete',
				action: (row: Pais)=>{ this.deletarCadastro(row.id) }
			}
		]
	}

	deletarCadastro(id: string): void {
		this.httpService.delete('pais/' + id).subscribe({
			next: (response)=>{
				this.poNotification.success('Registro excluido com sucesso!');
				this.carregarPaises();
			},
			error: (error)=>{
				this.poNotification.error(error);
			}
		})
	}

	navegarParaCadastro(codigoPais: string = ""){
		this.router.navigate(['cadastro', codigoPais], { relativeTo: this.activatedRoute })
	}

	carregarPaises(){
		return this.httpService.get('pais').subscribe({
			next: (resposta)=>{
				let registros: Array<Pais> = []
				resposta.forEach(item => {
					let novoPais: Pais = {
						id: item.id,
						nome: item.nome,
						sigla: item.sigla,
						continente: item.continente,
						codigoDdi: item.ddi
					}
					registros.push(novoPais);
				});

				this.lsPaises = [...registros]
			}
		})
	}

	carregarColunas(): Array<PoTableColumn>{
		return [
			{
				property: 'codigoDdi',
				label: 'DDI'
			},
			{
				property: 'nome',
				label: 'Nome',
			},
			{
				property: 'sigla',
				label: 'Sigla'
			},
			{
				property: 'continente',
				label: 'Continente'
			}
		]
	}
}

interface Pais{
	id: string,
	nome: string,
	sigla: string,
	continente: string,
	codigoDdi: number
}