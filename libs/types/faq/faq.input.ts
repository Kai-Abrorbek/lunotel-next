import { FaqCategory } from '../../enums/faq.enum';

export interface FaqInput {
	question: string;
	answer: string;
	category: FaqCategory;
	isActive?: boolean;
}

export interface FQSearch {
	question?: string;
	category?: FaqCategory;
	isActive?: boolean;
}

export interface FaqInquiry {
	page: number;
	limit: number;
	search?: FQSearch;
}
