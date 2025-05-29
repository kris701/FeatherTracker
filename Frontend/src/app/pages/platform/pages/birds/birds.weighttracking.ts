import { CommonModule, formatDate } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { PasswordModule } from 'primeng/password';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { PermissionsTable } from '../../../../../PermissionsTable';
import { PermissionHelpers } from '../../helpers/permissionHelpers';
import { ListBirdModel } from '../../../../models/Core/listBirdModel';
import { BirdModel } from '../../../../models/Core/birdModel';
import { HttpClient } from '@angular/common/http';
import { APIURL } from '../../../../../globals';
import { Endpoints } from '../../../../../Endpoints';
import { FloatSelectControl } from "../../../../common/floatselectcontrol";
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { BirdWeightModel } from '../../../../models/Core/birdWeightModel';
import { GetDateRangesOutput } from '../../../../models/Core/getDateRangesOutput';
import { ConfirmDialogHelpers } from '../../helpers/confirmdialoghelpers';
import { FloatTextInput } from '../../../../common/floattextinput';
import { ChartModule } from 'primeng/chart';
import { DatePickerControl } from '../../../../common/datepickercontrol';
import { FloatNumberInput } from '../../../../common/floatnumberinput';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import saveAs from 'file-saver';
import { PurgeBirdWeightsInput } from '../../../../models/Core/purgeBirdWeightsInput';
import { MenubarModule } from 'primeng/menubar';
import { InputNumberModule } from 'primeng/inputnumber';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Chart } from 'chart.js';
import { min, repeat } from 'rxjs';
Chart.register(zoomPlugin);

@Component({
    selector: 'app-birds-weighttracking',
    imports: [FormsModule, CommonModule, DialogModule, ButtonModule, FloatLabelModule, InputTextModule, MultiSelectModule, PasswordModule, TableModule, ChipModule, TooltipModule, ConfirmDialogModule, TagModule, ChartModule, FloatNumberInput, DatePickerControl, ProgressSpinnerModule, MenubarModule, InputNumberModule],
    template: `
        <p-confirmdialog />
        <div class="card flex flex-col gap-3">
            <p-menubar [model]="menuItems" />
            <input #importinput type='file' accept='.csv' multiple (change)='importLogs($event)' style="display:none;">
            <div class="flex flex-row gap-2">
                <app-datepicker [(value)]="currentMinDate" label="From Date" class="w-full" (valueChange)="loadWeightsWithin()" [min]="minDate" [max]="currentMaxDate" [disabled]="isLoading"/>
                <app-datepicker [(value)]="currentMaxDate" label="To Date" class="w-full" (valueChange)="loadWeightsWithin()" [min]="currentMinDate" [max]="maxDate" [disabled]="isLoading"/>
            </div>
        </div>

        <div class="flex flex-col gap-2 p-2">                
            <p-tag severity="warn" *ngIf="!isLoading && allWeights.length == 0">No data to show!</p-tag>
            <p-progress-spinner *ngIf="isLoading"/>
        </div>
        <div class="dashboardwrapper gap-8" *ngIf="!isLoading && allWeights.length > 0">
            <div>
                <div class="card">
                    <div class="font-semibold text-xl mb-4">General</div>
                    <div class="font-semibold text-l mb-4">Highest weight: <b>{{getMaxWeight()}}g</b></div>
                    <div class="font-semibold text-l mb-4">Lowest weight: <b>{{getMinWeight()}}g</b></div>
                    <div class="font-semibold text-l mb-4">Average weight: <b>{{getAvgWeight()}}g</b></div>
                    
                </div>
                <div class="card" style="grid-column:span 2">
                    <div class="font-semibold text-xl mb-4">Historical Weight</div>
                    <p>You can click on individual points to edit them.</p>
                    <p-chart type="line" [data]="chartData" [options]="chartOptions" (onDataSelect)="selectDatapoint($event)"/>
                    <div class="flex flex-row gap-2 pt-5">
                        <p-floatlabel class="w-full">
                            <p-inputnumber inputId="stddevlabel" [(ngModel)]="currentStandardDeviation" [showButtons]="true" buttonLayout="horizontal" inputId="horizontal" spinnerMode="horizontal" [step]="0.25" (ngModelChange)="processGraph()" [min]="0.1" class="w-full">
                                <ng-template #incrementbuttonicon>
                                    <span class="pi pi-plus"></span>
                                </ng-template>
                                <ng-template #decrementbuttonicon>
                                    <span class="pi pi-minus"></span>
                                </ng-template>
                            </p-inputnumber>
                            <label for="stddevlabel">Standard deviation</label>
                        </p-floatlabel>
                        <p-floatlabel class="w-full">
                            <p-inputnumber inputId="paddinglabel" [(ngModel)]="padding" [showButtons]="true" buttonLayout="horizontal" inputId="horizontal" spinnerMode="horizontal" [step]="1" (ngModelChange)="processGraph()" [min]="0" class="w-full">
                                <ng-template #incrementbuttonicon>
                                    <span class="pi pi-plus"></span>
                                </ng-template>
                                <ng-template #decrementbuttonicon>
                                    <span class="pi pi-minus"></span>
                                </ng-template>
                            </p-inputnumber>
                            <label for="paddinglabel">Min/Max padding</label>
                        </p-floatlabel>
                    </div>
                </div>
            </div>
        </div>

        <p-dialog [(visible)]="showBirdWeightDialog" header="Weight Tracking Log" [breakpoints]="{ '960px': '95vw' }" [style]="{ width: '50vw' }" [modal]="true" [draggable]="false">
            <div class="card flex flex-col gap-2">
                <app-floatnumberinput [(value)]="currentBirdWeight.grams" label="Grams"/>
                <app-datepicker [(value)]="currentBirdWeight.timestamp" label="Timestamp"/>
            </div>
            <ng-template #footer>
                <p-button label="Save" icon="pi pi-save" (click)="saveBirdWeight()" [hidden]="!canWrite" />
                <p-button icon="pi pi-times" label="Delete" severity="danger" (click)="deleteBirdWeight(currentBirdWeight.id)" [hidden]="!canWrite || currentBirdWeight.id == ''"></p-button>
            </ng-template>
        </p-dialog>
    `
})
export class BirdsWeightTracking {
    canRead: boolean = PermissionHelpers.HasPermission(PermissionsTable.Birds_Weight_Read);
    canWrite: boolean = PermissionHelpers.HasPermission(PermissionsTable.Birds_Weight_Write);
    @ViewChild('importinput') inputFile!: ElementRef;

    menuItems : MenuItem[] = [
        {
            icon:"pi pi-refresh",
            command: () => this.loadWeights()
        },
        {
            label:"Add Weight Log",
            icon:"pi pi-plus",
            command: () => this.showAddWeightLog()
        },
        {
            label:"Data Management",
            items: [
                {
                    label:"Import Logs",
                    icon:"pi pi-file-import",
                    command: () => this.inputFile.nativeElement.click()
                },
                {
                    label:"Export Logs",
                    icon:"pi pi-file-export",
                    command: () => this.exportLogs()
                },
                {
                    label:"Purge",
                    icon:"pi pi-trash",
                    command: () => this.purgeLogs()
                },
            ]
        }
    ]

    allBirds: ListBirdModel[] = [];
    currentBird: ListBirdModel = {} as ListBirdModel;

    allWeights : BirdWeightModel[] = []
    dateRanges : GetDateRangesOutput = {} as GetDateRangesOutput
    
    currentMinDate : Date = new Date();
    currentMaxDate : Date = new Date();
    minDate : Date = new Date();
    maxDate : Date = new Date();
    chartData: any;
    chartOptions: any;
    isLoading : boolean = true;

    currentBirdWeight : BirdWeightModel = {} as BirdWeightModel
    showBirdWeightDialog : boolean = false;

    currentStandardDeviation : number = 2;
    padding : number = 5;

    route = inject(ActivatedRoute);
    loadedQueryOnce: boolean = false;
    constructor(
        private http: HttpClient,
        private service: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router
    ) {
        router.events.subscribe((val) => {
            if (val instanceof NavigationEnd){
                this.loadedQueryOnce = false;
                this.processQueryParameters();
            }
        })
    }

    ngOnInit(){
        this.loadBirds();
    }

    loadWeights(){
        this.isLoading = true;
        this.http.get<GetDateRangesOutput>(APIURL + Endpoints.Birds.Weights.Get_GetDateRanges + "?ID=" + this.currentBird.id).subscribe(r => {
            if (r.newest == null || r.newest == '')
                return;
            r.newest = new Date(<Date>r.newest);
            r.oldest = new Date(<Date>r.oldest);
            this.dateRanges = r

            this.minDate = r.oldest;
            this.maxDate = r.newest;

            this.currentMinDate = r.oldest;
            this.currentMaxDate = r.newest;

            if (this.currentMinDate.getFullYear() < (new Date().getFullYear())){
                this.currentMinDate = new Date((new Date()).getFullYear(), 0, 1);
            }

            this.isLoading = false;
            this.loadWeightsWithin();
        })
    }

    loadWeightsWithin(){
        this.isLoading = true;
        this.allWeights = []
        this.http.get<BirdWeightModel[]>(APIURL + Endpoints.Birds.Weights.Get_AllBirdWeights + "?BirdID=" + this.currentBird.id + "&From=" + this.currentMinDate.toISOString() + "&To=" + this.currentMaxDate.toISOString()).subscribe(r => {
            r.forEach(b => b.timestamp = new Date(<Date>b.timestamp))
            this.allWeights = r;
            this.processGraph();
            this.isLoading = false;
        })
    }

    processGraph(){
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--p-text-color');
        const redColor = documentStyle.getPropertyValue('--p-red-300');
        const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
        const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');
        var avg = this.getAvgWeight();
        var pointColors : any[] = []
        this.allWeights.forEach(p => {
            var green = 255;
            var red = 255;
            var percentile = 1 * Math.exp(-((Math.abs(p.grams - avg)^2)/(2 * this.currentStandardDeviation^2)));
            pointColors.push('rgb(' + red * (1 - percentile) + ', ' + green * percentile + ', 0)')
        })
        this.chartOptions = {
            scales:{
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: textColorSecondary,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: textColorSecondary,
                        drawBorder: false
                    },
                    title:{
                        text:"Grams",
                        display:true,
                        color:textColorSecondary
                    },
                    min: this.getMinWeight() - this.padding,
                    max: this.getMaxWeight() + this.padding
                }
            },
            plugins: {
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'x',
                    },
                    pan: {
                        enabled: true,
                        mode: 'x',
                    },
                },
                legend:{
                    display:false
                }
            }
        };
        this.chartData = {
            labels: this.allWeights.map(x => formatDate(x.timestamp, 'dd-MMM-YYYY','en-US')),
            datasets: [
                {
                    label: "Weight (Grams)",
                    data: this.allWeights.map(x => x.grams),
                    borderColor: documentStyle.getPropertyValue('--p-primary-color'),
                    pointBorderColor: pointColors,
                    tension: 0.4,
                    pointRadius: 10,
                    pointHoverRadius: 15
                },
                {
                    label: "Max",
                    data: Array(this.allWeights.length).fill(this.getMaxWeight()),
                    borderColor: redColor,
                    pointStyle: false,
                    borderDash: [2,5]
                },
                {
                    label: "Min",
                    data: Array(this.allWeights.length).fill(this.getMinWeight()),
                    borderColor: redColor,
                    pointStyle: false,
                    borderDash: [2,5]
                }
            ]
        }
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

    loadBirds() {
        this.http.get<ListBirdModel[]>(APIURL + Endpoints.Birds.Get_AllBirds).subscribe((l) => {
            l.forEach(b => b.birthDate = new Date(<Date>b.birthDate))
            this.allBirds = l;
            this.processQueryParameters();
        });
    }

    selectDatapoint(event : Event){
        if ('element' in event && 'index' in <any>event.element && 'datasetIndex' in <any>event.element && (<any>event.element).datasetIndex == 0){
            this.currentBirdWeight = this.allWeights[<number>(<any>event.element).index];
            this.showBirdWeightDialog = true;
        }
    }

    processQueryParameters() {
        if (this.loadedQueryOnce) return;
        this.loadedQueryOnce = true;
        if (this.route.snapshot.queryParamMap.has('id')) {
            var targetID = this.route.snapshot.queryParamMap.get('id');
            if (targetID) {
                var targetBird = this.allBirds.find(x => x.id == targetID)
                if (targetBird)
                {
                    this.currentBird = targetBird;
                    this.loadWeights();
                }
            }
        }
    }

    getMaxWeight(){
        return Math.max(...this.allWeights.map(x => x.grams))
    }

    getMinWeight(){
        return Math.min(...this.allWeights.map(x => x.grams))
    }

    getAvgWeight(){
        var sum = 0;
        this.allWeights.forEach(l => sum += l.grams)
        return Math.round(sum / this.allWeights.length);
    }

    exportLogs(){
        this.isLoading = true;
        var content = "timestamp,grams\n";
        this.allWeights.forEach(w => {
            content += new Date(<Date>w.timestamp).toISOString() + "," + w.grams + "\n";
        });
        var data : Blob = new Blob(
            [content], {
            type: 'text/plain'
        });
        saveAs(data, "Feather Tracker Export " + new Date().toISOString() + ".csv")
        this.isLoading = false;
    }

    importLogs(event : Event){
        if (confirm("Are you sure you want to import data? This will simply merge it with all the existing data for this bird.")){
            this.isLoading = true;
            let input = <any>event.target;
            const formData = new FormData();
            formData.append('file', input.files[0]);
            this.http.post(APIURL + Endpoints.Birds.Weights.Post_ImportWeights + "?BirdID=" + this.currentBird.id, formData).subscribe(r => {
                this.isLoading = false;
                input.value = null
                this.loadWeights();
            });
        }
    }

    purgeLogs(){
        this.confirmationService.confirm({
            ...ConfirmDialogHelpers.DeleteContent(),
            message: 'Are you sure you want to delete all ' + this.allWeights.length + ' logs for this period? This action can not be reverted!',
            accept: () => {
                this.isLoading = true;
                var input = {
                    iDs: this.allWeights.map(x => x.id)
                } as PurgeBirdWeightsInput
                this.http.patch(APIURL + Endpoints.Birds.Weights.Patch_PurgeBirdWeights, input).subscribe(() => {
                    this.isLoading = false;                
                    this.loadWeights();
                });
            }
        });
    }
}
