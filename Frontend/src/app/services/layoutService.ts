interface LayoutState {
    isDesktop : boolean,
    isDarkMode : boolean,
    isMenuExpanded : boolean,
}

export class LayoutService {
    public state : LayoutState = {
        isDarkMode: true,
        isDesktop: true,
        isMenuExpanded: false
    } as LayoutState;

    constructor(){
        var existing = localStorage.getItem("state");
        if (existing)
            this.state = JSON.parse(existing) as LayoutState;

        this.state.isDesktop = window.innerWidth > 991
        if (this.state.isDesktop)
            this.state.isMenuExpanded = true;
        else
            this.state.isMenuExpanded = false;
        this.updateCssDarkMode();
        this.updateCssMobileMode();
    }

    public ToggleDarkMode(){
        this.state.isDarkMode = !this.state.isDarkMode;
        this.updateCssDarkMode();
        this.saveState();
    }

    updateCssDarkMode(){
        if (this.state.isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    updateCssMobileMode(){
        if (this.state.isDesktop) {
            document.documentElement.classList.remove('mobile');
        } else {
            document.documentElement.classList.add('mobile');
        }
    }

    public ToggleMenu(){
        this.state.isMenuExpanded = !this.state.isMenuExpanded;
    }

    public SetMenu(state : boolean){
        this.state.isMenuExpanded = state;
    }

    saveState(){
        localStorage.setItem("state", JSON.stringify(this.state))
    }
}
