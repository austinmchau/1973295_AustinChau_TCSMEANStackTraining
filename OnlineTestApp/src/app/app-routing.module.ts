import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizContainerComponent } from './components/quiz-container/quiz-container.component';


const routes: Routes = [
  { path: "quiz", component: QuizContainerComponent },
  { path: "", redirectTo: "quiz", pathMatch: "full" },  // TODO: remove redirect once splash screen is ready
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
