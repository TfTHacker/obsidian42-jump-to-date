import { Plugin, TFile } from 'obsidian';
import { createDailyNote, getAllDailyNotes, getDailyNote } from 'obsidian-daily-notes-interface';
import { addIcons } from './icons';
import { Settings, DEFAULT_SETTINGS, SettingsTab } from './ui/settings';
import CalendarPicker from './ui/calendarPicker';
import DateNLP_Modal from './ui/datenlpModal';
import { createConfirmationDialog } from './ui/confirmationModal';

export default class ThePlugin extends Plugin {
	settings: Settings;
	ribbonIcon: HTMLElement;
	datePicker: CalendarPicker;

	async onload() {
		console.log('loading Obsidian42 Jump-to-Date plugin');

		await this.loadSettings();

		this.addSettingTab(new SettingsTab(this.app, this));

		addIcons();

		if (this.settings.enableRibbon)
			this.configureRibbonCommand();

		this.addCommand({
			id: 'open-JumpToDate-calendar',
			name: 'Date Picker',
			callback: () => {
				setTimeout(	()=>{
					this.datePicker.open(); //need small delay when called from command palette
				}, 250);
			}
		});


		this.app.workspace.onLayoutReady(()=>{
			// If the Natural Language Date plugin is installed, enable this additional command
			// otherwise the command is not available
			// @ts-ignore
			if (this.app.plugins.getPlugin('nldates-obsidian')) {
				this.addCommand({
					id: 'open-JumpToDate-nlp',
					name: 'Natural Language Date',
					callback: () => {
						const dt = new DateNLP_Modal(this.app, this);
						dt.open();
					}
				});
			}
		})

		this.datePicker = new CalendarPicker(this);
	}

	onunload() {
		console.log('unloading Obsidian42 Jump-to-Date plugin');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	configureRibbonCommand() {
		this.ribbonIcon = this.addRibbonIcon('JumpToDate', 'Jump-to-Date', async () => this.datePicker.open());
	}

	setFirstDayofWeek(dayOfWeek: number) {
		this.datePicker.setFirstDayofWeek(dayOfWeek);
	}

	async navigateToDNP(dateStr: string, shouldConfirmBeforeCreate: boolean = true, newPane: boolean = false, newHorizontalPane: boolean = false) {
		const openFile = (fileToOpen: TFile, openInNewPane: boolean, openInHorizontalPane: boolean) => {
			if (newPane && openInHorizontalPane) {
				// @ts-ignore
				const newLeaf = app.workspace.createLeafBySplit(app.workspace.getLeaf(), 'horizontal', false);
				newLeaf.openFile(fileToOpen, { active: true });
			} else if (openInNewPane) {
				// @ts-ignore
				const newLeaf = app.workspace.createLeafBySplit(app.workspace.getLeaf(), 'vertical', false);
				newLeaf.openFile(fileToOpen, { active: true });
			} else {
				// @ts-ignore
				app.workspace.getLeaf().openFile(fileToOpen);
			}
		}

		const dateForDNPToOpen = moment(new Date(dateStr + 'T00:00:00'));

		let dnpFileThatExistsInVault = getDailyNote(dateForDNPToOpen, getAllDailyNotes());

		if (dnpFileThatExistsInVault != null) {
			openFile(dnpFileThatExistsInVault, newPane, newHorizontalPane);
		} else {
			if (shouldConfirmBeforeCreate === true) {
				createConfirmationDialog({
					cta: "Create",
					onAccept: async (dateStr, e) => {
						const newDate = moment(new Date(dateStr));
						openFile(await createDailyNote(newDate), newPane, newHorizontalPane);
					},
					text: `File ${dateStr} does not exist. Would you like to create it?`,
					title: "New Daily Note",
					fileDate: dateForDNPToOpen.format('Y-MM-DD') + 'T00:00:00'
				});
			} else {
				openFile(await createDailyNote(dateForDNPToOpen), newPane, newHorizontalPane);
			}
		}
	}

}

