import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { GET_PROPERTIES } from '../../apollo/user/query';
import { LIKE_TARGET_PROPERTY } from '../../apollo/user/mutation';
import { userVar } from '../../apollo/store';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../sweetAlert';
import { Message } from '../enums/common.enum';
import { PropertiesInquiry, PropertyInquiry } from '../types/property/property.input';
import { Property } from '../types/property/property';
import { T } from '../types/common';
import useDateHook from './useDate';

export function usePropertySection(initialInput: PropertiesInquiry) {
	const router = useRouter();
	const { t } = useTranslation('common');
	const user = useReactiveVar(userVar);
	const { checkIn, checkOut } = useDateHook();

	const { loading, data, error, refetch } = useQuery(GET_PROPERTIES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
	});

	const properties: Property[] = data?.getProperties?.list ?? [];

	const [likeTargetProperty] = useMutation(LIKE_TARGET_PROPERTY);

	const likePropertyHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			await likeTargetProperty({ variables: { input: id } });
			await refetch({ input: initialInput });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likePropertyHandler:', err.message);
			sweetMixinErrorAlert(err.message);
		}
	};

	const handlePushPropertyDetail = (property: Property) => {
		const url: PropertyInquiry = {
			_id: String(property._id),
			propertyName: encodeURIComponent(property.propertyName),
			checkInDate: checkIn,
			checkOutDate: checkOut,
			personal: 2,
		};
		router.push(
			`/property/propertyId=${property._id}?input=${JSON.stringify(url)}`,
			`/property/propertyId=${property._id}?input=${JSON.stringify(url)}`,
			{ scroll: false },
		);
	};

	return {
		properties,
		loading,
		error,
		user,
		t,
		likePropertyHandler,
		handlePushPropertyDetail,
	};
}
