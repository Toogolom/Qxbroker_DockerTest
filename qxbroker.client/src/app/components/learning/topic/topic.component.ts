import { Component, inject, OnInit } from '@angular/core';
import { ContentService } from '../services/content.service';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-topic',
	templateUrl: './topic.component.html',
	styleUrl: './topic.component.scss'
})
export class TopicComponent implements OnInit {
	private readonly contentService = inject(ContentService);
	private readonly activatedRoute = inject(ActivatedRoute);

	public section: any = {};
	public currentTopic: any = {};
	public currentSubTopic: any = {};
	private sectionId: number = 0;

	constructor() {
		this.activatedRoute.params.subscribe(params => {
			this.sectionId = Number.parseInt(params['id']);
		});
	}

	public ngOnInit(): void {
		this.section = this.contentService.getSectionById(this.sectionId);
		this.changeSubTopic(0, 0);
	}

	public changeSubTopic(topicId: number, subTopicId: number): void {
		// @ts-ignore
		this.currentTopic = this.section.topics.find(topic => topic.id === topicId);
		// @ts-ignore
		this.currentSubTopic = this.currentTopic.subtopics.find(subTopic => subTopic.id === subTopicId);
		// this.currentTopic = this.section.topics[topicId];
		// this.currentSubTopic = this.currentTopic.subtopics[subTopicId];
	}
}
