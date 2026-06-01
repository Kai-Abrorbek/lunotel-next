import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Property } from '../../types/property/property';
import { usePropertySection } from '../../hooks/usePropertySection';
import PropertyCard from '../common/PropertyCard';
import PropertyCardSkeleton from '../common/PropertyCardSkeleton';
import { PropertiesInquiry } from '../../types/property/property.input';
import { PropertyType, PropertyTypeKorean } from '../../enums/property.enum';

const CATEGORIES_K: PropertyTypeKorean[] = Object.values(PropertyTypeKorean);
const CATEGORIES_EN: PropertyType[] = Object.values(PropertyType);

interface Props {
	initialInput: PropertiesInquiry;
}

const PopularStaysMobile = ({ initialInput }: Props) => {
	const [activeCategory, setActiveCategory] = useState<PropertyType>(PropertyType.ALL);
	const { properties, user, loading, t, likePropertyHandler, handlePushPropertyDetail } =
		usePropertySection(initialInput);

	const filtered =
		activeCategory === 'ALL' ? properties : properties.filter((p: Property) => p.propertyType === activeCategory);

	return (
		<Box className="mobile-section">
			<Box className="mobile-section__header">
				<Typography className="mobile-section__title">{t('인기 추천 숙소')}</Typography>
				<Box className="mobile-section__tabs">
					{CATEGORIES_EN.map((c, idx) => (
						<Button
							key={c}
							className={`mobile-section__tab ${activeCategory === c ? 'active' : ''}`}
							onClick={() => setActiveCategory(c)}
						>
							{t(`${CATEGORIES_K[idx]}`)}
						</Button>
					))}
				</Box>
			</Box>

			<Box className="mobile-section__scroll">
				{loading
					? [1, 2, 3, 4].map((i) => (
							<Box key={i} className="mobile-section__card-wrap">
								<PropertyCardSkeleton />
							</Box>
					  ))
					: filtered.map((p: Property) => (
							<Box key={p._id} className="mobile-section__card-wrap">
								<PropertyCard
									property={p}
									user={user}
									onLike={likePropertyHandler}
									onClick={handlePushPropertyDetail}
								/>
							</Box>
					  ))}
			</Box>
		</Box>
	);
};

PopularStaysMobile.defaultProps = {
	initialInput: {
		page: 1,
		limit: 20,
		sort: 'propertyLikes',
		direction: 'DESC',
		search: {},
	},
};

export default PopularStaysMobile;
