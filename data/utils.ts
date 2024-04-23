export function round(number : number) {
    return (Math.round(number * 100) / 100);
}

export function toEuro(number : number) {
    return round(number).toString().replace(/\./, ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " €";
}
