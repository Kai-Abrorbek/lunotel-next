import { NotificationType } from '../../enums/notification.enum';
import { TotalCounter } from '../member/member';

export interface Notification {
	_id: string;
	memberId: string;

	title: string;
	message: string;
	type: NotificationType;

	reservationId?: string;
	propertyId?: string;

	isRead: boolean;

	createdAt: Date;
	updatedAt: Date;
}

export interface Notifications {
	list: Notification[];
	metaCounter?: TotalCounter[];
}
