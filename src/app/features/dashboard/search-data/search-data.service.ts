import { Injectable } from '@angular/core';
import {of} from "rxjs/index";

@Injectable({
	providedIn: 'root'
})
export class SearchDataService {

	constructor() { }


	getViewTaskDetails() {
		const  fieldsArr =  [
			{ header: 'Topologyviewer Details',
				fieldList:
					[
						{
							label: 'Task Instance Id',
							name: 'taskInstanceId',
							value: '158188',
							editable: false,
							mandatory: false,
							type: 'text'
						},
						{
							label: 'Task Type',
							name: 'taskType',
							value: 'HSI Installation',
							editable: false,
							mandatory: false,
							type: 'text'
						},
						{
							label: 'Task Claim Id',
							name: 'taskClaimId',
							value: 'AB43248',
							editable: false,
							mandatory: false,
							type: 'text'
						},
						{
							label: 'Task Status',
							name: 'taskStatus',
							value: 'In-Progress',
							editable: false,
							mandatory: false,
							type: 'select'
						},
						{
							label: 'Source System',
							name: 'sourceSystem',
							value: 'HOOVER',
							editable: false,
							mandatory: false,
							type: 'text'
						},
						{
							label: 'Escalated',
							name: 'escalated',
							value: 'Yes',
							editable: false,
							mandatory: false,
							type: 'slide'
						},
						{
							label: 'Task Desc',
							name: 'taskDesc',
							value: 'Task created for HSI Installation',
							editable: false,
							mandatory: false,
							type: 'textArea'
						},
						{
							label: 'Task Notes',
							name: 'taskNotes',
							value: 'HSI Installation is in progress',
							editable: true,
							mandatory: true,
							type: 'textArea'
						},
						{
							label: 'Applications',
							name: 'applications',
							value: 'HOOVER',
							editable: true,
							mandatory: true,
							type: 'checkbox'
						},
						{
							label: 'Workgroups',
							name: 'workgroups',
							value: 'ASP',
							editable: true,
							mandatory: true,
							type: 'radio'
						}
					]
			},
			{ header: 'User Details',
				fieldList:
					[
						{
							label: 'Created By Id',
							name: 'createdById',
							value: 'HOOVER',
							editable: false,
							mandatory: false,
							type: 'text'
						},
						{
							label: 'Modified By Id',
							name: 'modifiedById',
							value: 'AB43248',
							editable: true,
							mandatory: true,
							type: 'text'
						}
					]
			},
			{ header: 'Date & Time Details',
				fieldList:
					[
						{
							label: 'Created Date & Time',
							name: 'createdDateTime',
							value: '11/08/2018 10:30:45 AM',
							editable: false,
							mandatory: false,
							type: 'text'
						},
						{
							label: 'Modified Date & Time',
							name: 'modifiedDateTime',
							value: '11/09/2018 11:30:45 AM',
							editable: false,
							mandatory: false,
							type: 'text'
						}
					]
			}
		];
		return of(fieldsArr);
		// return fieldsArr;
	}
	
	//header search data
	getSearchTaskDetails() {
		const searchField = {
			searchFieldList :[
				{
					label: 'Source System',
					name: 'sourceSystem',
					value: [{option: 'Task'}],
					editable: false,
					mandatory: false,
					type: 'select'
				},
				{
					label: 'Task Name',
					name: 'taskName',
					value: [{option: 'workmate task'}, {option:'My work'}],
					editable: false,
					mandatory: false,
					type: 'select'
				},
				{
					label: 'From Date',
					name: 'fromDate',
					value: [],
					editable: false,
					mandatory: false,
					type: 'fromtodate'
				},
				// {
				// 	label: 'To Date',
				// 	name: 'toDate',
				// 	value: [],
				// 	editable: false,
				// 	mandatory: false,
				// 	type: 'fromtodate'
				// },
				{
					label: 'App Transaction Id',
					name: 'appTransactionId',
					value: [{option: 'Task 1'}, {option:'Task 2'}],
					editable: false,
					mandatory: false,
					type: 'select'
				}
			],
			buttonList: [
				{
					label: 'Search',
					name: 'searchBtn',
					value: [],
					editable: false,
					mandatory: false,
					type: 'button'
				},
				{
					label: 'Reset',
					name: 'resetBtn',
					value: [],
					editable: false,
					mandatory: false,
					type: 'button'
				},	
			]
		}
		return of(searchField);
	}
}

