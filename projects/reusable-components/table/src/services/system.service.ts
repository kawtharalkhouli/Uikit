import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class SystemService {

  constructor(
  ) { }
  sanitizeObjectValues(object: { [key: string]: any }): { [key: string]: any } {

    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        const value = object[key];

        if (!value && value != 0) delete object[key];
      }
    }

    return object;
  }

}



