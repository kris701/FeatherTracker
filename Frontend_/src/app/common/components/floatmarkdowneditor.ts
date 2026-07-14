import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, signal, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiButton, TuiDataList, TuiDropdown, TuiGroup, TuiScrollbar } from '@taiga-ui/core';
import { TuiTextarea } from '@taiga-ui/kit';
import { marked } from 'marked';
import { compressImage } from '../helpers/compressImage';

@Component({
    selector: 'app-floatmarkdowneditor',
    imports: [FormsModule, CommonModule, TuiTextarea, TuiGroup, TuiDataList, TuiButton, TuiDropdown, TuiScrollbar],
    template: `
		@if(isEditing() && !disabled){
			<div class="editor-container">
				<div class="editor">
					<div
						tuiGroup
						[collapsed]="false"
						[rounded]="true"
						class="topbar"
						>
						<button tuiButton size="s" iconStart="save" (click)="toggleEdit(true)"></button>
						<button tuiButton size="s" iconStart="x" (click)="toggleEdit(false)"></button>
						@for(item of items(); track item){
							@if(item.items){
								<button
									tuiButton
									tuiChevron
									tuiDropdownHover
									type="button"
									appearance="secondary"
									size="s"
									[iconStart]="item.icon"
									[tuiDropdown]="content"
									#parent
								>
									{{item.label}}
									<ng-template #content>
										<tui-data-list>
											@for(subitem of item.items; track subitem){
												<button tuiOption size="s" appearance="secondary" [iconStart]="subitem.icon" (click)="subitem.command()">{{subitem.label}}</button>
											}
										</tui-data-list>
									</ng-template>
								</button>
							}
							@else {
								<button tuiButton size="s" appearance="secondary" [iconStart]="item.icon" (click)="item.command()">{{item.label}}</button>
							}
						}
					</div>

					<tui-textfield class="editor-field">
						<textarea
							#editor
							placeholder="Markdown Content"
							tuiTextarea
							[(ngModel)]="unsavedValue"
							(input)="formatPreview()"
						></textarea>
					</tui-textfield>
				</div>

				<div class="preview-container">
					<tui-scrollbar class="h-full">
						<div class="preview" #preview>Rendering...</div>
					</tui-scrollbar>
				</div>

				<input type="file" (change)="onFileSelected($event)" #fileUpload [style]="{ display: 'none' }" accept="image/png, image/jpeg" />
			</div>
		}
		@else {
			<div class="preview-readonly-container">
				<button tuiButton class="edit-button" iconStart="edit" appearance="flat" size="s"(click)="toggleEdit(false)"></button>
				<tui-scrollbar class="h-full">
					<div class="preview" #preview>Rendering...</div>
				</tui-scrollbar>
			</div>
		}
    `,
    host: {
        class: 'flex h-full w-full'
    },
    styles: `
		.editor-container {
			display:flex;
			flex-direction: row;
			width: 100%;
			outline: 0.125rem solid var(--tui-background-accent-1);
			border-radius: var(--tui-radius-l);

			.editor {
				display:flex;
				flex-direction: column;
				width: 100%;

				.topbar {
					> :first-child {
						border-bottom-left-radius: 0px !important;
					}

					> :last-child {
						border-bottom-right-radius: 0px !important;
						border-top-right-radius: 0px !important;
					}
				}

				.editor-field {
					block-size:100%;
					border-radius: 0px 0px 0px var(--tui-radius-l);
				}
			}
        }

		.preview-container {
			width:100%;
			border-radius: 0px var(--tui-radius-l) var(--tui-radius-l) 0px;
			transition-property: box-shadow, background-color, outline-color, border-color, color;
			transition-duration: calc(var(--tui-duration) / 2);
			transition-timing-function: var(--tui-curve-productive-standard);
			--t-shadow: 0 0.125rem 0.1875rem rgba(0, 0, 0, 0.1);
			background-color: var(--tui-background-base);
			color: var(--tui-text-tertiary);
			box-shadow: var(--t-shadow);
			outline: 1px solid var(--tui-border-normal);
			outline-offset: -1px;
			border-width: 0;
			block-size:100%;

			::ng-deep .t-content {
				display:flex;
				block-size:auto !important;
			}

			.preview {
				padding:10px;
			}
		}

		.preview-readonly-container {
			width:100%;
			border-radius: var(--tui-radius-l);
			transition-property: box-shadow, background-color, outline-color, border-color, color;
			transition-duration: calc(var(--tui-duration) / 2);
			transition-timing-function: var(--tui-curve-productive-standard);
			--t-shadow: 0 0.125rem 0.1875rem rgba(0, 0, 0, 0.1);
			background-color: var(--tui-background-base);
			color: var(--tui-text-tertiary);
			box-shadow: var(--t-shadow);
			outline: 1px solid var(--tui-border-normal);
			outline-offset: -1px;
			border-width: 0;
			block-size:100%;

			.edit-button {
				position:absolute;
				z-index: 999;
			}

			::ng-deep .t-content {
				display:flex;
				block-size:auto !important;
			}

			.preview {
				padding:10px;
			}
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

	unsavedValue = signal<string>("");

    isFirst : boolean = true;
    isEditing = signal<boolean>(false);

    items = signal<MenuItem[]>([
        {
            label: 'B',
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
        } as MenuItem,
        {
            label: 'I',
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
        } as MenuItem,
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
                } as MenuItem,
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
                } as MenuItem,
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
                } as MenuItem,
            ]
        } as MenuItem,

        {
            icon: 'link',
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
        } as MenuItem,

        {
            icon: 'image',
            command: async () => {
                if (this.editor){
                    this.fileUpload?.nativeElement.click();
                }
            }
        } as MenuItem,
    ])

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
        await this.formatPreview();
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
		if(this.preview){
			if(this.isEditing())
				this.preview.nativeElement.innerHTML = await marked(this.unsavedValue());
			else if (this.value)
				this.preview.nativeElement.innerHTML = await marked(this.value);
		}
    }

	async toggleEdit(save : boolean){
		if (!this.isEditing() && this.value){
			this.unsavedValue.set(this.value)
		}
		if (save && this.isEditing()){
			this.value = this.unsavedValue();
			this.valueChange.emit(this.value);
		}
		this.isEditing.set(!this.isEditing());
		setTimeout(async () => await this.formatPreview(), 500);
	}
}

interface MenuItem {
	label: string;
	icon: string | null;
	items : MenuItem[];
	command() : Promise<any>;
}
