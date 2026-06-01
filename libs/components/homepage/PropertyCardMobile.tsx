import { Box, IconButton, Typography } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import { Property } from '../../types/property/property';
import { T } from '../../types/common';

interface PropertyCardMobileProps {
	property: Property;
	user: T;
	onLike: (user: T, id: string) => void;
	onClick: (property: Property) => void;
}

const PropertyCardMobile = ({ property, user, onLike, onClick }: PropertyCardMobileProps) => {
	const isFav = property?.meLiked?.[0]?.myFavorite;

	return (
		<Box className="property-card-mobile" onClick={() => onClick(property)}>
			<Box className="property-card-mobile__img-wrap">
				<img
					src={`${process.env.REACT_APP_API_URL}/${property.propertyImages?.[0]}`}
					alt={property.propertyName}
					className="property-card-mobile__img"
				/>
				<IconButton
					className="property-card-mobile__fav"
					onClick={(e) => {
						e.stopPropagation();
						onLike(user, property._id);
					}}
				>
					{isFav ? (
						<FavoriteIcon sx={{ fontSize: 16, color: '#ff4e5b' }} />
					) : (
						<FavoriteBorderIcon sx={{ fontSize: 16, color: '#ccc' }} />
					)}
				</IconButton>
			</Box>

			<Box className="property-card-mobile__info">
				<Typography className="property-card-mobile__type">{property.propertyType}</Typography>
				<Typography className="property-card-mobile__name">{property.propertyName}</Typography>
				<Typography className="property-card-mobile__location">{property.propertyLocation}</Typography>
				<Box className="property-card-mobile__rating">
					<StarIcon sx={{ fontSize: 11, color: '#ff4e5b' }} />
					<span>{property.propertyRank?.toFixed(1)}</span>
					<span className="property-card-mobile__count">{property.propertyComments}명</span>
				</Box>
				<Typography className="property-card-mobile__price">{property.propertyPrice?.toLocaleString()}원</Typography>
			</Box>
		</Box>
	);
};

export default PropertyCardMobile;
