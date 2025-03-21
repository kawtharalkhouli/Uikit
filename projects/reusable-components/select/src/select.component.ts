import {
  AfterContentChecked,
  AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    forwardRef,
    Input,
    OnChanges,
    Output,
    ViewChild,
    ViewEncapsulation,
  } from '@angular/core';
  import { NG_VALUE_ACCESSOR, ControlValueAccessor, NG_VALIDATORS, AbstractControl, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';
  import { MatSelect } from '@angular/material/select';
  import { MatOption } from '@angular/material/core';
  
  interface Configurations {
    isMultiple?: boolean;
    imageDisplay?: string;
    chosenId?: string;
    groups?: boolean;
    currentLanguage?: string;
    addRole?: boolean;
    addRoleText?: string;
    floatNever?: boolean;
    removeNoneOption?:boolean;
    includeIcons?:boolean;
  }
  export const VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MultiSelectComponent),
    multi: true,
  };
  
  export const VALIDATOR: any = {
    provide: NG_VALIDATORS, useExisting: forwardRef(() => MultiSelectComponent),
    multi: true
  };
  
  @Component({ 
    selector: 'multi-select',
    templateUrl: './select.component.html',
    providers: [VALUE_ACCESSOR,VALIDATOR],
    encapsulation: ViewEncapsulation.None
  })
  export class MultiSelectComponent implements OnChanges, ControlValueAccessor,Validator,AfterContentChecked{
    @ViewChild('select') select!: MatSelect;
    @Input() data!: any;
    @Input() chosenField!: string;
    @Input() placeholder!: string;
    @Input() configurations!: Configurations | undefined;
    @Input() selectedValues: any | undefined;
    @Input() required!:boolean;
    @Input() matTooltip!:string;
    @Input() size!:string;
    @Input() removableChips:boolean=false;
    chips:any[]=[];
    selectedChips: any =[];

    @Output() addOptions: EventEmitter<any> = new EventEmitter();
    @Output() selectionChange: EventEmitter<any> = new EventEmitter();
    @Output() selectedItem: EventEmitter<any> = new EventEmitter();

  
    valueSelected: any = [];
    selectedOptions: any;
    selectedOptionsForChips: any[] = [];
    isDisabled: boolean =false;
    filteredData!: any;
    searchValue!: string;
    isMasterSel: boolean = false;
    valueSelectedForms!: any;
    isRequired:boolean=false;
  
    constructor(private cdr: ChangeDetectorRef) {}
    
    addOption(e: any) {
      this.addOptions.emit(e);
    }
  
  getBooleanProperty(value: any): boolean {
    return value != null && value !== false;
  }
  
  @Input()
  get disabled(): boolean { return this.isDisabled; }
  set disabled(value) {
    this.isDisabled = this.getBooleanProperty(value);
  }
  
    ngOnChanges() {
      this.filteredData = this.data;
      if (
        this.selectedValues &&
        (this.data?.length > 0 || this.data?.children?.length > 0)
      ) {
      //   this.filteredData.sort((a: any, b: any) =>
      //   a[this.chosenField].localeCompare(b[this.chosenField])
      // );
        this.selectedOptions = this.selectedValues;
        this.setChipsValue(this.selectedValues);
      } else {
        if (this.valueSelectedForms) {
          this.setChipsValue(this.valueSelectedForms);
        }
      }
      this.cdr.markForCheck();
    }

  
    setChipsValue(selectedValues: any): void {
      this.selectedOptionsForChips = [];
      if (!this.configurations?.isMultiple) {
        let isGroupingOptions = this.configurations?.groups
          ? this.filteredData.children
          : this.filteredData;
  
        if (this.configurations?.groups) {
          isGroupingOptions.forEach((item: any) => {
            this.selectedOptionsForChips.push(
              ...item.children.filter((child: any) => {
                return (
                  child.value[this.configurations?.chosenId || 'id'] ===
                  selectedValues
                );
              })
            );
          });
        } else {
          this.selectedOptionsForChips = isGroupingOptions.filter((item: any) => {
            let compareItem = this.chosenField
              ? item[this.configurations?.chosenId || 'id']
              : item;
  
            return compareItem === selectedValues;
          });
        }
      } else {
        if(selectedValues?.length > 0){
        selectedValues.forEach((val: any) => {
          this.selectedOptionsForChips.push(
            ...this.filteredData.filter((item: any) => {
              let compareItem = this.chosenField
                ? item[this.configurations?.chosenId || 'id']
                : item;
              return compareItem === val;
            })
          );
        });
        this.selectedOptionsForChips.map(item => {
          this.chips.push(item[this.chosenField])
        })
        this.selectedChips = [...new Set(this.chips)];
        
      }
    }
    }
    selectAllOptions(e:any): void {
      let selectedValues = []
      if (e.checked === true) {
        this.filteredData.forEach(item => {
          selectedValues.push(item.id)
        })
        this.select.writeValue(selectedValues)
        this.selectedOptions = selectedValues; 
        this.selectedOptionsForChips = selectedValues;
        this.selectionChange.emit({value:this.selectedOptions})
        this.select.optionSelectionChanges
        this.cdr.detectChanges();
      } else {
        this.selectedOptions = []; 
        this.selectedOptionsForChips = [];
        this.select.writeValue([]);
        this.selectionChange.emit({value:this.selectedOptions})
        this.cdr.detectChanges()
      }
    }
    selected(event: any): void {
      if (this.configurations?.isMultiple) {
        this.selectedOptions = event.value;
        this.selectionChange.emit(event);
      }
  
      if (!this.configurations?.isMultiple) {
        this.onChange(event.value);
        this.selectionChange.emit(event)
      }
      else {
        this.valueSelected = [];
        for (let option of this.selectedOptions) {
          this.valueSelected?.push(option);
        }
        this.onChange(this.valueSelected);
        this.selectionChange.emit(event);
      }
      this.selectedOptionsForChips = [];
      this.setChipsValue(event.value);
    }
  
    returnItem(item:any){
      if(this.configurations.isMultiple){
        let newStatus = true;
        this.select.options.forEach((item: MatOption) => {
          if (!item.selected) {
            newStatus = false;
          }
        });
        this.isMasterSel = newStatus;
      }
      this.selectedItem.emit(item);
    }
  
    filterOptions(event: any) {
      //* Get the search value from the event object and convert it to lowercase
  
      const searchValue = event.target.value.toLowerCase();
  
      if (this.configurations?.isMultiple) {
        //* Get the selected options
  
        const selectedValues = this.selectedOptions;
  
        //* Filter the data to get the selected options and other options
        const selectedOptions = this.data.filter((option: any) =>
          selectedValues?.includes(option[this.configurations?.chosenId || 'id'])
        );
        const otherOptions = this.data.filter(
          (option: any) =>
            !selectedValues?.includes(
              option[this.configurations?.chosenId || 'id']
            )
        );
  
        let filteredOptions: any[];
  
        //* If the search value is empty, concatenate the selected options and other options and sort them alphabetically
        if (searchValue === '') {
          // filteredOptions = [...selectedOptions, ...otherOptions].sort(
          //   (a: any, b: any) =>
          //     a[this.chosenField].localeCompare(b[this.chosenField])
          // );
          filteredOptions = [...selectedOptions, ...otherOptions];
        } else {
          //* If there is a search value, filter the options based on the search value and selected options, and sort them
          // filteredOptions = this.data
          //   .filter(
          //     (option: any) =>
          //       option[this.chosenField].toLowerCase().includes(searchValue) ||
          //       selectedValues?.includes(
          //         option[this.configurations?.chosenId || 'id']
          //       )
          //   )
          //   .sort((a: any, b: any) => {
          //     const aIsSelected = selectedValues?.includes(
          //       a[this.configurations?.chosenId || 'id']
          //     );
          //     const bIsSelected = selectedValues?.includes(
          //       b[this.configurations?.chosenId || 'id']
          //     );
  
          //     //* Sort selected options first, then other options, then alphabetically
          //     if (aIsSelected && !bIsSelected) {
          //       return -1;
          //     } else if (bIsSelected && !aIsSelected) {
          //       return 1;
          //     } else {
          //       return a[this.chosenField].localeCompare(b[this.chosenField]);
          //     }
          //   });

          filteredOptions = this.data
          .filter(
            (option: any) =>
              option[this.chosenField].toLowerCase().includes(searchValue) ||
              selectedValues?.includes(
                option[this.configurations?.chosenId || 'id']
              )
          )
          // .sort((a: any, b: any) => {
          //   const aIsSelected = selectedValues?.includes(
          //     a[this.configurations?.chosenId || 'id']
          //   );
          //   const bIsSelected = selectedValues?.includes(
          //     b[this.configurations?.chosenId || 'id']
          //   );

          //   //* Sort selected options first, then other options, then alphabetically
          //   if (aIsSelected && !bIsSelected) {
          //     return -1;
          //   } else if (bIsSelected && !aIsSelected) {
          //     return 1;
          //   } else {
          //     return a[this.chosenField].localeCompare(b[this.chosenField]);
          //   }
          // });
        }
        //* Set the filtered data to the filtered options
        this.filteredData = filteredOptions;
      } else {
        this.filteredData = this.data.filter((item: any) => {
          let compare = item[this.chosenField];
          return compare.toLowerCase().includes(searchValue.toLowerCase());
        });
      }
    }
  
    onChange = (value:any) => {};
    onTouched = () => {};
  
    registerOnChange(fn:any): void {
      this.onChange =fn;
      this.cdr.detectChanges()
    }
  
    writeValue(value: any) {
        this.selectedOptions = value;
        this.valueSelectedForms = value;
        if (this.data?.length > 0 || this.data?.children?.length > 0) {
          this.setChipsValue(value);
      this.cdr.markForCheck();
    }
  }
  
    registerOnTouched(fn: any) {
      this.onTouched = fn;
    }
  
    setDisabledState(isDisabled: boolean) {
      this.isDisabled = isDisabled;
      this.cdr.markForCheck();
    }
    //For validation
    validate(c: AbstractControl): ValidationErrors {
      const validators: ValidatorFn[] = [];
      if(c.errors)
      this.isRequired=true
      return validators;
    }
    
    registerOnValidatorChange(fn: () => void): void { 
      this.onChange = fn;
      this.onTouched=fn;
    }
     markAsTouched(): void {
      this.onTouched();
    }
    //For Removable Chips
    removeItem(item: any): void {
      const index = this.selectedOptionsForChips.indexOf(item);
      const index2=this.selectedOptions.indexOf(item.id)
      if (index >= 0) {
        this.selectedOptionsForChips.splice(index, 1);
        this.selectedOptions.splice(index2,1);
        this.select.writeValue(this.selectedOptions)
      }
    }

    getSelectedOptionIcon(selectedLabel: string): string {
      const selectedOption = this.data.find((option : any) => option.id === selectedLabel);
      return selectedOption ? selectedOption.icon : '';
    }
  
    getSelectedOptionLabel(selectedLabel: string) : string{
      const selectedOption = this.data.find((option : any) => option.id === selectedLabel);
      return selectedOption ? selectedOption[this.chosenField] : '';
    }
    ngAfterContentChecked(): void {
      this.cdr.detectChanges();
    }

  }
  