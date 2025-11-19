import { FaqCategory } from '../../enums/faq.enum';
import { TotalCounter } from '../member/member';

export interface Faq {
	_id: String;
	question: string;
	answer: string;
	category: FaqCategory;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface Faqs {
	list: Faq[];
	metaCounter?: TotalCounter[];
}
