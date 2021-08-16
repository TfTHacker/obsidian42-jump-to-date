import { TFile } from 'obsidian';
import flatpickr from 'flatpickr';
import ThePlugin from '../main';

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
        const startingDayInWeek = this.plugin.settings.firstDayOfWeekIsSunday ? 0 : 1;
        this.picker = flatpickr(
            document.querySelector("div[aria-label='Jump to Date']"),
            {
                onChange: async function (selectedDates, dateStr, instance) {
                    // @ts-ignore
                    instance.navigateToDNP(dateStr, instance.shouldConfirmBeforeCreate);
                },
                disableMobile: true,
                locale: { firstDayOfWeek: startingDayInWeek }
            }
        );      
        // since the event of the date picker is called in differnt context, need to store a pointer to the function
        // @ts-ignore
        this.picker.shouldConfirmBeforeCreate = this.plugin.settings.shouldConfirmBeforeCreate;
        // @ts-ignore
        this.picker.navigateToDNP = this.plugin.navigateToDNP;
    }

    setFirstDayofWeek(dayOfWeek: number) {
        this.picker.set('locale', { firstDayOfWeek: dayOfWeek })
    }

}
