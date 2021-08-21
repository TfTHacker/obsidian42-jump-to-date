import flatpickr from 'flatpickr';
import ThePlugin from '../main';
import { View } from 'obsidian';
import moment from 'moment';
import { getDailyNoteSettings } from 'obsidian-daily-notes-interface';

export default class CalendarPicker {
    plugin: ThePlugin;
    picker: flatpickr.Instance;

    constructor(plugin: ThePlugin) {
        this.plugin = plugin;
        this.picker = null;
    }

    open() {
        if (this.picker !== null && this.picker.isOpen) { // if open already, just close it
            this.picker.destroy();
            this.picker = null;
            return;
        }

        if( document.querySelector('.obsidian42-jump-to-date') )
            document.querySelectorAll('.obsidian42-jump-to-date').forEach(e=>e.remove())

        this.initializePicker();

        // since the event of the date picker is called in differnt context, need to store a pointer to the function
        // @ts-ignore
        this.picker.shouldConfirmBeforeCreate = this.plugin.settings.shouldConfirmBeforeCreate;
        let currentlySelectedDate: moment.Moment = moment();
        const activeView: View = this.plugin.app.workspace.activeLeaf.view;
        try {
            // @ts-ignore
            if (activeView.file && moment(activeView.file.basename, getDailyNoteSettings().format, true).isValid()) {
                // @ts-ignore
                currentlySelectedDate = moment(activeView.file.basename);
            }
        } catch (e) { }
        this.picker.setDate(currentlySelectedDate.format('Y-M-D'));

        this.picker.open();
        const daySelected:HTMLElement = document.querySelector('.obsidian42-jump-to-date .flatpickr-day.selected');
        daySelected.focus();
        daySelected.dispatchEvent(new KeyboardEvent('keydown', {'key':'ArrowRight'} ));

        setTimeout(() => {
            try {
            } catch (e) {}
        }, 250);
    }

    initializePicker() {
        const startingDayInWeek = this.plugin.settings.firstDayOfWeekIsSunday ? 0 : 1;

        // create and initialize settings in the calendar picker
        if (this.picker !== null) this.picker.destroy()
        this.picker = flatpickr(
            document.querySelector("div[aria-label='Jump to Date']"),
            {
                onChange: async function (selectedDates, dateStr, instance) {
                    // @ts-ignore
                    instance.navigateToDNP(dateStr, instance.shouldConfirmBeforeCreate, instance.controlKeyPressed);
                    instance.destroy();
                },
                disableMobile: true,
                locale: { firstDayOfWeek: startingDayInWeek },
            }
        );

        this.picker.calendarContainer.addClass('obsidian42-jump-to-date');

        this.picker.daysContainer.addEventListener('keyup', (e: KeyboardEvent) => {
            if( (e.ctrlKey===true || e.metaKey === true ) && e.key === "Enter" ) {
                // @ts-ignore
                this.picker.navigateToDNP(e.target.dateObj.toString(), this.picker.shouldConfirmBeforeCreate, true);
                this.picker.destroy();
                this.picker = null;
            } else if (  e.key === "Enter" ) {
                // @ts-ignore
                this.picker.navigateToDNP(e.target.dateObj.toString(), this.picker.shouldConfirmBeforeCreate, false);
            }

        });

        this.picker.calendarContainer.addEventListener('keydown', (e: KeyboardEvent) => {
            // @ts-ignores
            this.picker.controlKeyPressed = (e.ctrlKey || e.metaKey) ? true : false;
        });


        this.picker.daysContainer.addEventListener('click', (e: MouseEvent) => {
            // @ts-ignores
            this.picker.controlKeyPressed = (e.ctrlKey || e.metaKey) ? true : false;
        });

        this.picker.daysContainer.addEventListener('contextmenu', (e: MouseEvent) => {
            // @ts-ignore
            this.picker.navigateToDNP(e.target.dateObj.toString(), this.picker.shouldConfirmBeforeCreate, true);
            this.picker.destroy();
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
