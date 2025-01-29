import { APP_ID, inject, Injectable } from "@angular/core";
//Use APP_ID "Built-in Angular token" to represent the Application ID. Since each application gets a unique APP_ID when running in the same environment.

//The service is provided at root level which means it's available throughout the application
@Injectable({
    providedIn: 'root'
})
export class UniqueIdGeneratorService {
    //Retrieve the APP_ID using the inject function. This value is used to differentiate IDs across different Angular Applications running on the same page. 
    private readonly _appId = inject(APP_ID);

    //counters map to keep track of the count of IDs generated for each prefix. It ensures that IDs generated with the same prefix remain unique.
    private readonly _counters = new Map<string, number>();

    //Generate a Unique ID with a prefix
    generateID(prefix: string): string {
        //If the appId is not the default `ng` then adjust the prefix to include the appId otherwise just return the prefix. 
        const effectivePrefix = this._appId !== 'ng' ? `${prefix}${this._appId}` : prefix;

        //Get the current count for this prefix or initialize it.
        const currentCount = this._counters.get(effectivePrefix) || 0;

        //Increment the counter and update the map to ensure future calls generate unique IDs
        this._counters.set(effectivePrefix, currentCount + 1);

        //Return the generated Unique ID by concatenating the counter's value to the prefix
        return `${effectivePrefix}${currentCount}`;
    }
}