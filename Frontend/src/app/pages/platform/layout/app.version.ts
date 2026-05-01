import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { VersionTag } from '../../../../globals';

@Component({
    selector: 'app-version',
    standalone: true,
    imports: [FormsModule, DialogModule, TagModule, TooltipModule, TextareaModule],
    template: `
        <p-tag [style]="{ position: 'fixed', left: '5px', bottom: '5px', 'z-index': '9999' }"> Version {{ versionTag }} </p-tag>
    `
})
export class AppVersion {
    versionTag: string = VersionTag;
}
