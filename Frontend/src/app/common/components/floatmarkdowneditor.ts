import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { marked } from 'marked';
import { MenuItem } from 'primeng/api';
import { Divider } from "primeng/divider";
import { EditorModule } from 'primeng/editor';
import { MenubarModule } from 'primeng/menubar';
import { SplitterModule } from 'primeng/splitter';
import { TextareaModule } from 'primeng/textarea';
import { compressImage } from '../helpers/compressImage';

@Component({
    selector: 'app-floatmarkdowneditor',
    imports: [FormsModule, CommonModule, EditorModule, SplitterModule, MenubarModule, TextareaModule, Divider],
    template: `
        @if(disabled){
            <div class="markdowneditor-preview" #preview></div>
        }
        @else {
            <p-splitter class="h-full" [minSizes]="[20, 20]" style="min-height:200px">
                <ng-template pTemplate="panel">
                    <div class="p-2 flex flex-col gap-2 h-full">
                        <p-menubar [model]="items" />
                        <textarea class="markdowneditor-editor" #editor [autoResize]="true" (paste)="onPaste($event)" fluid pTextarea [(ngModel)]="value" (ngModelChange)="valueChanged()"></textarea>
                    </div>
                </ng-template>
                <ng-template pTemplate="panel">
                    <div class="p-2 flex flex-col gap-2 h-full">
                        <span class="markdowneditor-preview-label">Preview</span>
                        <p-divider/>
                        <div class="markdowneditor-preview" #preview></div>
                    </div>
                </ng-template>
            </p-splitter>

            <input type="file" (change)="onFileSelected($event)" #fileUpload [style]="{ display: 'none' }" accept="image/png, image/jpeg" />
        }
    `,
    host: {
        class: 'h-full'
    },
    styles: `
        .markdowneditor-editor {
            height:100% !important;
            overflow:auto !important;
            overflow-wrap: normal;
        }

        .markdowneditor-preview {
            height:100% !important;
            overflow-wrap: break-word;
        }

        .markdowneditor-preview-label {
            align-self: center;
        }
    `
})
export class FloatMarkdownEditor implements OnChanges {
    @ViewChild('preview') preview: ElementRef<HTMLDivElement> | undefined;
    @ViewChild('editor') editor: ElementRef<HTMLTextAreaElement> | undefined;
    @ViewChild('fileUpload') fileUpload: ElementRef<HTMLInputElement> | undefined;

    @Input() disabled: boolean = false;

    @Input() value: string | null = null;
    @Output() valueChange = new EventEmitter<string | null>();

    isFirst : boolean = true;

    items: MenuItem[] = [
        {
            label: 'B',
            style: { 'font-weight':'bold' },
            command: async () => {
                if (this.editor){
                    var editor = this.editor.nativeElement;
                    var start = editor.selectionStart;
                    var finish = editor.selectionEnd;
                    var sel = editor.value.substring(start, finish);
                    var newStr = "**" + sel + "**"
                    await this.replaceSection(newStr, start + 2, finish + 2);
                }
            }
        },
        {
            label: 'I',
            style: { 'font-style':'italic' },
            command: async () => {
                if (this.editor){
                    var editor = this.editor.nativeElement;
                    var start = editor.selectionStart;
                    var finish = editor.selectionEnd;
                    var sel = editor.value.substring(start, finish);
                    var newStr = "*" + sel + "*"
                    await this.replaceSection(newStr, start + 1, finish + 1);
                }
            }
        },
        {
            label: 'H',
            items: [
                {
                    label: 'H1',
                    command: async () => {
                        if (this.editor){
                            var editor = this.editor.nativeElement;
                            var start = editor.selectionStart;
                            var finish = editor.selectionEnd;
                            var sel = editor.value.substring(start, finish);
                            var newStr = "# " + sel
                            await this.replaceSection(newStr, start + 2, finish + 2);
                        }
                    }
                },
                {
                    label: 'H2',
                    command: async () => {
                        if (this.editor){
                            var editor = this.editor.nativeElement;
                            var start = editor.selectionStart;
                            var finish = editor.selectionEnd;
                            var sel = editor.value.substring(start, finish);
                            var newStr = "## " + sel
                            await this.replaceSection(newStr, start + 3, finish + 3);
                        }
                    }
                },
                {
                    label: 'H3',
                    command: async () => {
                        if (this.editor){
                            var editor = this.editor.nativeElement;
                            var start = editor.selectionStart;
                            var finish = editor.selectionEnd;
                            var sel = editor.value.substring(start, finish);
                            var newStr = "### " + sel
                            await this.replaceSection(newStr, start + 4, finish + 4);
                        }
                    }
                },
            ]
        },

        {
            icon: 'pi pi-link',
            command: async () => {
                if (this.editor){
                    var editor = this.editor.nativeElement;
                    var start = editor.selectionStart;
                    var finish = editor.selectionEnd;
                    var sel = editor.value.substring(start, finish);
                    var newStr = "[" + sel + "](link)"
                    await this.replaceSection(newStr, start + 1, finish + 1);
                }
            }
        },

        {
            icon: 'pi pi-image',
            command: async () => {
                if (this.editor){
                    this.fileUpload?.nativeElement.click();
                }
            }
        },
    ]

    async onFileSelected(event: any) {
        var files: File[] = Array.from(event.target.files);
        if (files && files.length > 0) {
            var file = files[0];
            await this.insertImageInEditor(file);
            this.fileUpload!.nativeElement.value = '';
        }
    }

    toBase65(file : File){
        return new Promise((resolve, reject) => {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
        })
    }

    async onPaste(event : any){
        const items = (event.clipboardData || event.originalEvent.clipboardData).items;
        let blob = null;
        for (const item of items) {
            if (item.type.indexOf('image') === 0) {
                blob = item.getAsFile();
                await this.insertImageInEditor(blob);
            }
        }
    }

    async insertImageInEditor(file : File){
        var compressed = await compressImage(file, 0.5, 300, 300);
        var asBase64 = await this.toBase65(compressed as File);
        if (asBase64 && this.editor){
            var editor = this.editor.nativeElement;
            var start = editor.selectionStart;
            var finish = editor.selectionEnd;
            var sel = editor.value.substring(start, finish);
            var newStr = "![" + sel + "](" + asBase64 + ")"
            await this.replaceSection(newStr, start + newStr.length, finish + newStr.length);
        }
    }

    async replaceSection(newStr : string, finalStart : number, finalFinish : number){
        var editor = this.editor!.nativeElement;
        editor.focus();
        document.execCommand("insertText", false, newStr);
        await this.valueChanged();
        editor.focus();
        editor.setSelectionRange(finalStart, finalFinish);
    }

    async ngOnChanges(changes: SimpleChanges) {
        if (changes['value']) {
            if (changes['value'].currentValue != changes['value'].previousValue) {
                this.value = changes['value'].currentValue;
                await this.formatPreview();
                if (this.isFirst){
                    setTimeout(async () => await this.formatPreview(), 500);
                    this.isFirst = false;
                }
            }
        }
    }

    async formatPreview(){
        if (this.value && this.preview){
            this.preview.nativeElement.innerHTML = await marked(this.value);
        }
    }

    async valueChanged() {
        await this.formatPreview();
        this.valueChange.emit(this.value);
    }
}
