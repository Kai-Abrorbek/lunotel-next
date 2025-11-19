import { FaqCategory } from '../../enums/faq.enum';

export interface FaqUpdateInput {
	_id: String;
	question?: string;
	answer?: string;
	category?: FaqCategory;
	isActive?: boolean;
}
