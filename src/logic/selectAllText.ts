export const selectAllText = (div: HTMLElement) =>{
    let selection = window.getSelection()
    if (selection) {
        var range = document.createRange();
        range.selectNodeContents(div);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}