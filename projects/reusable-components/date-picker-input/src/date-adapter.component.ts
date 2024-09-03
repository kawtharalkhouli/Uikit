
import { NativeDateAdapter } from '@angular/material/core';
import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';
const moment = _rollupMoment || _moment;

export class FedDateAdapter extends NativeDateAdapter {
  override format(date: Date): string {
    return moment(date).format('DD/MM/YYYY');
  }

  override parse(value: any): Date | null {
    if (!moment(value, 'DD/MM/YYYY', true).isValid()) {
      return this.invalid();
    }
    return moment(value, 'DD/MM/YYYY', true).toDate();
  }
}
