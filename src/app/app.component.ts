import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';

import { ProtheusLibCoreModule } from '@totvs/protheus-lib-core';
import { ProAppConfigService } from '@totvs/protheus-lib-core';

import {
  PoMenuItem,
  PoMenuModule,
  PoPageModule,
  PoToolbarModule,
} from '@po-ui/ng-components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    PoToolbarModule,
    PoMenuModule,
    PoPageModule,
    HttpClientModule,
    ProtheusLibCoreModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  constructor(private router: Router){}

  readonly menus: Array<PoMenuItem> = [
    { label: 'Paises', shortLabel: 'Paises', icon: 'po-icon-folder', action: this.onClick.bind(this, '/pais') },
    { label: 'Pontos Turisticos', shortLabel: 'P. Turisticos', icon: 'po-icon-finance-secure', action: this.onClick.bind(this, 'ponto-turistico') }
    //adicionado Leandro:
     { label: 'Sair'       , shortLabel: 'Sair'       , icon: 'po-icon-exit'          , action: this.closeApp.bind(this)           }
  ];

  private onClick(rota: string) {
    this.router.navigateByUrl(rota)
  }

//adicionado Leandro:
 //Ao clicar no Sair
 private closeApp() {
  if (this.proAppConfigService.insideProtheus()) {
    this.proAppConfigService.callAppClose();
  } else {
    alert("Clique não veio do Protheus");
  }
}

}
