import { PropertyLocation, PropertyStatus, PropertyType } from '../../enums/property.enum';

export interface PropertyUpdate {
	_id: string;

	propertyStatus?: PropertyStatus;
	propertyType?: PropertyType;
	propertyLocation?: PropertyLocation;

	propertyAddress?: string;
	propertyName?: string;

	propertyPrice?: number;
	propertyRooms?: number;
	propertyStars?: number;

	propertyImages?: string[];
	propertyDesc?: string;

	soldAt?: boolean;
	deletedAt?: Date;
}
