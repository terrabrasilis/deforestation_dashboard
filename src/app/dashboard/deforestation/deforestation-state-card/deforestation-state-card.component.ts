import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-deforestation-state-card',
  templateUrl: './deforestation-state-card.component.html',
  styleUrls: ['./deforestation-state-card.component.css']
})
export class DeforestationStateCardComponent implements OnChanges {
  @Input() stateTotal: number = 0;

  formattedTotal: string = '';

  ngOnChanges() {
    this.formattedTotal = this.formatNumber(this.stateTotal);
  }

  formatNumber(value: number): string {
    return value.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) + ' km²';
    }
}
