// notice.interfaces.ts

import { NoticeCategory } from '../../enums/notice.enum';
import { TotalCounter } from '../member/member';

export interface Notice {
	_id: string;
	title: string;
	content: string;
	category: NoticeCategory;
	isPinned: boolean;
	views: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface Notices {
	list: Notice[];
	metaCounter?: TotalCounter[];
}
