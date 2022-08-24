// We can only show or hide the loading ui
export interface ILoadingScreen {
    displayLoadingUI: () => void;
    hideLoadingUI: () => void;
    loadingUIBackgroundColor: string;
}
