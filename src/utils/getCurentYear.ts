export function getCurrentYear(): string {
    const currentDate = new Date();
    return currentDate.getFullYear().toString();

}