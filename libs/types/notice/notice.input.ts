// notice.interfaces.ts

import { NoticeCategory } from '../../enums/notice.enum';

export interface NoticeInput {
	title: string;
	content: string;
	category: NoticeCategory;
	isPinned?: boolean;
	views?: number;
}

export interface NTSearch {
	title?: string;
	category?: NoticeCategory;
	isPinned?: boolean;
}

export interface NoticeInquiry {
	page: number;
	limit: number;
	search?: NTSearch;
}
