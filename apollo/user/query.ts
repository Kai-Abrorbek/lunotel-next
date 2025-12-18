import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/
export const GET_MEMBER = gql`
	query GetMember($input: String!) {
		getMember(memberId: $input) {
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
			reservationList {
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
			memberReservations
			memberComments
		}
	}
`;

/**************************
 *        PROPERTY        *
 *************************/
export const GET_PROPERTY = gql`
	query GetProperty($input: PropertyInquiry!) {
		getProperty(input: $input) {
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
			rooms {
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
				stayPlans {
					_id
					roomTypeId
					stayPlanType
					stayPlanName
					stayPlanBasePrice
					stayPlanRules
					stayPlanstatus
					createdAt
					updatedAt
					inventories {
						_id
						roomTypeId
						stayPlanId
						inventoryDate
						inventoryAllotment
						inventoryPrice
						inventoryStatus
						createdAt
						updatedAt
					}
				}
				roomMaxPersonal
				roomStandPersonal
			}
			roomCount
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
			propertyReservations
			reservationData {
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
			}
			propertyDetailAddress
			propertyLat
			propertyLng
		}
	}
`;

export const GET_PROPERTIES = gql`
	query GetProperties($input: PropertiesInquiry!) {
		getProperties(input: $input) {
			list {
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
				soldAt
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
				propertyAmenities
				propertyOtherAmenities
				rooms {
					_id
					propertyId
					roomName
					roomDiscountPrice
					roomImages
					roomStatus
					createdAt
					updatedAt
					roombedInfo
					basePriceDayUse
					basePriceOvernight
					roomMaxPersonal
					roomStandPersonal
					stayPlans {
						_id
						roomTypeId
						stayPlanType
						stayPlanName
						stayPlanBasePrice
						stayPlanRules
						stayPlanstatus
						createdAt
						updatedAt
						inventories {
							_id
							roomTypeId
							stayPlanId
							inventoryDate
							inventoryAllotment
							inventoryPrice
							inventoryStatus
							createdAt
							updatedAt
						}
					}
				}
				roomCount
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				propertyReservations
				propertyPrice
				propertyDetailAddress
				propertyLat
				propertyLng
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_SIMILAR_PROPERTIES = gql`
	query GetSimilarProperties($propertyId: String!) {
		getSimilarProperties(propertyId: $propertyId) {
			_id
			propertyType
			propertyStatus
			propertyAddress
			propertyLocation
			propertyDetailAddress
			propertyLat
			propertyLng
			propertyName
			propertyPrice
			propertyViews
			propertyRooms
			propertyReservations
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
			roomCount
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
		}
	}
`;

export const GET_FAVORITES = gql`
	query GetFavorites($input: OrdinaryInquiry!) {
		getFavorites(input: $input) {
			list {
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
				roomCount
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
				rooms {
					_id
					propertyId
					roomName
					roomMaxPersonal
					roomStandPersonal
					basePriceDayUse
					basePriceOvernight
					roomDiscountPrice
					roombedInfo
					roomImages
					roomStatus
					createdAt
					updatedAt
				}
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_VISITED = gql`
	query GetVisited($input: OrdinaryInquiry!) {
		getVisited(input: $input) {
			list {
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
				roomCount
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
					reservationList {
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
					}
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/
export const GET_COMMENTS = gql`
	query GetComments($input: CommentsInquiry!) {
		getComments(input: $input) {
			list {
				_id
				commentStatus
				commentGroup
				commentContent
				commentRefId
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
			metaCounter {
				total
			}
		}
	}
`;

export const GET_MY_COMMENTS = gql`
	query GetMyComments($input: CommentsInquiry!) {
		getMyComments(input: $input) {
			list {
				_id
				commentStatus
				commentGroup
				commentContent
				commentRefId
				memberId
				createdAt
				updatedAt
				roomDate {
					_id
					propertyId
					roomName
					roomMaxPersonal
					roomStandPersonal
					basePriceDayUse
					basePriceOvernight
					roomDiscountPrice
					roombedInfo
					roomImages
					roomStatus
					createdAt
					updatedAt
				}
			}
			metaCounter {
				total
			}
		}
	}
`;
/**************************
 *      RESERVATION       *
 *************************/
export const GET_MY_RESERVATION = gql`
	query GetMyReservation($input: NoAuthMemberInfoInput!) {
		getMyReservation(input: $input) {
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

export const GET_MY_RESERVATIONS = gql`
	query GetMyReservations($input: ReservationsInquiry!) {
		getMyReservations(input: $input) {
			list {
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
				propertyData {
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
					roomCount
				}
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
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *     NOTIFICATIONS      *
 *************************/
export const GET_MY_NOTIFICATIONS = gql`
	query GetMyNotifications($input: NotificationsInquiry!) {
		getMyNotifications(input: $input) {
			list {
				_id
				memberId
				title
				message
				type
				reservationId
				isRead
				createdAt
				updatedAt
				propertyData {
					_id
					propertyType
					propertyStatus
					propertyLocation
					propertyAddress
					propertyName
					propertyPrice
					propertyRooms
					propertyViews
					propertyReservations
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
					roomCount
				}
				propertyData {
					propertyType
					propertyStatus
					propertyLocation
					propertyAddress
					propertyName
					propertyPrice
					propertyRooms
					propertyViews
					propertyReservations
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
					roomCount
					_id
				}
				propertyId
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         AGENT         *
 *************************/
export const GET_MYROOMS = gql`
	query GetMyRooms($input: RoomsIquiry!) {
		getMyRooms(input: $input) {
			list {
				_id
				propertyId
				roomName
				roomMaxPersonal
				roomStandPersonal
				basePriceDayUse
				basePriceOvernight
				roomDiscountPrice
				roombedInfo
				roomImages
				roomStatus
				createdAt
				updatedAt
				stayPlans {
					_id
					roomTypeId
					stayPlanType
					stayPlanName
					stayPlanBasePrice
					stayPlanRules
					stayPlanstatus
					createdAt
					updatedAt
					inventories {
						_id
						roomTypeId
						stayPlanId
						inventoryDate
						inventoryAllotment
						inventoryPrice
						inventoryStatus
						createdAt
						updatedAt
					}
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_AGENT_RESERVATIONS = gql`
	query GetAgentReservations($input: ReservationsInquiry!) {
		getAgentReservations(input: $input) {
			list {
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
				memberInfo {
					guestName
					guestPhone
				}
				priceBreakdown {
					date
					unitPrice
					qty
					subtotal
				}
				propertyData {
					_id
					propertyType
					propertyStatus
					propertyLocation
					propertyAddress
					propertyName
					propertyPrice
					propertyRooms
					propertyViews
					propertyReservations
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
					roomCount
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_AGENT_PROPERTIES = gql`
	query GetAgentProperties($input: AgentPropertiesInquiry!) {
		getAgentProperties(input: $input) {
			list {
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
				roomCount
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
					memberComments
					memberPoints
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
				reservationData {
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
				}
				propertyReservations
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_ROOM_RESERVATIONS = gql`
	query GetRoomReservations($input: RoomReservationsInquiry!) {
		getRoomReservations(input: $input) {
			list {
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
				propertyData {
					_id
					propertyType
					propertyStatus
					propertyLocation
					propertyAddress
					propertyName
					propertyPrice
					propertyRooms
					propertyViews
					propertyReservations
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
					roomCount
				}
				memberInfo {
					guestName
					guestPhone
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         ANY            *
 *************************/
export const GET_FAQS = gql`
	query GetFaqs($input: FaqInquiry!) {
		getFaqs(input: $input) {
			list {
				_id
				question
				answer
				category
				isActive
				createdAt
				updatedAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_NOTICE = gql`
	query GetNotices($input: NoticeInquiry!) {
		getNotices(input: $input) {
			list {
				_id
				title
				content
				category
				isPinned
				views
				createdAt
				updatedAt
			}
			metaCounter {
				total
			}
		}
	}
`;
