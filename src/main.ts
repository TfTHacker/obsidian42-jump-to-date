import { Plugin } from 'obsidian';
import { addIcons } from './icons';
import CalendarPicker from './calendarPicker';

export default class JumpToDatePlugin extends Plugin {
	ribbonIcon: HTMLElement;
	datePicker: CalendarPicker;

	async onload() {
		console.log('loading JumpToDate plugin');

		addIcons();

		this.ribbonIcon = this.addRibbonIcon('JumpToDate', 'Jump to Date', async () => this.datePicker.open())

		this.addCommand({
			id: 'open-JumpToDate-suggestor',
			name: 'Date Picker',
			callback: () => {
				this.datePicker.open()
			}
		});

		this.datePicker = new CalendarPicker();
	}

	onunload() {
		console.log('unloading JumpToDate plugin');
	}
}

