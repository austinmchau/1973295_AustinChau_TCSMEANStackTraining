import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { QuizContainerComponent } from './components/quiz-container/quiz-container.component';
import { HttpClientModule } from '@angular/common/http';
import { QuizQuestionComponent } from './components/quiz-question/quiz-question.component';

@NgModule({
  declarations: [
    AppComponent,
    QuizContainerComponent,
		QuizQuestionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
