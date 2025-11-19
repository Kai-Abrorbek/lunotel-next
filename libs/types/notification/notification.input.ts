import { NotificationType } from '../../enums/notification.enum';

export interface NotificationInput {
	memberId: string;
	title: string;
	message: string;
	type: NotificationType;

	reservationId?: string;
	propertyId?: string;
	isRead?: boolean;
}

export interface NTSearch {
	memberId?: string;
	type?: NotificationType;
	isRead?: boolean;
}

export interface NotificationInquiry {
	page: number;
	limit: number;
	search?: NTSearch;
}
