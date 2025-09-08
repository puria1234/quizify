export type MultipleChoiceQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
};

export type TrueFalseQuestion = {
  question: string;
  isTrue: boolean;
};

export type Quiz = {
  questions: (MultipleChoiceQuestion | TrueFalseQuestion)[];
  type: 'mcq' | 'tf';
};
