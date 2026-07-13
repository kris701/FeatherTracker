import { inject, signal } from "@angular/core";
import { TUI_DARK_MODE } from "@taiga-ui/core";

interface LayoutState {
    isDesktop : boolean,
    isDarkMode : boolean,
    isMenuExpanded : boolean,
}

export class LayoutService {
    protected readonly darkMode = inject(TUI_DARK_MODE);

    isDarkMode = signal<boolean>(true);
    isDesktop = signal<boolean>(true);
    isMenuExpanded = signal<boolean>(false);

    constructor(){
        var existing = localStorage.getItem("state");
        if (existing)
        {
          var state = JSON.parse(existing) as LayoutState
		  this.isDarkMode.set(state.isDarkMode);
		  this.isDesktop.set(state.isDesktop);
		  this.isMenuExpanded.set(state.isMenuExpanded);
        }

		var isDesktop = this.isDesktop();
		var isMenuExpanded = this.isMenuExpanded();

        isDesktop = window.innerWidth > 991
		if (isMenuExpanded){
			if (!isDesktop)
				isMenuExpanded = false;
		}

		this.isDesktop.set(isDesktop)
		this.isMenuExpanded.set(isMenuExpanded)

		this.darkMode.update((dark) => this.isDarkMode());
    }

    public ToggleDarkMode(){
        var isDarkMode = this.isDarkMode();
        this.darkMode.update((dark) => !isDarkMode);
        isDarkMode = !isDarkMode;
        this.isDarkMode.set(isDarkMode);
        this.saveState();
    }

    public ToggleMenu(){
		var isMenuExpanded = this.isMenuExpanded();
		isMenuExpanded = !isMenuExpanded;
		this.isMenuExpanded.set(isMenuExpanded);
		this.saveState();
    }

    public SetMenu(to : boolean){
        var isMenuExpanded = this.isMenuExpanded();
        isMenuExpanded = to;
        this.isMenuExpanded.set(isMenuExpanded);
		this.saveState();
    }

    saveState(){
        localStorage.setItem("state", JSON.stringify({
			isDarkMode: this.isDarkMode(),
			isDesktop: this.isDesktop(),
			isMenuExpanded: this.isMenuExpanded(),
		} as LayoutState))
    }
}
