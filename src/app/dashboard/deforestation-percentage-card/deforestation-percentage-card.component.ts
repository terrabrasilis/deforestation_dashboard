import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-deforestation-percentage-card',
  templateUrl: './deforestation-percentage-card.component.html',
  styleUrls: ['./deforestation-percentage-card.component.css']
})
export class DeforestationPercentageCardComponent implements OnChanges {

  @Input() data: any;

  previousPercentage: number | null = null;
  nextPercentage: number | null = null;

  ngOnChanges() {

    const previousValue = this.data &&
                        this.data.previous
      ? this.data.previous.value
      : null;

    const currentValue = this.data &&
                        this.data.current
      ? this.data.current.value
      : null;

    const nextValue = this.data &&
                      this.data.next
      ? this.data.next.value
      : null;

    // diferença entre anterior e atual
    if (
      previousValue !== null &&
      previousValue !== undefined &&
      previousValue !== 0 &&
      currentValue !== null &&
      currentValue !== undefined
    ) {

      this.previousPercentage =
        ((currentValue - previousValue) / previousValue) * 100;

    } else {

      this.previousPercentage = null;

    }

    // diferença entre atual e próximo
    if (
      currentValue !== null &&
      currentValue !== undefined &&
      currentValue !== 0 &&
      nextValue !== null &&
      nextValue !== undefined
    ) {

      this.nextPercentage =
        ((nextValue - currentValue) / currentValue) * 100;

    } else {

      this.nextPercentage = null;

    }

  }

  formatPercentage(value: number | null): string {

    if (value === null || value === undefined) {
      return '-';
    }

    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + '%';
  }

}