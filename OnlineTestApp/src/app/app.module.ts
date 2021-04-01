import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { QuizContainerComponent } from './components/quiz-container/quiz-container.component';
import { HttpClientModule } from '@angular/common/http';
import { QuizQuestionComponent } from './components/quiz-question/quiz-question.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EntryScreenComponent } from './components/entry-screen/entry-screen.component';
import { ScoreScreenComponent } from './components/score-screen/score-screen.component';
import { QuizBackendService } from './services/quiz-backend.service';

@NgModule({
	declarations: [
		AppComponent,
		QuizContainerComponent,
		QuizQuestionComponent,
		EntryScreenComponent,
		ScoreScreenComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		NgbModule,
		HttpClientModule,
		ReactiveFormsModule,
	],
	providers: [QuizBackendService],
	bootstrap: [AppComponent]
})
export class AppModule { }
