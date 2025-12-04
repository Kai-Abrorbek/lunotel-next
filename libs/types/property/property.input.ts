// property.interfaces.ts

import {
	PropertyAmenity,
	PropertyLocation,
	PropertyOtherAmenity,
	PropertyStatus,
	PropertyType,
} from '../../enums/property.enum';
import { Direction } from '../../enums/common.enum';

/** CREATE PROPERTY */
export interface PropertyInput {
	propertyType: PropertyType;
	propertyLocation: PropertyLocation;
	propertyAddress: string;
	propertyName: string;
	propertyStars: number;

	propertyImages: string[];
	propertyAmenities: PropertyAmenity[];
	propertyOtherAmenities: PropertyOtherAmenity[];

	propertyDesc?: string;
	memberId?: string;
}

/** PRICE RANGE */
export interface PricesRange {
	start: number;
	end: number;
}

/** SEARCH FILTER FOR MAIN PROPERTY LIST */
export interface PIsearch {
	memberId?: string;
	propertyType?: PropertyType;
	propertyName?: string;
	location?: PropertyLocation;
	checkInDate?: string;
	checkOutDate?: string;
	personal?: number;
	propertyStarsList?: number[];
	amenityList?: PropertyAmenity[];
	otherAmenityList?: PropertyOtherAmenity[];
	soldAt?: boolean;
	pricesRange?: PricesRange;
	text?: string;
}

/** MAIN PROPERTY LIST QUERY */
export interface PropertiesInquiry {
	page?: number;
	limit?: number;
	sort?: string;
	direction?: Direction;
	search?: PIsearch;
}

/** SINGLE PROPERTY */
export interface PropertyInquiry {
	_id: string;
	propertyName: string;
	checkInDate: string;
	checkOutDate: string;
	personal: number;
}

/** AGENT PROPERTY FILTER */
export interface APIsearch {
	propertyStatus?: PropertyStatus;
}

export interface AgentPropertiesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search?: APIsearch;
}

/** ADMIN PROPERTY FILTER */
export interface ALPIsearch {
	location?: PropertyLocation;
	type?: PropertyType;
	propertyStarsList?: number[];
	propertyStatus?: PropertyStatus;
}

/** ADMIN FULL PROPERTY LIST QUERY */
export interface AllPropertiesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search?: ALPIsearch;
}

/** SIMPLE PAGINATION */
export interface OrdinaryInquiry {
	page: number;
	limit: number;
}
