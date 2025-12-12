import {
	PropertyAmenity,
	PropertyLocation,
	PropertyOtherAmenity,
	PropertyStatus,
	PropertyType,
} from '../../enums/property.enum';
import { MeLiked } from '../like/like';
import { Member, TotalCounter } from '../member/member';
import { Reservation } from '../reservation/reservation';
import { RoomType } from '../roomtype/roomtype';

export interface Property {
	_id: string;
	propertyType?: PropertyType;
	propertyStatus?: PropertyStatus;
	propertyLocation?: PropertyLocation;
	propertyAddress?: string;
	propertyName?: string;
	propertyPrice?: number;
	propertyRooms?: number;
	propertyViews?: number;
	propertyReservations?: number;
	propertyLikes?: number;
	propertyComments?: number;
	propertyRank?: number;
	propertyStars?: number;
	propertyImages?: string[];
	propertyAmenities?: PropertyAmenity[];
	propertyOtherAmenities?: PropertyOtherAmenity[];
	propertyDesc?: string;
	memberId?: string;
	soldAt?: boolean;
	createdAt?: Date;
	updatedAt?: Date;

	/** from aggregate */
	memberData?: Member;
	rooms?: RoomType[];
	roomCount?: number;
	meLiked?: MeLiked[];
	reservationData?: Reservation[];
}

export interface Properties {
	list: Property[];
	metaCounter: TotalCounter[];
}
