import { Component, Input, OnChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-deforestation-percentage-card',
  templateUrl: './deforestation-percentage-card.component.html',
  styleUrls: ['./deforestation-percentage-card.component.css']
})
export class DeforestationPercentageCardComponent implements OnChanges {

  @Input() data: any;
  @Input() includeMask: boolean = false;

  constructor(private translate: TranslateService) {}

  previousPercentage: number | null = null;
  nextPercentage: number | null = null;
  percentages: any[] = [];

  ngOnChanges() {

    this.previousPercentage = null;
    this.nextPercentage = null;
    this.percentages = [];

    if (!this.data) return;

    // =========================
    // MODO GRUPOS
    // =========================
    if (this.data.mode === 'group') {

      const g1 = this.data.group1;
      const g2 = this.data.group2;

      const hasG1Years = (g1.years || []).length > 0;
      const hasG2Years = (g2.years || []).length > 0;

      if (!hasG1Years || !hasG2Years) {
        this.percentages = [];
        return;
      }
      const g1total = g1.total || 0;
      const g2total = g2.total || 0;

      let percentage = null;
      if (g1total !== 0 && g2total !== null) {
        percentage = ((g2total - g1total) / g1total) * 100;
      }

      this.percentages = [
        {
          from: (g1.years || []).map((y: any) => y.key).join(', '),
          to: (g2.years || []).map((y: any) => y.key).join(', '),
          currentValue: g1total,
          nextValue: g2total,
          difference: g2total - g1total,
          percentage,
          isGroup: true
        }
      ];
      return;
    }

    // =========================
    // MODO 1 ANO
    // =========================
    if (this.data.mode === 'single') {

      const previousValue =
        this.data && this.data.previous
          ? this.data.previous.value
          : null;

      const currentValue =
        this.data && this.data.current
          ? this.data.current.value
          : null;

      const nextValue =
        this.data && this.data.next
          ? this.data.next.value
          : null;

      // anterior -> atual
      if (
        previousValue !== null &&
        previousValue !== 0 &&
        currentValue !== null
      ) {

        this.previousPercentage =
          ((currentValue - previousValue) / previousValue) * 100;

      } else {

        this.previousPercentage = null;

      }

      // atual -> próximo
      if (
        currentValue !== null &&
        currentValue !== 0 &&
        nextValue !== null
      ) {

        this.nextPercentage =
          ((nextValue - currentValue) / currentValue) * 100;

      } else {

        this.nextPercentage = null;

      }

      return;
    }

    // =========================
    // MODO MULTIPLOS ANOS
    // =========================
    if (this.data.mode === 'multiple') {

      const years = this.data.years;

      // caso tenha apenas 2 anos
      if (years.length === 2) {

        const first = years[0];
        const second = years[1];

        let percentage = null;

        if (
          first.value !== null &&
          first.value !== 0 &&
          second.value !== null
        ) {

          percentage =
            ((second.value - first.value) / first.value) * 100;

        }

        this.percentages = [
          {
            from: first.key,
            to: second.key,
            currentValue: first.value,
            nextValue: second.value,
            percentage
          }
        ];

      } else {

        // 3 ou mais anos
        this.percentages = years.map((item: any, index: number) => {

          let current = item;

          let next =
            index === years.length - 1
              ? years[0]
              : years[index + 1];

          if (index === years.length - 1) {
            current = years[0];
            next = item;
          }

          let percentage = null;

          if (
            current.value !== null &&
            current.value !== 0 &&
            next.value !== null
          ) {

            percentage =
              ((next.value - current.value) / current.value) * 100;

          }

          return {
            from: current.key,
            to: next.key,
            currentValue: current.value,
            nextValue: next.value,
            percentage
          };

        });

      }

    }

  }

  get locale(): string {
    return this.translate.currentLang === 'pt-br' ? 'pt-BR' : 'en-US';
  }

  formatArea(value: number | null): string {
    if (value === null || value === undefined) {
      return '-';
    }
    return value.toLocaleString(this.locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  formatPercentage(value: number | null): string {

    if (value === null || value === undefined) {
      return '-';
    }

    return value.toLocaleString(this.locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + '%';
  }

  formatDifference(value: number): string {
    return value.toLocaleString(this.locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

}