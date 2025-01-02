import { Component, inject, OnInit } from '@angular/core';
import { ContentService } from './services/content.service';

@Component({
	selector: 'app-learning',
	templateUrl: './learning.component.html',
	styleUrl: './learning.component.scss'
})
export class LearningComponent implements OnInit {
	private readonly contentService = inject(ContentService);

	public sections: any = [];

	public ngOnInit() {
		this.sections = this.contentService.getSections();
	}
}
