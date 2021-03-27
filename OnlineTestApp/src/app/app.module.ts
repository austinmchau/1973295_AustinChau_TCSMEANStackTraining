import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { QuizQuestionComponent } from './quiz-components/quiz-question/quiz-question.component';
import { QuizComponent } from './quiz-components/quiz/quiz.component';

@NgModule({
  declarations: [
    AppComponent,
    QuizQuestionComponent,
    QuizComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
