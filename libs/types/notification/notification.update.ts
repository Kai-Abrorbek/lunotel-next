import { NotificationType } from '../../enums/notification.enum';

export interface NotificationUpdateInput {
	_id: string;

	title?: string;
	message?: string;
	type?: NotificationType;

	reservationId?: string;
	propertyId?: string;
	isRead?: boolean;
}
