import { NgModule } from "@angular/core";
import { LearningComponent } from "./learning.component";
import { TopicComponent } from "./topic/topic.component";
import { CommonModule } from "@angular/common";
import { LearningRouterModule } from "./learning-routing.module";

@NgModule({
	declarations: [
		LearningComponent,
		TopicComponent
	],
	imports: [
		CommonModule,
		LearningRouterModule
	],
	providers: [],
	exports: [
		LearningComponent,
		TopicComponent
	],
})
export class LearningModule {}