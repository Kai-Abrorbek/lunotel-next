import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/
export const SOCIAL_LOGIN_OR_SIGN_UP_NOGQL = `
	mutation SocialLoginOrSignup($input: SignupInput!) {
		socialLoginOrSignup(input: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberEmail
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberProperties
			memberReservations
			memberComments
			memberPoints
			memberWarnings
			memberBlocks
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

export const SOCIAL_LOGIN_OR_SIGN_UP = gql`
	mutation SocialLoginOrSignup($input: SignupInput!) {
		socialLoginOrSignup(input: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberEmail
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberProperties
			memberReservations
			memberComments
			memberPoints
			memberWarnings
			memberBlocks
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

export const SIGN_UP = gql`
	mutation Signup($input: SignupInput!) {
		signup(input: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberEmail
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberProperties
			memberPoints
			memberWarnings
			memberBlocks
			deletedAt
			createdAt
			updatedAt
			accessToken
			memberReservations
			memberComments
		}
	}
`;

export const LOGIN = gql`
	mutation Login($input: LoginInput!) {
		login(input: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberEmail
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberProperties
			memberPoints
			memberWarnings
			memberBlocks
			deletedAt
			createdAt
			updatedAt
			accessToken
			memberComments
			memberReservations
		}
	}
`;

export const UPDATE_MEMBER = gql`
	mutation UpdateMember($input: MemberUpdate!) {
		updateMember(input: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberEmail
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberProperties
			memberPoints
			memberWarnings
			memberBlocks
			deletedAt
			createdAt
			updatedAt
			accessToken
			memberReservations
			memberComments
		}
	}
`;

export const LIKE_TARGET_MEMBER = gql`
	mutation LikeTargetMember($input: String!) {
		likeTargetMember(memberId: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberWarnings
			memberBlocks
			memberProperties
			memberRank
			memberPoints
			memberLikes
			memberViews
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

/**************************
 *        PROPERTY        *
 *************************/

export const CREATE_PROPERTY = gql`
	mutation CreateProperty($input: PropertyInput!) {
		createProperty(input: $input) {
			_id
			propertyType
			propertyStatus
			propertyLocation
			propertyAddress
			propertyName
			propertyRooms
			propertyViews
			propertyLikes
			propertyComments
			propertyRank
			propertyStars
			propertyImages
			propertyDesc
			memberId
			createdAt
			updatedAt
			memberData {
				_id
				memberType
				memberStatus
				memberAuthType
				memberPhone
				memberNick
				memberEmail
				memberFullName
				memberImage
				memberAddress
				memberDesc
				memberProperties
				memberPoints
				memberWarnings
				memberBlocks
				deletedAt
				createdAt
				updatedAt
				accessToken
			}
			propertyReservations
			propertyPrice
			propertyAmenities
			propertyOtherAmenities
		}
	}
`;

export const UPDATE_PROPERTY = gql`
	mutation UpdateProperty($input: PropertyUpdate!) {
		updateProperty(input: $input) {
			_id
			propertyType
			propertyStatus
			propertyLocation
			propertyAddress
			propertyName
			propertyRooms
			propertyViews
			propertyLikes
			propertyComments
			propertyRank
			propertyStars
			propertyImages
			propertyDesc
			memberId
			createdAt
			updatedAt
			memberData {
				_id
				memberType
				memberStatus
				memberAuthType
				memberPhone
				memberNick
				memberEmail
				memberFullName
				memberImage
				memberAddress
				memberDesc
				memberProperties
				memberPoints
				memberWarnings
				memberBlocks
				deletedAt
				createdAt
				updatedAt
				accessToken
			}
			propertyPrice
			propertyReservations
			propertyAmenities
			propertyOtherAmenities
			soldAt
		}
	}
`;

export const LIKE_TARGET_PROPERTY = gql`
	mutation LikeTargetProperty($input: String!) {
		likeTargetProperty(propertyId: $input) {
			_id
			propertyType
			propertyStatus
			propertyLocation
			propertyAddress
			propertyName
			propertyPrice
			propertyRooms
			propertyViews
			propertyLikes
			propertyComments
			propertyRank
			propertyStars
			propertyImages
			propertyAmenities
			propertyOtherAmenities
			propertyDesc
			memberId
			soldAt
			createdAt
			updatedAt
			propertyReservations
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const CREATE_COMMENT = gql`
	mutation CreateComment($input: CommentInput!) {
		createComment(input: $input) {
			_id
			commentStatus
			commentGroup
			commentContent
			commentRefId
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_COMMENT = gql`
	mutation UpdateComment($input: CommentUpdate!) {
		updateComment(input: $input) {
			_id
			commentStatus
			commentGroup
			commentContent
			commentRefId
			memberId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         AGENT         *
 *************************/
/**************************
 *       RESERVATION      *
 *************************/
export const CREATE_RESERVATION = gql`
	mutation CreateReservation($input: ReservationInput!) {
		createReservation(input: $input) {
			_id
			memberId
			propertyId
			roomTypeId
			stayPlanId
			reservationStatus
			reservationQty
			reservationTotalPrice
			reservationCheckIn
			reservationCheckOut
			reservationDate
			reservationCheckInAt
			reservationCheckOutAt
			createdAt
			updatedAt
			priceBreakdown {
				date
				unitPrice
				qty
				subtotal
			}
			memberInfo {
				guestName
				guestPhone
			}
		}
	}
`;

export const UPDATE_RESERVATION = gql`
	mutation UpdateReservation($input: ReservationUpdateInput!) {
		updateReservation(input: $input) {
			_id
			memberId
			propertyId
			roomTypeId
			stayPlanId
			reservationStatus
			reservationQty
			reservationTotalPrice
			reservationCheckIn
			reservationCheckOut
			reservationDate
			reservationCheckInAt
			reservationCheckOutAt
			createdAt
			updatedAt
			priceBreakdown {
				date
				unitPrice
				qty
				subtotal
			}
			memberInfo {
				guestName
				guestPhone
			}
		}
	}
`;

/**************************
 *         ROOM           *
 *************************/
export const CREATE_ROOM = gql`
	mutation CreateRoomType($input: RoomTypeInput!) {
		createRoomType(input: $input) {
			_id
			propertyId
			roomName
			basePriceDayUse
			basePriceOvernight
			roomDiscountPrice
			roombedInfo
			roomImages
			roomStatus
			createdAt
			updatedAt
			roomMaxPersonal
			roomStandPersonal
		}
	}
`;

export const UPDATE_ROOM = gql`
	mutation UpdateRoomType($input: RoomTypeUpdate!) {
		updateRoomType(input: $input) {
			_id
			propertyId
			roomName
			roombedInfo
			roomImages
			roomStatus
			createdAt
			updatedAt
			roomDiscountPrice
			basePriceDayUse
			basePriceOvernight
			roomMaxPersonal
			roomStandPersonal
		}
	}
`;

/**************************
 *     NOTIFICATION       *
 *************************/
export const UPDATE_NOTIFICATION = gql`
	mutation UpdateNotification($input: NotificationUpdateInput!) {
		updateNotification(input: $input) {
			_id
			memberId
			title
			message
			type
			reservationId
			propertyId
			isRead
			createdAt
			updatedAt
		}
	}
`;

export const DELETE_NOTIFICATION = gql`
	mutation DeleteNotification($notifId: String!) {
		deleteNotification(notifId: $notifId) {
			_id
			memberId
			title
			message
			type
			reservationId
			propertyId
			isRead
			createdAt
			updatedAt
		}
	}
`;
