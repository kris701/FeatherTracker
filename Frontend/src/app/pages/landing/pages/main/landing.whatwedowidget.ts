import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../../../layout/services/layout.service';

@Component({
    selector: 'landing-whatwedo-widget',
    standalone: true,
    imports: [CommonModule],
    template: ` <div>
        <div class="justify-center">
            <div class="text-center">
                <div class=" font-normal mb-2 text-4xl">What this website can do</div>
                <span class="text-muted-color text-2xl">Here are a few of the things you can use this website for.</span>
            </div>

            <div class="flex flex-row gap-8 justify-center flex-wrap mt-5 mb-5">
                <div class="card mb-0 w-full lg:w-80">
                    <div class="flex items-center justify-center bg-yellow-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                        <i class="pi pi-fw pi-users !text-2xl text-yellow-700"></i>
                    </div>
                    <h5 class="mb-2 ">Free Signup</h5>
                    <span class="text-surface-400">Anyone that wants to can sign up on this platform!</span>
                </div>
                <div class="card mb-0 w-full lg:w-80">
                    <div class="flex items-center justify-center bg-blue-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                        <i class="pi pi-fw pi-book !text-2xl text-blue-700"></i>
                    </div>
                    <h5 class="mb-2 ">Unlimited amount of birds</h5>
                    <span class="text-surface-400">There are no limit to how many birds you can add to the system!</span>
                </div>
                <div class="card mb-0 w-full lg:w-80">
                    <div class="flex items-center justify-center bg-green-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                        <i class="pi pi-fw pi-calendar-times !text-2xl text-green-700"></i>
                    </div>
                    <h5 class="mb-2 ">Unlimited log range</h5>
                    <span class="text-surface-400">You can have as many weight logs as you want in here.</span>
                </div>
                <div class="card mb-0 w-full lg:w-80">
                    <div class="flex items-center justify-center bg-purple-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                        <i class="pi pi-fw pi-chart-line !text-2xl text-purple-700"></i>
                    </div>
                    <h5 class="mb-2 ">Data visualisations</h5>
                    <span class="text-surface-400">There are a lot of different visualisations for the data you input to the system.</span>
                </div>
                <div class="card mb-0 w-full lg:w-80">
                    <div class="flex items-center justify-center bg-red-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                        <i class="pi pi-fw pi-hammer !text-2xl text-red-700"></i>
                    </div>
                    <h5 class="mb-2 ">Full control over data</h5>
                    <span class="text-surface-400">You can import, export, purge and do whatever you want with the data you input to this system.</span>
                </div>
                <div class="card mb-0 w-full lg:w-80">
                    <div class="flex items-center justify-center bg-cyan-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                        <i class="pi pi-fw pi-times !text-2xl text-cyan-700"></i>
                    </div>
                    <h5 class="mb-2 ">Delete user at any time</h5>
                    <span class="text-surface-400">If you dont like the platform and wants to leave, you can freely and easily delete your user.</span>
                </div>
            </div>
        </div>
    </div>`
})
export class WhatWeDoWidget {
    constructor(public layoutService: LayoutService) {}
}