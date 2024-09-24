import { FormGroup } from "@angular/forms";

export function triggerFormValidators(formGroup: FormGroup){
    Object.keys(formGroup.controls).forEach(field => {
        const control = formGroup.get(field);
        control.updateValueAndValidity();
    });
    return formGroup;
}