import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// component imports begin
import { MatButtonModule, MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatListModule} from '@angular/material/list';
import {MatStepperModule} from '@angular/material/stepper';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatIconModule} from '@angular/material/icon';



@NgModule({
    imports: [
        // tslint:disable-next-line:max-line-length
        MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatRadioModule, MatSelectModule, MatSlideToggleModule, MatDividerModule, MatExpansionModule, MatGridListModule, MatListModule, MatStepperModule, MatProgressBarModule, MatSnackBarModule,MatIconModule,MatDatepickerModule,MatNativeDateModule, 
        // MatBadgeModule
    ],
    exports: [
        // tslint:disable-next-line:max-line-length
        MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatRadioModule, MatSelectModule, MatSlideToggleModule, MatDividerModule, MatExpansionModule, MatGridListModule, MatListModule, MatStepperModule, MatProgressBarModule, MatSnackBarModule,MatIconModule,MatDatepickerModule,MatNativeDateModule, 
        // MatBadgeModule
    ]
})

export class MaterialModule { }
