import { booleanAttribute, ChangeDetectionStrategy, Component, inject, InjectionToken, Input, Optional, ViewEncapsulation } from "@angular/core";
import { REALSOFT_OPTION_CONFIG, RealsoftOptionConfiguration } from "./models";
import { UniqueIdGeneratorService } from "../id-generator";

export const REALSOFT_OPTION_GROUP = new InjectionToken<RealsoftOptionGroup>('RealsoftOptGroup');

//For Grouping instances of mat option
@Component({
    selector: 'realsoft-opt-group',
    exportAs: 'realsoftOptGroup',
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './option-group.html',
    styleUrl: './option-group.scss',
    host: {
        'class': 'realsoft-option-group',
        'role': 'group',
        '[attr.aria-labelledby]': '_id',
        '[attr.aria-disabled]': 'disabled.toString()'
    },
    providers: [{provide: REALSOFT_OPTION_GROUP, useExisting: RealsoftOptionGroup}]
})
export class RealsoftOptionGroup {
    //Whether the option group is disabled
    @Input({transform: booleanAttribute}) disabled: boolean = false;

    //label for the option group
    @Input() label: string;

    _id =inject(UniqueIdGeneratorService).generateID('realsoft-opt-group-label-')

    //default options 
    _options = inject<RealsoftOptionConfiguration>(REALSOFT_OPTION_CONFIG, {optional: true});
}