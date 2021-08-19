import { Plugin, TFile, Notice } from 'obsidian';
import { addIcons } from './icons';
import { Settings, DEFAULT_SETTINGS, SettingsTab } from './settings';
import CalendarPicker from './ui/calendarPicker';
import DateNLP_Modal from './ui/datenlpModal';
import moment from 'moment';
import { createDailyNote, getAllDailyNotes, getDailyNote } from 'obsidian-daily-notes-interface';
import { createConfirmationDialog } from './ui/confirmationModal';
import { setInterval } from 'timers';

export default class ThePlugin extends Plugin {
	settings: Settings;
	ribbonIcon: HTMLElement;
	datePicker: CalendarPicker;

	async onload() {
		console.log('loading JumpToDate plugin');

		await this.loadSettings();

		this.addSettingTab(new SettingsTab(this.app, this));

		addIcons();

		if (this.settings.enableRibbon)
			this.configureRibbonCommand();

		this.addCommand({
			id: 'open-JumpToDate-calendar',
			name: 'Date Picker',
			callback: () => {
				this.datePicker.open()
			}
		});

		setInterval

		// give time for other plugins to load
		setTimeout(() => {
			//If the Natural Language Date plugin is installed, enable this additional command
			// @ts-ignore
			if (this.app.plugins.getPlugin("nldates-obsidian")) {
				this.addCommand({
					id: 'open-JumpToDate-nlp',
					name: 'Natural Language Date',
					callback: () => {
						const dt = new DateNLP_Modal(this.app, this);
						dt.open();
					}
				});
			}
		}, 5000);

		this.datePicker = new CalendarPicker(this);
	}

	onunload() {
		console.log('unloading JumpToDate plugin');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	configureRibbonCommand() {
		this.ribbonIcon = this.addRibbonIcon('JumpToDate', 'Jump to Date', async () => this.datePicker.open())
	}

	setFirstDayofWeek(dayOfWeek: number) {
		this.datePicker.setFirstDayofWeek(dayOfWeek);
	}

	async navigateToDNP( dateStr: string, shouldConfirmBeforeCreate: boolean = true, newPane:  boolean = false) {
		
		const openFile = ( fileToOpen: TFile, openInNewPane: boolean )=> {
			if (openInNewPane)  {
				// @ts-ignore
				const newLeaf = app.workspace.splitActiveLeaf(); 
				newLeaf.openFile(fileToOpen, {active: true});
			} else {				
				// @ts-ignore
				app.workspace.activeLeaf.openFile(fileToOpen)
			}
		}
		
		const dateForDNPToOpen = moment(dateStr);

		let dnpFileThatExistsInVault: TFile = await getDailyNote(dateForDNPToOpen, getAllDailyNotes());
		if (dnpFileThatExistsInVault != null) {	
			openFile( dnpFileThatExistsInVault, newPane );
		} else {
			if (shouldConfirmBeforeCreate === true) {
				createConfirmationDialog({
					cta: "Create",
					onAccept: async (dateStr, e) => {
						openFile( await createDailyNote(moment(dateStr)), newPane )
					},
					text: `File ${dateStr} does not exist. Would you like to create it?`,
					title: "New Daily Note",
					fileDate: dateStr
				});
			} else {
				openFile( await createDailyNote(dateForDNPToOpen), newPane );
			}
		}
	}

}

