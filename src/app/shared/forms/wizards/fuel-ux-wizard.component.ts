import {
  Component,
  OnInit,
  ElementRef,
  EventEmitter,
  Output
} from "@angular/core";
import "script-loader!fuelux/js/wizard.js";

@Component({
  selector: "fuel-ux-wizard",
  template: `
    <div>
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class FuelUxWizardComponent implements OnInit {
  @Output() complete = new EventEmitter();
  @Output() isStep2 = new EventEmitter<boolean>();
  @Output() currentStep = new EventEmitter<number>();

  constructor(private el: ElementRef) {}

  ngOnInit() {
    const element = $(this.el.nativeElement);
    const wizard = element.wizard();

    const $form = element.find("form");

    wizard.on("actionclicked.fu.wizard", (e, data) => {
      if((data.step == 1 && data.direction =="next") || (data.step == 3 && data.direction =="previous")) {
        this.isStep2.emit(true);
      } else {
        this.isStep2.emit(false);
      }

if(data.direction == "next") {this.currentStep.emit(data.step + 1)}
if(data.direction == "previous") {this.currentStep.emit(data.step - 1)}

      if ($form.data("validator")) {
        if (!$form.valid()) {
          $form.data("validator").focusInvalid();
          e.preventDefault();
        }
      }
    });

    wizard.on("finished.fu.wizard", (e, data) => {
      const formData = {};
      $form.serializeArray().forEach(field => {
        formData[field.name] = field.value;
      });
      this.complete.emit(formData);
    });
  }
}
