import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { BirdModel } from '../../../../../models/Core/birdModel';
import { TableModule } from 'primeng/table';
import { ListBirdModel } from '../../../../../models/Core/listBirdModel';
import { ButtonModule } from 'primeng/button';
import { HttpClient } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogHelpers } from '../../../helpers/confirmdialoghelpers';
import { APIURL } from '../../../../../../globals';
import { Endpoints } from '../../../../../../Endpoints';
import { JWTTokenHelpers } from '../../../helpers/jwtTokenHelpers';
import { CreatedUpdatedControl } from "../../../../../common/createdupdatedcontrol";
import { FloatTextInput } from "../../../../../common/floattextinput";
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { EditorModule } from 'primeng/editor';
import { DatePickerControl } from "../../../../../common/datepickercontrol";
import { DateHelpers } from '../../../../../helpers/dateHelpers';
import { BirdWeightModel } from '../../../../../models/Core/birdWeightModel';
import { GetDateRangesOutput } from '../../../../../models/Core/getDateRangesOutput';
import { ChartModule } from 'primeng/chart';
import { FloatNumberInput } from "../../../../../common/floatnumberinput";
import {formatDate} from '@angular/common';

@Component({
    selector: 'app-birds-components-weighttracker',
    imports: [FormsModule, CommonModule, DialogModule, TableModule, ButtonModule, ConfirmDialogModule, EditorModule, ChartModule, FloatNumberInput, DatePickerControl],
    template: `
        <div class="flex flex-col gap-2 p-2">
            <p-button icon="pi pi-plus" label="Add Weight Log" rounded raised (click)="showAddWeightLog()" [hidden]="!canWrite" />
            <p-chart type="line" [data]="chartData" [options]="chartOptions" class="h-[30rem]" />
        </div>

        <p-dialog [(visible)]="showBirdWeightDialog" header="Weight Tracking Log" [breakpoints]="{ '960px': '95vw' }" [style]="{ width: '50vw' }" [modal]="true" [draggable]="false">
            <div class="card flex flex-col gap-2">
                <app-floatnumberinput [(value)]="currentBirdWeight.grams" label="Grams"/>
                <app-datepicker [(value)]="currentBirdWeight.timestamp" label="Timestamp"/>
            </div>
            <ng-template #footer>
                <p-button label="Save" icon="pi pi-save" (click)="saveBirdWeight()" [hidden]="!canWrite" />
                <p-confirmdialog />
                <p-button icon="pi pi-times" label="Delete" severity="danger" (click)="deleteBirdWeight(currentBirdWeight.id)" [hidden]="!canWrite || currentBirdWeight.id == ''"></p-button>
            </ng-template>
        </p-dialog>
    `
})
export class WeightTracker implements OnChanges {
    @Input() canRead: boolean = false;
    @Input() canWrite: boolean = false;
    @Input() currentBird: BirdModel = {} as BirdModel;

    allWeights : BirdWeightModel[] = []
    dateRanges : GetDateRangesOutput = {} as GetDateRangesOutput
    
    minDate : Date = new Date();
    maxDate : Date = new Date();
    chartData: any;
    chartOptions: any;

    currentBirdWeight : BirdWeightModel = {} as BirdWeightModel
    showBirdWeightDialog : boolean = false;

    constructor(
        private http: HttpClient,
        private service: MessageService,
        private confirmationService: ConfirmationService,
    ) {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--p-text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
        const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');
        this.chartOptions = {
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }
        };
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["currentBird"] && changes["currentBird"].currentValue != changes["currentBird"].previousValue){
            if (this.currentBird.id != null && this.currentBird.id != "")
                this.loadWeights();
        }
    }

    loadWeights(){
        this.http.get<GetDateRangesOutput>(APIURL + Endpoints.Birds.Weights.Get_GetDateRanges + "?ID=" + this.currentBird.id).subscribe(r => {
            if (r.newest == null || r.newest == '')
                return;
            r.newest = new Date(<Date>r.newest);
            r.oldest = new Date(<Date>r.oldest);
            this.dateRanges = r;

            this.minDate = new Date();
            this.minDate = new Date(this.minDate.getFullYear(), 0, 1);
            this.maxDate = r.newest;
            this.loadWeightsWithin();
        })
    }

    loadWeightsWithin(){
        const documentStyle = getComputedStyle(document.documentElement);
        this.allWeights = []
        this.http.get<BirdWeightModel[]>(APIURL + Endpoints.Birds.Weights.Get_AllBirdWeights + "?BirdID=" + this.currentBird.id + "&From=" + this.minDate.toISOString() + "&To=" + this.maxDate.toISOString()).subscribe(r => {
            r.forEach(b => b.timestamp = new Date(<Date>b.timestamp))            
            this.allWeights = r;
            this.chartData = {
                labels: this.allWeights.map(x => formatDate(x.timestamp, 'dd-MMM-YYYY','en-US')),
                datasets: [
                    {
                        label: "Weight (Grams)",
                        data: this.allWeights.map(x => x.grams),
                        borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
                        tension: 0.4
                    }
                ]
            }
            console.log(this.chartData)
        })
    }

    showAddWeightLog(){
        this.currentBirdWeight = {
            id: '',
            grams: 0,
            birdID: this.currentBird.id,
            timestamp: new Date()
        } as BirdWeightModel
        this.showBirdWeightDialog = true;
    }
    
    saveBirdWeight() {
        if (this.currentBirdWeight.id == '') {
            this.http.post<BirdModel>(APIURL + Endpoints.Birds.Weights.Post_AddBirdWeight, this.currentBirdWeight).subscribe(() => {
                this.showBirdWeightDialog = false;
                this.service.add({ severity: 'info', summary: 'Info Message', detail: 'Weight log created!' });
                this.loadWeights();
            });
        } else {
            this.http.patch<BirdModel>(APIURL + Endpoints.Birds.Weights.Patch_UpdateBirdWeight, this.currentBirdWeight).subscribe(() => {
                this.showBirdWeightDialog = false;
                this.service.add({ severity: 'info', summary: 'Info Message', detail: 'Weight log updated!' });
                this.loadWeights();
            });
        }
    }

    deleteBirdWeight(weightId: string) {
        this.confirmationService.confirm({
            ...ConfirmDialogHelpers.DeleteContent(),
            message: 'Are you sure you want to delete this weight log?',
            accept: () => {
                this.http.delete(APIURL + Endpoints.Birds.Weights.Delete_BirdWeight + '?ID=' + weightId).subscribe(() => {
                    this.service.add({ severity: 'info', summary: 'Info Message', detail: 'Weight log deleted!' });
                    this.showBirdWeightDialog = false;
                    this.loadWeights();
                });
            }
        });
    }
}
