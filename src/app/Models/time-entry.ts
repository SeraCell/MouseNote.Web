export class TimeEntry {

    public start = 0;
    public end = 0;
    public group = 0;
    public type = 0;
    public active = false;

    constructor(timeEntry?: TimeEntry) {
        if (timeEntry != undefined) {
            this.start = timeEntry.start;
            this.end = timeEntry.end;
            this.group = timeEntry.group;
            this.type = timeEntry.type;
            this.active = timeEntry.active;
            return;
        }
    }



    public setValues(start?: number, end?: number, group?: number, type?: number) {
        this.start = start || 0;
        this.end = end || 0;
        this.group = group || 0;
        this.type = type || 0;
        this.active = false;
    }
}
