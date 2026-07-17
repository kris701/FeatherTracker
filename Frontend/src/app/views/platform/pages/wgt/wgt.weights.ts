import { CommonModule, formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { EzUIDateInput, EzUIMenuBar, EzUINumberInput, MenuBarItem } from "@kris701/ez-ui";
import { TuiResponsiveDialogService } from '@taiga-ui/addon-mobile';
import { TuiButton, TuiDialog, TuiDropdown, TuiIcon, TuiLoader, TuiNotificationService } from '@taiga-ui/core';
import { TUI_CONFIRM, TuiTiles } from '@taiga-ui/kit';
import { TuiBlockStatusComponent } from "@taiga-ui/layout";
import { ChartEvent } from 'chart.js';
import saveAs from 'file-saver';
import { BaseChartDirective } from 'ng2-charts';
import { firstValueFrom, switchMap } from 'rxjs';
import { Endpoints } from '../../../../../Endpoints';
import { BirdModel } from '../../../../models/COR/birdModel';
import { DeleteRangeModel } from '../../../../models/WGT/deleteRangeModel';
import { GetDateRangesOutput } from '../../../../models/WGT/getDateRangesOutput';
import { WeightModel } from '../../../../models/WGT/weightModel';
import { BirdsService } from '../cor/services/birdsService';

@Component({
    selector: 'app-wgt-weights',
    imports: [
    FormsModule,
    CommonModule,
    BaseChartDirective,
    TuiTiles,
    TuiDropdown,
    TuiButton,
    TuiDialog,
    TuiLoader,
    TuiBlockStatusComponent,
    TuiIcon,
    EzUIDateInput,
    EzUIMenuBar,
    EzUINumberInput
],
    template: `
		<tui-loader class="h-full" [overlay]="true" [loading]="isLoading()">
			<div class="card flex flex-col gap-2 mb-2">
				<ezui-menubar [items]="menuItems" />
				<input #importinput type='file' accept='.csv' multiple (change)='importLogs($event)' style="display:none;">
				<div class="flex flex-row gap-2">
					<ezui-dateinput class="w-full" label="From Date" icon="timer" size="m" [(value)]="currentMinDate" [min]="minDate()" [max]="currentMaxDate()" (ngModelChange)="loadWeightsWithin()"/>
					<ezui-dateinput class="w-full" label="To Date" icon="timer" size="m" [(value)]="currentMaxDate" [min]="currentMinDate()" [max]="maxDate()" (ngModelChange)="loadWeightsWithin()"/>
				</div>
			</div>

			@if(allWeights().length == 0){
				<tui-block-status>
					<tui-icon tuiSlot="top" icon="grid-2x2-x" />
					<h3>No Data</h3>
					No data to display.
				</tui-block-status>
			}
			@else {
				<div class="dashboardwrapper gap-4">
					<div>
						<div class="content">
							<h2 class="title">General</h2>
							<div><b>{{allWeights().length}} datapoints</b></div>
							<div>Highest weight: <b>{{getMaxWeight()}}g</b></div>
							<div>Lowest weight: <b>{{getMinWeight()}}g</b></div>
							<div>Average weight: <b>{{getAvgWeight()}}g</b></div>
						</div>
					</div>

					<div>
						<div class="content dashboardwrapper2col">
							<h2 class="title">Historical Weight</h2>
							<div class="flex flex-row gap-2">
								<button
									tuiButton size="s"
									iconStart="settings"
									appearance="flat-grayscale"
									style="opacity:0.72"
									[tuiDropdown]="chartoptpop"
									[(tuiDropdownOpen)]="chartoptpopvisible"
									(click)="chartoptpopvisible.set(true)"
								></button>
								<p class="content-center">You can click on individual points to edit them.</p>
							</div>
							<canvas baseChart [data]="chartData()" [options]="chartOptions()" type="line" (chartClick)="selectDatapoint($event)"> </canvas>

							<ng-template #chartoptpop>
								<div class="flex flex-col gap-2 m-4">
									<ezui-numberinput label="Standard deviation" icon="weight" size="m" [(value)]="currentStandardDeviation" (valueChange)="processGraph()" [min]="0.1"/>
									<ezui-numberinput label="Min/Max padding" icon="weight" size="m" [(value)]="padding" (valueChange)="processGraph()" [min]="0"/>
								</div>
							</ng-template>
						</div>
					</div>

					<div>
						<div class="content">
							<h2 class="title">Highest Weight Area</h2>
							<canvas baseChart [data]="maxChartData()" [options]="smallChartOptions()" type="line"> </canvas>
						</div>
					</div>

					<div>
						<div class="content">
							<h2 class="title">Lowest Weight Area</h2>
							<canvas baseChart [data]="minChartData()" [options]="smallChartOptions()" type="line"> </canvas>
						</div>
					</div>
				</div>
			}

			<ng-template let-id="id" [tuiDialogOptions]="{size: 's', appearance: 'taiga compact'}" [(tuiDialog)]="showBirdWeightDialog">
				<tui-loader class="h-full" [overlay]="true" [loading]="isLoading()">
					@let current = currentBirdWeight();
					<header [id]="id">Weight Tracking Log</header>
					<div class="flex flex-col gap-2 p-2">
						<ezui-numberinput label="Grams" icon="weight" size="m" [(value)]="current.grams" [min]="0"/>
						<ezui-dateinput label="Timestamp" icon="timer" size="m" [(value)]="current.timestamp"/>
					</div>
					<footer>
						<button tuiButton iconStart="save" size="s" (click)="saveBirdWeight()">Save</button>
						@if(current.id != ''){
							<button tuiButton iconStart="x" size="s" appearance="negative" (click)="deleteBirdWeight(current.id)">Delete</button>
						}
					</footer>
				</tui-loader>
			</ng-template>
		</tui-loader>
    `,
    host: {
        class: 'base-view'
    },
	styles: `
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

			.content {
				block-size: 100%;
				padding: 1rem;
				background: var(--tui-background-base);
				box-sizing: border-box;
				border-radius: var(--tui-radius-l);
				border: 1px solid var(--tui-border-normal);
				overflow: hidden;

				.title {
					margin-top:0px;
				}
			}
        }
	`
})
export class WGTWeights {
    @ViewChild('importinput') inputFile!: ElementRef;

	chartoptpopvisible = signal<boolean>(false);

    menuItems : MenuBarItem[] = [
        {
            label:"Reload",
            icon:"rotate-ccw",
            command: () => this.loadWeights()
        } as MenuBarItem,
        {
            label:"Add Weight Log",
            icon:"plus",
            command: () => this.showAddWeightLog()
        } as MenuBarItem,
        {
            label:"Data Management",
            items: [
                {
                    label:"Import Logs",
                    icon:"file-down",
                    command: () => this.inputFile.nativeElement.click()
                } as MenuBarItem,
                {
                    label:"Export Logs",
                    icon:"file-up",
                    command: () => this.exportLogs()
                } as MenuBarItem,
                {
                    label:"Delete Log Range",
                    icon:"trash-2",
                    command: () => this.purgeLogs()
                } as MenuBarItem
            ] as MenuBarItem[]
        } as MenuBarItem
    ]

    currentBirdId: string | null = null;

    allWeights = signal<WeightModel[]>([])
    dateRanges : GetDateRangesOutput = {} as GetDateRangesOutput

    currentMinDate = signal<Date>(new Date());
    currentMaxDate = signal<Date>(new Date());
    minDate = signal<Date>(new Date());
    maxDate = signal<Date>(new Date());
    chartData = signal<any>(undefined);
    maxChartData = signal<any>(undefined);
    minChartData = signal<any>(undefined);
    chartOptions = signal<any>(undefined);
    smallChartOptions = signal<any>(undefined);
    isLoading = signal<boolean>(true);

    currentBirdWeight = signal<WeightModel>({} as WeightModel)
    showBirdWeightDialog = signal<boolean>(false);

    currentStandardDeviation = signal<number>(2);
    padding = signal<number>(5);

    route = inject(ActivatedRoute);
    loadedQueryOnce: boolean = false;
    constructor(
        private http: HttpClient,
        private service: TuiNotificationService,
        private confirmationService: TuiResponsiveDialogService,
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
        this.isLoading.set(true);
        var r = await firstValueFrom(this.http.get<GetDateRangesOutput>(Endpoints.WGT.Get_GetDateRanges + "?ID=" + this.currentBirdId))
        if (r.newest == null || r.newest == '')
            return;
        r.newest = new Date(<Date>r.newest);
        r.oldest = new Date(<Date>r.oldest);
        this.dateRanges = r

        this.minDate.set(r.oldest);
        this.maxDate.set(r.newest);

        this.currentMinDate.set(r.oldest);
        this.currentMaxDate.set(r.newest);

        if (r.oldest.getFullYear() < (new Date().getFullYear())){
            this.currentMinDate.set(new Date((new Date()).getFullYear(), 0, 1));
        }

        this.isLoading.set(false);
        await this.loadWeightsWithin();
    }

    async loadWeightsWithin(){
        this.isLoading.set(true);
        this.allWeights.set([])
        var r = await firstValueFrom(this.http.get<WeightModel[]>(Endpoints.WGT.Get_AllWeights + "?BirdID=" + this.currentBirdId + "&From=" + this.currentMinDate().toISOString() + "&To=" + this.currentMaxDate().toISOString()))
        r.forEach(b => b.timestamp = new Date(<Date>b.timestamp))
        this.allWeights.set(r);
        this.processGraph();
        this.isLoading.set(false);
    }

    processGraph(){
        var avg = this.getAvgWeight();
        var pointColors : any[] = []
		var weights = this.allWeights();
        weights.forEach(p => {
            var green = 255;
            var red = 255;
            var percentile = 1 * Math.exp(-((Math.abs(p.grams - avg)^2)/(2 * this.currentStandardDeviation()^2)));
            pointColors.push('rgb(' + red * (1 - percentile) + ', ' + green * percentile + ', 0)')
        })
        this.chartOptions.set({
            scales:{
                x: {
                    grid: {
                        drawBorder: false
                    }
                },
                y: {
                    grid: {
                        drawBorder: false
                    },
                    title:{
                        text:"Grams",
                        display:true
                    },
                    min: this.getMinWeight() - this.padding(),
                    max: this.getMaxWeight() + this.padding()
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
        });
        this.smallChartOptions.set({
            scales:{
                x: {
                    grid: {
                        drawBorder: false
                    }
                },
                y: {
                    grid: {
                        drawBorder: false
                    },
                    title:{
                        text:"Grams",
                        display:true
                    },
                    min: this.getMinWeight() - this.padding(),
                    max: this.getMaxWeight() + this.padding()
                }
            },
            plugins: {
                legend:{
                    display:false
                }
            }
        });
        this.chartData.set({
            labels: weights.map(x => formatDate(x.timestamp, 'dd-MMM-yyyy','en-US')),
            datasets: [
                {
                    label: "Weight (Grams)",
                    data: weights.map(x => x.grams),
					pointBackgroundColor: pointColors,
                    pointBorderColor: pointColors,
                    tension: 0.4,
                    pointRadius: 10,
                    pointHoverRadius: 15
                },
                {
                    label: "Max",
                    data: Array(weights.length).fill(this.getMaxWeight()),
                    pointStyle: false,
                    borderDash: [2,5]
                },
                {
                    label: "Min",
                    data: Array(weights.length).fill(this.getMinWeight()),
                    pointStyle: false,
                    borderDash: [2,5]
                }
            ]
        })

        var rangeTargets = 3;

        var maxDatapoint = weights.find(x => x.grams == this.getMaxWeight());
        if (maxDatapoint){
            var highestIndex = weights.indexOf(maxDatapoint)
            if (highestIndex != -1){
                var minIndex = highestIndex - rangeTargets;
                if (minIndex < 0)
                    minIndex = 0;
                var maxIndex = highestIndex + rangeTargets;
                if (maxIndex > weights.length - 1)
                    maxIndex = weights.length - 1;

                var subset = weights.slice(minIndex, maxIndex)

                this.maxChartData.set({
                    labels: subset.map(x => formatDate(x.timestamp, 'dd-MMM-yyyy','en-US')),
                    datasets: [
                        {
                            label: "Weight (Grams)",
                            data: subset.map(x => x.grams),
                            tension: 0.4,
                            pointRadius: 10,
                            pointHoverRadius: 15
                        }
                    ]
                })
            }
        }
        var minDatapoint = weights.find(x => x.grams == this.getMinWeight());
        if (minDatapoint){
            var highestIndex = weights.indexOf(minDatapoint)
            if (highestIndex != -1){
                var minIndex = highestIndex - rangeTargets;
                if (minIndex < 0)
                    minIndex = 0;
                var maxIndex = highestIndex + rangeTargets;
                if (maxIndex > weights.length - 1)
                    maxIndex = this.allWeights.length - 1;

                var subset = weights.slice(minIndex, maxIndex)

                this.minChartData.set({
                    labels: subset.map(x => formatDate(x.timestamp, 'dd-MMM-yyyy','en-US')),
                    datasets: [
                        {
                            label: "Weight (Grams)",
                            data: subset.map(x => x.grams),
                            tension: 0.4,
                            pointRadius: 10,
                            pointHoverRadius: 15
                        }
                    ]
                })
            }
        }
    }

    showAddWeightLog(){
        this.currentBirdWeight.set({
            id: '',
            grams: 0,
            birdID: this.currentBirdId,
            timestamp: new Date()
        } as WeightModel)
        this.showBirdWeightDialog.set(true);
    }

    async saveBirdWeight() {
		this.isLoading.set(true);
        if (this.currentBirdWeight().id == '') {
            await firstValueFrom(this.http.post<BirdModel>(Endpoints.WGT.Post_AddWeight, this.currentBirdWeight()))
            this.showBirdWeightDialog.set(false);
			this.service.open("Weight log created!", {
				label: "Log Created",
				appearance: 'positive',
				autoClose: 1000
			}).subscribe();
			this.isLoading.set(false);
            await this.loadWeights();
        } else {
            await firstValueFrom(this.http.patch<BirdModel>(Endpoints.WGT.Patch_UpdateWeight, this.currentBirdWeight()))
            this.showBirdWeightDialog.set(false);
			this.service.open("Weight log updated!", {
				label: "Log Updated",
				appearance: 'positive',
				autoClose: 1000
			}).subscribe();
			this.isLoading.set(false);
            await this.loadWeights();
        }
    }

    deleteBirdWeight(weightId: string) {
		this.confirmationService.open<boolean>(
			TUI_CONFIRM,
			{
				label: 'Are you sure you want to delete this weight log?',
				size: 's'
			})
			.pipe(switchMap(async (response) => {
				if (response === true)
				{
					var input = {
						iDs: [weightId]
					} as DeleteRangeModel
					await firstValueFrom(this.http.patch(Endpoints.WGT.Patch_DeleteWeights, input))
					this.service.open("Weight log deleted!", {
						label: "Log Deleted",
						appearance: 'positive',
						autoClose: 1000
					}).subscribe();
					this.showBirdWeightDialog.set(false);
					await this.loadWeights();
				}
			}))
			.subscribe();
    }

    selectDatapoint(event : { event?: ChartEvent; active?: object[]; }){
		if (event.active && event.active?.length > 0){
			var target = event.active.find(x => (<any>x).datasetIndex == 0);
			if (target){
				this.currentBirdWeight.set(this.allWeights()[<number>(<any>target).index]);
				this.showBirdWeightDialog.set(true);
			}
		}
    }

    getMaxWeight(){
        return Math.max(...this.allWeights().map(x => x.grams))
    }

    getMinWeight(){
        return Math.min(...this.allWeights().map(x => x.grams))
    }

    getAvgWeight(){
        var sum = 0;
        this.allWeights().forEach(l => sum += l.grams)
        return Math.round(sum / this.allWeights().length);
    }

    exportLogs(){
        this.isLoading.set(true);
        var content = "timestamp,grams\n";
        this.allWeights().forEach(w => {
            content += new Date(<Date>w.timestamp).toISOString() + "," + w.grams + "\n";
        });
        var data : Blob = new Blob(
            [content], {
            type: 'text/plain'
        });
        saveAs(data, "Feather Tracker Export " + new Date().toISOString() + ".csv")
        this.isLoading.set(false);
    }

    async importLogs(event : Event){
        if (confirm("Are you sure you want to import data? This will simply merge it with all the existing data for this bird.")){
            this.isLoading.set(true);
            let input = <any>event.target;
            const formData = new FormData();
            formData.append('file', input.files[0]);
            await firstValueFrom(this.http.post(Endpoints.WGT.Post_ImportWeights + "?BirdID=" + this.currentBirdId, formData))
            this.isLoading.set(false);
            input.value = null
            await this.loadWeights();
        }
    }

    purgeLogs(){
		this.confirmationService.open<boolean>(
			TUI_CONFIRM,
			{
				label: 'Are you sure you want to delete all ' + this.allWeights().length + ' logs for this period? This action can not be reverted!',
				size: 's'
			})
			.pipe(switchMap(async (response) => {
				if (response === true)
				{
					this.isLoading.set(true);
					var input = {
						iDs: this.allWeights().map(x => x.id)
					} as DeleteRangeModel
					await firstValueFrom(this.http.patch(Endpoints.WGT.Patch_DeleteWeights, input));
					this.isLoading.set(false);
					await this.loadWeights();
				}
			}))
			.subscribe();
    }
}

