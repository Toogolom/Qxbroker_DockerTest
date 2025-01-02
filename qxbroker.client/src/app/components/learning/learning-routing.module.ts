import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LearningComponent } from "./learning.component";
import { canActivateGuest } from "../../services/auth/access.guard";
import { TopicComponent } from "./topic/topic.component";

const routes: Routes = [
	{
		path: '', 
		component: LearningComponent, 
		canActivate: [canActivateGuest],
	},
	{
		path: 'topic/:id',
		component: TopicComponent,
		canActivate: [canActivateGuest],
	}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LearningRouterModule { }