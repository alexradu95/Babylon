import { ILoadingScreen } from "babylonjs";

export class CustomLoadingScreen implements ILoadingScreen {
    public loadingUIBackgroundColor: string
    constructor(public loadingUIText: string) { }
    public displayLoadingUI() {
        document.getElementById("frontdiv").style.visibility = 'visible';
    }

    public hideLoadingUI() {
        document.getElementById("frontdiv").style.visibility = 'hidden';
    }
}