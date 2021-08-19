import flatpickr from 'flatpickr';
import ThePlugin from '../main';
import { App } from 'obsidian';
import moment from 'moment';

export default class CalendarPicker {
    plugin: ThePlugin;
    picker: flatpickr.Instance;

    constructor(plugin: ThePlugin) {
        this.plugin = plugin;
        this.picker = null;
    }

    open() {
        if (this.picker === null)
            this.initializePicker();

        if(this.picker.isOpen) {
            this.picker.destroy();
            this.picker = null;
        } else {
            this.picker.open();
            // since the event of the date picker is called in differnt context, need to store a pointer to the function
            // @ts-ignore
            this.picker.shouldConfirmBeforeCreate = this.plugin.settings.shouldConfirmBeforeCreate;
        }
    }

    initializePicker() {
        const startingDayInWeek = this.plugin.settings.firstDayOfWeekIsSunday ? 0 : 1;
        this.picker = flatpickr(
            document.querySelector("div[aria-label='Jump to Date']"),
            {
                onChange: async function (selectedDates, dateStr, instance) {
                    // @ts-ignore
                    instance.navigateToDNP(dateStr, instance.shouldConfirmBeforeCreate, instance.controlKeyPressed);
                    // @ts-ignore
                    instance.controlKeyPressed = false; // reset key state
                },
                disableMobile: true,
                locale: { firstDayOfWeek: startingDayInWeek },
            }
        );
        this.picker.daysContainer.addEventListener('click', (e: MouseEvent)=>{
            // @ts-ignores
            this.picker.controlKeyPressed = ( e.ctrlKey || e.metaKey ) ? true : false;
        });
        this.picker.daysContainer.addEventListener('contextmenu', (e: MouseEvent) => {
            // @ts-ignore
            this.picker.navigateToDNP(e.target.dateObj.toString(), this.picker.shouldConfirmBeforeCreate, true);
        });
    
        // @ts-ignore
        this.picker.navigateToDNP = this.plugin.navigateToDNP;
        // @ts-ignore
        this.picker.controlKeyPressed = false; // tracks if CTRL key is being held down
    }

    setFirstDayofWeek(dayOfWeek: number) {
        this.picker.set('locale', { firstDayOfWeek: dayOfWeek })
    }

}
