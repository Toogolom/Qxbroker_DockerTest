import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
    selector: '[appClickOutside]'
})
export class ClickOutsideDirective {
    @Output() clickOutside = new EventEmitter<void>();

    constructor(private elementRef: ElementRef) {}

    @HostListener('document:mousedown', ['$event'])
    public onClick(evt: MouseEvent): void {
        if (evt.defaultPrevented) {
            return;
        }

        const targetElement = evt.target as HTMLElement;
        if (targetElement && document.body.contains(targetElement)) {
            const clickedInside = this.elementRef.nativeElement.contains(targetElement);

            if (!clickedInside) {
                this.clickOutside.emit();
            }
        }
    }
}
