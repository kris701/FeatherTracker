import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { EditorModule } from 'primeng/editor';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { PasswordModule } from 'primeng/password';
import { SplitterModule } from 'primeng/splitter';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';

@Component({
    selector: 'app-wgt-weights',
    imports: [
    FormsModule,
    CommonModule,
    DialogModule,
    ButtonModule,
    FloatLabelModule,
    InputTextModule,
    MultiSelectModule,
    PasswordModule,
    TableModule,
    EditorModule,
    TagModule,
    SplitterModule,
    TextareaModule
],
    template: `
        <span>t</span>
    `,
    host: {
        class: 'card flex flex-col flex-grow'
    }
})
export class WGTWeights {

}
