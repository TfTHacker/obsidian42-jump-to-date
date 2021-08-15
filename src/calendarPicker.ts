import { App, TFile } from 'obsidian';
import flatpickr from 'flatpickr';
import { createDailyNote, getAllDailyNotes, getDailyNote } from 'obsidian-daily-notes-interface';
import moment from 'moment';
import ThePlugin from './main';
import { createConfirmationDialog } from './modal';

export default class CalendarPicker {
    plugin: ThePlugin;
    picker: flatpickr.Instance;

    constructor(plugin: ThePlugin) {
        this.plugin = plugin;
    }

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
                    let dnpFileThatExistsInVault: TFile = await getDailyNote(dateForDNPToOpen, getAllDailyNotes());
                    if (dnpFileThatExistsInVault != null) {
                        // @ts-ignore 
                        app.workspace.activeLeaf.openFile(dnpFileThatExistsInVault)
                    } else { 
                         // @ts-ignore 
                        if (instance.settings.shouldConfirmBeforeCreate===true) {
                                createConfirmationDialog({
                                cta: "Create",
                                onAccept: async ()=>{ 
                                    const newDNP = await createDailyNote(dateForDNPToOpen);
                                    // @ts-ignore 
                                    app.workspace.activeLeaf.openFile(newDNP)                                
                                },
                                text: `File ${dateStr} does not exist. Would you like to create it?`,
                                title: "New Daily Note",
                            });
                        } else {
                            const newDNP = await createDailyNote(dateForDNPToOpen);
                            // @ts-ignore 
                            app.workspace.activeLeaf.openFile(newDNP)                                
                        }
                    }
                },
                disableMobile:  true
            }
        ); // flatpickr     
        
        // since the event of the date picker is called in differnt context, need to store a pointer to the plugin
        // @ts-ignore
        this.picker.settings = this.plugin.settings;
        // this.picker.
    }



}
