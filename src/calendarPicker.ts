import { App, TFile } from 'obsidian';
import flatpickr from 'flatpickr';
import { createDailyNote, getAllDailyNotes, getDailyNote } from 'obsidian-daily-notes-interface';
import moment from 'moment';

export default class CalendarPicker {
    app: App;
    picker: flatpickr.Instance;

    open() {
        if (this.picker === undefined)
            this.initializePicker()
        this.picker.open();
    }

    initializePicker() {
        this.picker = flatpickr(
            document.querySelector("div[aria-label='Jump to Date']"),
            {
                onChange: async function (selectedDates, dateStr, instance) {
                    const dateForDNPToOpen = moment(dateStr);
                    let dnp: TFile = await getDailyNote(dateForDNPToOpen, getAllDailyNotes());
                    if (dnp === null)
                        dnp = await createDailyNote(dateForDNPToOpen);
                    // @ts-ignore 
                    app.workspace.activeLeaf.openFile(dnp)
                },
                disableMobile:  true
            }
        ); // flatpickr        
    }
}
