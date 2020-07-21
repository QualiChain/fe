import { Component, Input, Output, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

export interface states {
  id: number;
  name: string;
  state_code: string;
}

export interface StateCountryOption {
  name: string;
  iso3: string;
  iso2: string;
  phone_code: string;
  capital: string;
  currency: string;
  states: states[],
}

@Component({
  selector: 'app-qc-location-state-country',
  templateUrl: './qc-location-state-country.component.html',
  styleUrls: ['./qc-location-state-country.component.css']
})
export class QcLocationStateCountryComponent implements OnInit {

  stateCountryOptions: StateCountryOption[] = [
    {"name":"Spain","iso3":"ESP","iso2":"ES","phone_code":"34","capital":"Madrid","currency":"EUR","states":[{"id":1179,"name":"A Coruña Province","state_code":"C"},{"id":1168,"name":"Albacete Province","state_code":"AB"},{"id":1156,"name":"Alicante Province","state_code":"A"},{"id":1151,"name":"Almería Province","state_code":"AL"},{"id":1193,"name":"Andalusia","state_code":"AN"},{"id":1148,"name":"Araba \/ Álava","state_code":"VI"},{"id":1177,"name":"Aragon","state_code":"AR"},{"id":1153,"name":"Badajoz Province","state_code":"BA"},{"id":1174,"name":"Balearic Islands","state_code":"PM"},{"id":1180,"name":"Barcelona Province","state_code":"B"},{"id":1191,"name":"Basque Country","state_code":"PV"},{"id":1186,"name":"Biscay","state_code":"BI"},{"id":1146,"name":"Burgos Province","state_code":"BU"},{"id":1196,"name":"Cáceres Province","state_code":"CC"},{"id":1201,"name":"Cádiz Province","state_code":"CA"},{"id":1185,"name":"Canary Islands","state_code":"CN"},{"id":1170,"name":"Cantabria","state_code":"S"},{"id":1207,"name":"Castellón Province","state_code":"CS"},{"id":1184,"name":"Castile and León","state_code":"CL"},{"id":1205,"name":"Castile-La Mancha","state_code":"CM"},{"id":1203,"name":"Catalonia","state_code":"CT"},{"id":1206,"name":"Ceuta","state_code":"CE"},{"id":1150,"name":"Ciudad Real Province","state_code":"CR"},{"id":1158,"name":"Community of Madrid","state_code":"MD"},{"id":1197,"name":"Córdoba Province","state_code":"CO"},{"id":1169,"name":"Cuenca Province","state_code":"CU"},{"id":1190,"name":"Extremadura","state_code":"EX"},{"id":1167,"name":"Galicia","state_code":"GA"},{"id":1202,"name":"Gipuzkoa","state_code":"SS"},{"id":1178,"name":"Girona Province","state_code":"GI"},{"id":1194,"name":"Granada Province","state_code":"GR"},{"id":1172,"name":"Guadalajara Province","state_code":"GU"},{"id":1199,"name":"Huelva Province","state_code":"H"},{"id":1163,"name":"Huesca Province","state_code":"HU"},{"id":1181,"name":"Jaén Province","state_code":"J"},{"id":1171,"name":"La Rioja","state_code":"RI"},{"id":1166,"name":"Las Palmas Province","state_code":"GC"},{"id":1200,"name":"León Province","state_code":"LE"},{"id":1195,"name":"Lleida Province","state_code":"L"},{"id":1187,"name":"Lugo Province","state_code":"LU"},{"id":1149,"name":"Madrid Province","state_code":"M"},{"id":1188,"name":"Málaga Province","state_code":"MA"},{"id":1159,"name":"Melilla","state_code":"ML"},{"id":1145,"name":"Murcia Province","state_code":"MU"},{"id":1204,"name":"Navarre","state_code":"NC"},{"id":1173,"name":"Ourense Province","state_code":"OR"},{"id":1157,"name":"Palencia Province","state_code":"P"},{"id":1154,"name":"Pontevedra Province","state_code":"PO"},{"id":1160,"name":"Province of Asturias","state_code":"O"},{"id":1189,"name":"Province of Ávila","state_code":"AV"},{"id":1176,"name":"Region of Murcia","state_code":"MC"},{"id":1147,"name":"Salamanca Province","state_code":"SA"},{"id":1198,"name":"Santa Cruz de Tenerife Province","state_code":"TF"},{"id":1192,"name":"Segovia Province","state_code":"SG"},{"id":1155,"name":"Seville Province","state_code":"SE"},{"id":1208,"name":"Soria Province","state_code":"SO"},{"id":1164,"name":"Tarragona Province","state_code":"T"},{"id":1182,"name":"Teruel Province","state_code":"TE"},{"id":1165,"name":"Toledo Province","state_code":"TO"},{"id":1152,"name":"Valencia Province","state_code":"V"},{"id":1175,"name":"Valencian Community","state_code":"VC"},{"id":1183,"name":"Valladolid Province","state_code":"VA"},{"id":1161,"name":"Zamora Province","state_code":"ZA"},{"id":1162,"name":"Zaragoza Province","state_code":"Z"}]},
    {"name":"France","iso3":"FRA","iso2":"FR","phone_code":"33","capital":"Paris","currency":"EUR","states":[{"id":4800,"name":"Alo","state_code":"WF-AL"},{"id":4811,"name":"Alsace","state_code":"A"},{"id":4808,"name":"Aquitaine","state_code":"B"},{"id":4789,"name":"Auvergne","state_code":"C"},{"id":4798,"name":"Auvergne-Rhône-Alpes","state_code":"ARA"},{"id":4825,"name":"Bourgogne-Franche-Comté","state_code":"BFC"},{"id":4807,"name":"Brittany","state_code":"BRE"},{"id":4788,"name":"Burgundy","state_code":"D"},{"id":4818,"name":"Centre-Val de Loire","state_code":"CVL"},{"id":4791,"name":"Champagne-Ardenne","state_code":"G"},{"id":4806,"name":"Corsica","state_code":"COR"},{"id":4805,"name":"Franche-Comté","state_code":"I"},{"id":4822,"name":"French Guiana","state_code":"GF"},{"id":4824,"name":"French Polynesia","state_code":"PF"},{"id":4820,"name":"Grand Est","state_code":"GES"},{"id":4829,"name":"Guadeloupe","state_code":"GP"},{"id":4828,"name":"Hauts-de-France","state_code":"HDF"},{"id":4796,"name":"Île-de-France","state_code":"IDF"},{"id":4803,"name":"Languedoc-Roussillon","state_code":"K"},{"id":4792,"name":"Limousin","state_code":"L"},{"id":4801,"name":"Lorraine","state_code":"M"},{"id":4814,"name":"Lower Normandy","state_code":"P"},{"id":4827,"name":"Martinique","state_code":"MQ"},{"id":4797,"name":"Mayotte","state_code":"YT"},{"id":4793,"name":"Nord-Pas-de-Calais","state_code":"O"},{"id":4804,"name":"Normandy","state_code":"NOR"},{"id":4795,"name":"Nouvelle-Aquitaine","state_code":"NAQ"},{"id":4799,"name":"Occitania","state_code":"OCC"},{"id":4816,"name":"Paris","state_code":"75"},{"id":4802,"name":"Pays de la Loire","state_code":"PDL"},{"id":4790,"name":"Picardy","state_code":"S"},{"id":4815,"name":"Poitou-Charentes","state_code":"T"},{"id":4812,"name":"Provence-Alpes-Côte d'Azur","state_code":"PAC"},{"id":4823,"name":"Réunion","state_code":"RE"},{"id":4813,"name":"Rhône-Alpes","state_code":"V"},{"id":4794,"name":"Saint Barthélemy","state_code":"BL"},{"id":4809,"name":"Saint Martin","state_code":"MF"},{"id":4821,"name":"Saint Pierre and Miquelon","state_code":"PM"},{"id":4819,"name":"Sigave","state_code":"WF-SG"},{"id":4826,"name":"Upper Normandy","state_code":"Q"},{"id":4817,"name":"Uvea","state_code":"WF-UV"},{"id":4810,"name":"Wallis and Futuna","state_code":"WF"}]}
  ];

  filteredListOfStates: states[];

  @Input() defaultValue: string;
  @Input() requiredValue: boolean;
  @Input() countryValue: string = null;
  
  /**
   * List of options to use for mat-option
   */
  //@Input() options: SimpleOption[];
  /**
   * Parent FormGroup for inputs of this component
   */
  @Input() parentForm: FormGroup;
  /**
   * mat-select control
   */
  @Input() formInnerControlName: string;

  constructor() { }

  ngOnInit(): void {}

  ngOnChanges(): void { 
    let index = this.stateCountryOptions.findIndex(x => x.iso2 === this.countryValue);
    if (index>=0) {
      this.filteredListOfStates = this.stateCountryOptions[index].states;
    }
    else {
      this.filteredListOfStates = [];
    }
  }

}
