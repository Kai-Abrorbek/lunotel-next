import { Box, IconButton, Typography } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import { Property } from '../../types/property/property';
import { T } from '../../types/common';

interface PropertyCardProps {
	property: Property;
	user: T;
	onLike: (user: T, id: string) => void;
	onClick: (property: Property) => void;
}

const PropertyCard = ({ property, user, onLike, onClick }: PropertyCardProps) => {
	const isFav = property?.meLiked?.[0]?.myFavorite;

	return (
		<Box className="property-card" onClick={() => onClick(property)} sx={{ minWidth: 0 }}>
			<Box className="property-card__image-wrapper">
				<img
					src={`${process.env.REACT_APP_API_URL}/${property.propertyImages?.[0]}`}
					alt={property.propertyName}
					className="property-card__image"
				/>
				<Box className="property-card__image-top">
					<IconButton
						className="property-card__fav-btn"
						onClick={(e) => {
							e.stopPropagation();
							onLike(user, property._id);
						}}
					>
						{isFav ? (
							<FavoriteIcon className="property-card__fav-icon active" />
						) : (
							<FavoriteBorderIcon className="property-card__fav-icon" />
						)}
					</IconButton>
				</Box>
			</Box>

			<Box className="property-card__info">
				<Typography className="property-card__type">{property.propertyType}</Typography>
				<Typography className="property-card__name">{property.propertyName}</Typography>
				<Typography className="property-card__location">
					{property.propertyLocation} · {property.propertyAddress}
				</Typography>

				<Box className="property-card__rating-row">
					<Box className="property-card__rating-badge">
						<StarIcon className="property-card__rating-star" />
						<span className="property-card__rating-score">{property.propertyRank?.toFixed(1)}</span>
					</Box>
					<span className="property-card__rating-count">{property.propertyComments?.toLocaleString()}명 평가</span>
				</Box>

				{property.propertyPrice && <Typography className="property-card__coupon-text">쿠폰 적용시</Typography>}

				<Box className="property-card__price-row">
					<span className="property-card__price-current">{property.propertyPrice?.toLocaleString()}원</span>
				</Box>
			</Box>
		</Box>
	);
};

export default PropertyCard;
