import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntryScreenComponent } from './components/entry-screen/entry-screen.component';
import { QuizContainerComponent } from './components/quiz-container/quiz-container.component';
import { ScoreScreenComponent } from './components/score-screen/score-screen.component';


const routes: Routes = [
	{ path: "entry", component: EntryScreenComponent },
	{ path: "quiz/:quiz-name", component: QuizContainerComponent },
	{ path: "result/:responseId", component: ScoreScreenComponent },
	{ path: "", redirectTo: "entry", pathMatch: "full" },  // TODO: remove redirect once splash screen is ready
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
