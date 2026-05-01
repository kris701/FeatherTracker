import { CommonModule, formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Chart } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import saveAs from 'file-saver';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { Menubar } from "primeng/menubar";
import { MultiSelectModule } from 'primeng/multiselect';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinner } from "primeng/progressspinner";
import { SplitterModule } from 'primeng/splitter';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { firstValueFrom } from 'rxjs';
import { Endpoints } from '../../../../../Endpoints';
import { FloatDatePicker } from "../../../../common/components/floatdatepicker";
import { FloatNumberInput } from "../../../../common/components/floatnumberinput";
import { BirdModel } from '../../../../models/COR/birdModel';
import { DeleteRangeModel } from '../../../../models/WGT/deleteRangeModel';
import { GetDateRangesOutput } from '../../../../models/WGT/getDateRangesOutput';
import { WeightModel } from '../../../../models/WGT/weightModel';
import { ConfirmDialogHelpers } from '../../helpers/confirmdialoghelpers';
import { BirdsService } from '../../services/birdsService';
Chart.register(zoomPlugin);

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
    TagModule,
    SplitterModule,
    TextareaModule,
    Menubar,
    FloatDatePicker,
    ProgressSpinner,
    FloatNumberInput,
    ChartModule,
    MenuModule,
    InputNumberModule
],
    template: `
        <div class="card flex flex-col gap-3">
            <p-menubar [model]="menuItems" />
            <input #importinput type='file' accept='.csv' multiple (change)='importLogs($event)' style="display:none;">
            <div class="flex flex-row gap-2">
                <app-floatdatepicker [(value)]="currentMinDate" label="From Date" class="w-full" (valueChange)="loadWeightsWithin()" [min]="minDate" [max]="currentMaxDate" [disabled]="isLoading"/>
                <app-floatdatepicker [(value)]="currentMaxDate" label="To Date" class="w-full" (valueChange)="loadWeightsWithin()" [min]="currentMinDate" [max]="maxDate" [disabled]="isLoading"/>
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
                    <div class="font-semibold text-l mb-4"><b>{{allWeights.length}} datapoints</b></div>
                    <div class="font-semibold text-l mb-4">Highest weight: <b>{{getMaxWeight()}}g</b></div>
                    <div class="font-semibold text-l mb-4">Lowest weight: <b>{{getMinWeight()}}g</b></div>
                    <div class="font-semibold text-l mb-4">Average weight: <b>{{getAvgWeight()}}g</b></div>
                </div>
            </div>
            <div>
                <div class="card dashboardwrapper2col">
                    <div class="font-semibold text-xl mb-4">Historical Weight</div>
                    <div class="flex flex-row gap-2">
                        <p-button (click)="menu.toggle($event)" icon="pi pi-cog"/>
                        <p class="content-center">You can click on individual points to edit them.</p>
                    </div>
                    <p-chart type="line" [data]="chartData" [options]="chartOptions" (onDataSelect)="selectDatapoint($event)"/>

                    <p-menu #menu [popup]="true">
                        <ng-template #start>
                            <div class="flex flex-col gap-2 p-5">
                                <label>Standard deviation</label>
                                <p-inputnumber [(ngModel)]="currentStandardDeviation" [showButtons]="true" buttonLayout="horizontal" inputId="horizontal" spinnerMode="horizontal" [step]="0.25" (ngModelChange)="processGraph()" [min]="0.1" class="w-full">
                                    <ng-template #incrementbuttonicon>
                                        <span class="pi pi-plus"></span>
                                    </ng-template>
                                    <ng-template #decrementbuttonicon>
                                        <span class="pi pi-minus"></span>
                                    </ng-template>
                                </p-inputnumber>

                                <label>Min/Max padding</label>
                                <p-inputnumber [(ngModel)]="padding" [showButtons]="true" buttonLayout="horizontal" inputId="horizontal" spinnerMode="horizontal" [step]="1" (ngModelChange)="processGraph()" [min]="0" class="w-full">
                                    <ng-template #incrementbuttonicon>
                                        <span class="pi pi-plus"></span>
                                    </ng-template>
                                    <ng-template #decrementbuttonicon>
                                        <span class="pi pi-minus"></span>
                                    </ng-template>
                                </p-inputnumber>
                            </div>
                        </ng-template>
                    </p-menu>
                </div>
            </div>
            <div>
                <div class="card">
                    <div class="font-semibold text-xl mb-4">Highest Weight Area</div>
                    <p-chart type="line" [data]="maxChartData" [options]="smallChartOptions"/>
                </div>
            </div>
            <div>
                <div class="card">
                    <div class="font-semibold text-xl mb-4">Lowest Weight Area</div>
                    <p-chart type="line" [data]="minChartData" [options]="smallChartOptions"/>
                </div>
            </div>
        </div>

        <p-dialog [(visible)]="showBirdWeightDialog" header="Weight Tracking Log" [breakpoints]="{ '960px': '95vw' }" [style]="{ width: '50vw' }" [modal]="true" [draggable]="false">
            <div class="flex flex-col gap-2 p-2">
                <app-floatnumberinput [(value)]="currentBirdWeight.grams" label="Grams"/>
                <app-floatdatepicker [(value)]="currentBirdWeight.timestamp" label="Timestamp"/>
            </div>
            <ng-template #footer>
                <p-button label="Save" icon="pi pi-save" (click)="saveBirdWeight()" />
                <p-button icon="pi pi-times" label="Delete" severity="danger" (click)="deleteBirdWeight(currentBirdWeight.id)" [hidden]="currentBirdWeight.id == ''"></p-button>
            </ng-template>
        </p-dialog>
    `,
    host: {
        class: 'flex flex-col flex-grow'
    },
    styles : `
        @media (min-width: 900px){
            .dashboardwrapper2col {
                grid-column:span 2
            }
        }
        @media (max-width: 900px){
            .dashboardwrapper {
                display: grid;
                grid-template-columns: 1fr;
                grid-auto-flow: dense;
            }
        }
        @media (min-width: 900px){
            .dashboardwrapper {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                grid-auto-flow: dense;
            }
        }

        .dashboardwrapper > * {
            display: contents;
            margin-bottom: 0px !important;
        }
    `
})
export class WGTWeights {
    @ViewChild('importinput') inputFile!: ElementRef;

    menuItems : MenuItem[] = [
        {
            label:"Reload",
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
                    label:"Delete Log Range",
                    icon:"pi pi-trash",
                    command: () => this.purgeLogs()
                }
            ]
        }
    ]

    currentBirdId: string | null = null;

    allWeights : WeightModel[] = []
    dateRanges : GetDateRangesOutput = {} as GetDateRangesOutput

    currentMinDate : Date = new Date();
    currentMaxDate : Date = new Date();
    minDate : Date = new Date();
    maxDate : Date = new Date();
    chartData: any;
    maxChartData: any;
    minChartData: any;
    chartOptions: any;
    smallChartOptions: any;
    isLoading : boolean = true;

    currentBirdWeight : WeightModel = {} as WeightModel
    showBirdWeightDialog : boolean = false;

    currentStandardDeviation : number = 2;
    padding : number = 5;

    route = inject(ActivatedRoute);
    loadedQueryOnce: boolean = false;
    constructor(
        private http: HttpClient,
        private service: MessageService,
        private confirmationService: ConfirmationService,
        public birdsService : BirdsService,
        private router: Router
    ){
        router.events.subscribe(async (val) => {
            if (val instanceof NavigationEnd){
                this.loadedQueryOnce = false;
                await this.processQueryParameters();
            }
        })
    }

    async ngOnInit(){
        await this.processQueryParameters();
    }

    async processQueryParameters() {
        if (this.loadedQueryOnce) return;
        this.loadedQueryOnce = true;
        if (this.route.snapshot.queryParamMap.has('id')) {
            var targetID = this.route.snapshot.queryParamMap.get('id');
            if (targetID) {
                this.currentBirdId = targetID;
                await this.loadWeights();
            }
        }
    }

    async loadWeights(){
        this.isLoading = true;
        var r = await firstValueFrom(this.http.get<GetDateRangesOutput>(Endpoints.WGT.Get_GetDateRanges + "?ID=" + this.currentBirdId))
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
        await this.loadWeightsWithin();
    }

    async loadWeightsWithin(){
        this.isLoading = true;
        this.allWeights = []
        var r = await firstValueFrom(this.http.get<WeightModel[]>(Endpoints.WGT.Get_AllWeights + "?BirdID=" + this.currentBirdId + "&From=" + this.currentMinDate.toISOString() + "&To=" + this.currentMaxDate.toISOString()))
        r.forEach(b => b.timestamp = new Date(<Date>b.timestamp))
        this.allWeights = r;
        this.processGraph();
        this.isLoading = false;
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
        this.smallChartOptions = {
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
                legend:{
                    display:false
                }
            }
        };
        this.chartData = {
            labels: this.allWeights.map(x => formatDate(x.timestamp, 'dd-MMM-yyyy','en-US')),
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

        var rangeTargets = 3;

        var maxDatapoint = this.allWeights.find(x => x.grams == this.getMaxWeight());
        if (maxDatapoint){
            var highestIndex = this.allWeights.indexOf(maxDatapoint)
            if (highestIndex != -1){
                var minIndex = highestIndex - rangeTargets;
                if (minIndex < 0)
                    minIndex = 0;
                var maxIndex = highestIndex + rangeTargets;
                if (maxIndex > this.allWeights.length - 1)
                    maxIndex = this.allWeights.length - 1;

                var subset = this.allWeights.slice(minIndex, maxIndex)

                this.maxChartData = {
                    labels: subset.map(x => formatDate(x.timestamp, 'dd-MMM-yyyy','en-US')),
                    datasets: [
                        {
                            label: "Weight (Grams)",
                            data: subset.map(x => x.grams),
                            borderColor: documentStyle.getPropertyValue('--p-primary-color'),
                            tension: 0.4,
                            pointRadius: 10,
                            pointHoverRadius: 15
                        }
                    ]
                }
            }
        }
        var minDatapoint = this.allWeights.find(x => x.grams == this.getMinWeight());
        if (minDatapoint){
            var highestIndex = this.allWeights.indexOf(minDatapoint)
            if (highestIndex != -1){
                var minIndex = highestIndex - rangeTargets;
                if (minIndex < 0)
                    minIndex = 0;
                var maxIndex = highestIndex + rangeTargets;
                if (maxIndex > this.allWeights.length - 1)
                    maxIndex = this.allWeights.length - 1;

                var subset = this.allWeights.slice(minIndex, maxIndex)

                this.minChartData = {
                    labels: subset.map(x => formatDate(x.timestamp, 'dd-MMM-yyyy','en-US')),
                    datasets: [
                        {
                            label: "Weight (Grams)",
                            data: subset.map(x => x.grams),
                            borderColor: documentStyle.getPropertyValue('--p-primary-color'),
                            tension: 0.4,
                            pointRadius: 10,
                            pointHoverRadius: 15
                        }
                    ]
                }
            }
        }
    }

    showAddWeightLog(){
        this.currentBirdWeight = {
            id: '',
            grams: 0,
            birdID: this.currentBirdId,
            timestamp: new Date()
        } as WeightModel
        this.showBirdWeightDialog = true;
    }

    async saveBirdWeight() {
        if (this.currentBirdWeight.id == '') {
            await firstValueFrom(this.http.post<BirdModel>(Endpoints.WGT.Post_AddWeight, this.currentBirdWeight))
            this.showBirdWeightDialog = false;
            this.service.add({ severity: 'info', summary: 'Info Message', detail: 'Weight log created!' });
            await this.loadWeights();
        } else {
            await firstValueFrom(this.http.patch<BirdModel>(Endpoints.WGT.Patch_UpdateWeight, this.currentBirdWeight))
            this.showBirdWeightDialog = false;
            this.service.add({ severity: 'info', summary: 'Info Message', detail: 'Weight log updated!' });
            await this.loadWeights();
        }
    }

    deleteBirdWeight(weightId: string) {
        this.confirmationService.confirm({
            ...ConfirmDialogHelpers.DeleteContent(),
            message: 'Are you sure you want to delete this weight log?',
            accept: async () => {
                var input = {
                    iDs: [weightId]
                } as DeleteRangeModel
                await firstValueFrom(this.http.patch(Endpoints.WGT.Patch_DeleteWeights, input))
                this.service.add({ severity: 'info', summary: 'Info Message', detail: 'Weight log deleted!' });
                this.showBirdWeightDialog = false;
                await this.loadWeights();
            }
        });
    }

    selectDatapoint(event : Event){
        if ('element' in event && 'index' in <any>event.element && 'datasetIndex' in <any>event.element && (<any>event.element).datasetIndex == 0){
            this.currentBirdWeight = this.allWeights[<number>(<any>event.element).index];
            this.showBirdWeightDialog = true;
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

    async importLogs(event : Event){
        if (confirm("Are you sure you want to import data? This will simply merge it with all the existing data for this bird.")){
            this.isLoading = true;
            let input = <any>event.target;
            const formData = new FormData();
            formData.append('file', input.files[0]);
            await firstValueFrom(this.http.post(Endpoints.WGT.Post_ImportWeights + "?BirdID=" + this.currentBirdId, formData))
            this.isLoading = false;
            input.value = null
            await this.loadWeights();
        }
    }

    purgeLogs(){
        this.confirmationService.confirm({
            ...ConfirmDialogHelpers.DeleteContent(),
            message: 'Are you sure you want to delete all ' + this.allWeights.length + ' logs for this period? This action can not be reverted!',
            accept: async () => {
                this.isLoading = true;
                var input = {
                    iDs: this.allWeights.map(x => x.id)
                } as DeleteRangeModel
                await firstValueFrom(this.http.patch(Endpoints.WGT.Patch_DeleteWeights, input));
                this.isLoading = false;
                await this.loadWeights();
            }
        });
    }
}
