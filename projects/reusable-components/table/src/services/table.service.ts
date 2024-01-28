import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject} from "rxjs";


export type SystemLanguage = 'ar' | 'en'


@Injectable({providedIn: 'root'})
export class TableService{

    lang$ = new BehaviorSubject<SystemLanguage>('en');
    destroy$ = new Subject<boolean>();
    
    listenToLang(){
        return this.lang$.asObservable()
    }

    updateLang(lang: SystemLanguage){
        this.lang$.next(lang);
    }
}




