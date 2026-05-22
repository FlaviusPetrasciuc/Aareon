export interface Answer {
  questionId: string;
  question: string;
  answer: string;
}

export interface IntakeSession {
  id: string;
  jobTitle: string;
  answers: Answer[];
  jd?: string;
  hiringKit?: string;
  createdAt: number;
  updatedAt: number;
}

export interface WizardQuestion {
  question: string;
  options: string[];
  hint: string;
}

export interface QuestionOption {
  id: string;
  title: string;
  description: string;
}

export interface QuestionState {
  questionId: string;
  question: string;
  options: QuestionOption[];
}
