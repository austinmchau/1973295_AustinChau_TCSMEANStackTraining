import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizComponent } from './quiz-components/quiz/quiz.component';

const routes: Routes = [
  { path: "quiz", component: QuizComponent },
  { path: "", redirectTo: "quiz", pathMatch: "full" },  // TODO: remove redirect once splash screen is ready
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
