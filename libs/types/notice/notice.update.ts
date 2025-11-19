import { NoticeCategory } from '../../enums/notice.enum';

export interface NoticeUpdateInput {
	_id: string;

	title?: string;
	content?: string;
	category?: NoticeCategory;
	isPinned?: boolean;
	views?: number;
}
