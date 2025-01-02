import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[appDateInputFilter]'
})
export class DateInputFilterDirective {
private previousValue: string = '';

    constructor(private ngControl: NgControl) {}

    @HostListener('input', ['$event'])
    onInputChange(event: Event): void {
        const input = event.target as HTMLInputElement;

        const cleanedValue = input.value.replace(/[^0-9\/.-]/g, '');

        if (cleanedValue !== input.value) {
            this.ngControl.control?.setValue(new Date(this.previousValue === '' ? cleanedValue : this.previousValue), { emitEvent: false });
        } else {
            this.previousValue = cleanedValue;
        }
    }
}
