import { Component, Input, OnChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-deforestation-state-card',
  templateUrl: './deforestation-state-card.component.html',
  styleUrls: ['./deforestation-state-card.component.css']
})
export class DeforestationStateCardComponent implements OnChanges {
  @Input() stateTotal: number = 0;
  @Input() group1Total: number = 0;
  @Input() group2Total: number = 0;
  @Input() includeMask: boolean = false;

  formattedTotal: string = '';
  formattedGroup1: string = '';
  formattedGroup2: string = '';

  constructor(private translate: TranslateService) {}

  ngOnChanges() {
    this.formattedTotal = this.formatNumber(this.stateTotal);
    this.formattedGroup1 = this.formatNumber(this.group1Total);
    this.formattedGroup2 = this.formatNumber(this.group2Total);
  }

  get locale(): string {
    return this.translate.currentLang === 'pt-br' ? 'pt-BR' : 'en-US';
  }

  formatNumber(value: number): string {
    return value.toLocaleString(this.locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
}
