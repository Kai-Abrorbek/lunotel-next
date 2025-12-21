import {
	PropertyAmenity,
	PropertyLocation,
	PropertyOtherAmenity,
	PropertyStatus,
	PropertyType,
} from '../../enums/property.enum';

export interface PropertyUpdate {
	_id: string;
	propertyStatus?: PropertyStatus;
	propertyType?: PropertyType;
	propertyLocation?: PropertyLocation;
	propertyAddress?: string;
	propertyDetailAddress?: string;
	propertyLat?: string;
	propertyLng?: string;
	propertyName?: string;
	propertyPrice?: number;
	propertyRooms?: number;
	propertyStars?: number;
	propertyImages?: string[];
	propertyAmenities?: PropertyAmenity[];
	propertyOtherAmenities?: PropertyOtherAmenity[];
	propertyDesc?: string;
	soldAt?: boolean;
	deletedAt?: Date;
}
