import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { TextareaModule } from 'primeng/textarea';
import { FormsModule } from '@angular/forms';
import { VersionTag } from '../../../../globals';

@Component({
    selector: 'app-version',
    standalone: true,
    imports: [FormsModule, DialogModule, TagModule, TooltipModule, TextareaModule],
    template: `
        <p-tag [style]="{ position: 'fixed', left: '0px', bottom: '0px', 'z-index': '9999' }"> Version {{ versionTag }} </p-tag>
    `
})
export class AppVersion {
    versionTag: string = VersionTag;
}
