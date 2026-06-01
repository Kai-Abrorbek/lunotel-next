import { Box } from '@mui/material';

const PropertyCardSkeleton = () => {
	return (
		<Box className="property-card-skeleton">
			<Box className="skeleton-image" />
			<Box className="skeleton-info">
				<Box className="skeleton-line skeleton-line--short" />
				<Box className="skeleton-line skeleton-line--long" />
				<Box className="skeleton-line skeleton-line--medium" />
				<Box className="skeleton-line skeleton-line--short" />
				<Box className="skeleton-line skeleton-line--price" />
			</Box>
		</Box>
	);
};

export default PropertyCardSkeleton;
