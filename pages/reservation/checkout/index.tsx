import React, { use, useEffect, useState } from 'react';
import {
	Container,
	Box,
	Typography,
	TextField,
	Button,
	Card,
	CardContent,
	Divider,
	Checkbox,
	FormControlLabel,
	IconButton,
	InputAdornment,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import LayoutHome from '../../../libs/components/layout/LayoutHome';
import { useRouter } from 'next/router';
import { sweetBasicAlert, sweetErrorAlert, sweetTopSmallSuccessAlert } from '../../../libs/sweetAlert';
import { ReservationInput } from '../../../libs/types/reservation/reservation.input';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { GET_ROOM } from '../../../apollo/user/query';
import { RoomType } from '../../../libs/types/roomtype/roomtype';
import { userVar } from '../../../apollo/store';
import { CREATE_RESERVATION } from '../../../apollo/user/mutation';

const PAYMENT_METHODS = [
	'카카오페이',
	'토스페이',
	'신용/체크 카드',
	'네이버페이',
	'KB Pay',
	'PAYCO',
	'법인 카드',
	'휴대폰 결제',
	'간편 계좌이체',
];
const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];
const fweek = (d: Date) => WEEK_DAYS[d.getDay()];
const formatToMD = (dateStr: string) => {
	const [, month, day] = dateStr.split('-');
	return `${month}.${day}`;
};
interface ReservationCheckoutPageProps {
	initialInput: ReservationInput;
}
function changeStrTimeToNumber(time?: string): number {
	if (!time || !time.includes(':')) return 0;

	const [h, m] = time.split(':').map(Number);
	if (Number.isNaN(h) || Number.isNaN(m)) return 0;

	return h * 3600 + m * 60;
}
const ReservationCheckoutPage = (props: ReservationCheckoutPageProps) => {
	const { initialInput } = props;
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [selectedTimeStart, setSelectedTimeStart] = useState<string>('09:00');
	const [searchFilter, setSearchFilter] = useState<ReservationInput>(
		router?.query?.input ? JSON.parse(router.query.input as string) : initialInput,
	);
	const [hasRouterApplied, setHasRouterApplied] = useState(false);
	const [guestName, setGuestName] = useState('');
	const [guestPhone, setGuestPhone] = useState('');
	const [visitMethod, setVisitMethod] = useState<'walk' | 'car'>('walk');
	const [paymentMethod, setPaymentMethod] = useState<string>('카카오페이');
	const [agreeAll, setAgreeAll] = useState(false);

	/** APOLLO MUTATION **/
	const [createReservation] = useMutation(CREATE_RESERVATION);
	/** APOLLO REQUESTS **/
	const {
		loading: getRoomLoading,
		data: getRoomData,
		error: getRoomError,
		refetch: getRoomRefetch,
	} = useQuery(GET_ROOM, {
		fetchPolicy: 'cache-and-network',
		variables: { roomId: searchFilter?.roomTypeId },
		notifyOnNetworkStatusChange: true,
		skip: !hasRouterApplied,
	});

	/** LIFESICLE **/
	useEffect(() => {
		if (!router.isReady) return;
		if (router.query.input) {
			setSearchFilter(JSON.parse(router?.query?.input as string));
		}
		setHasRouterApplied(true);
	}, [router.isReady, router.query.input]);

	useEffect(() => {
		if (rangeTimeSolts.length < maxUsageTime * 2 + 1) {
			sweetBasicAlert(
				`${selectedTimeStart.replace(':', '시 ')}분에 입실하시면 [${Math.floor((rangeTimeSolts.length - 1) / 2)}]시간 ${
					((rangeTimeSolts.length - 1) / 2) % 1 ? '30분' : ''
				}이용하실 수 있습니다.`,
			);
		}
	}, [selectedTimeStart]);

	useEffect(() => {
		if (getRoomData?.getRoom) {
			setSelectedTimeStart(String(getRoomData?.getRoom?.stayPlans?.[0]?.stayPlanRules?.windowStart));
		}
	}, [getRoomData?.getRoom]);

	/**--- VARIABLES **/
	const roomData: RoomType = getRoomData?.getRoom;
	const checkInTime = changeStrTimeToNumber(String(roomData?.stayPlans?.[0]?.stayPlanRules?.windowStart));
	const checkOutTime = changeStrTimeToNumber(String(roomData?.stayPlans?.[0]?.stayPlanRules?.windowEnd));
	const maxUsageTime = Number(roomData?.stayPlans?.[0]?.stayPlanRules.durationHours);
	const roomPrice = searchFilter.stayPlan === 'DAY_USE' ? roomData?.basePriceDayUse : roomData?.basePriceOvernight;
	const discount = roomData?.roomDiscountPrice!;
	const totalPrice = roomPrice - discount;
	/** HANDLER **/
	function generateTimeSlots(startSec: number, endSec: number): string[] {
		const result: string[] = [];
		const MAX_END = checkOutTime; // 22:00 = 79200초
		const finalEnd = Math.min(endSec, MAX_END);
		for (let t = startSec; t <= finalEnd; t += 1800) {
			const date = new Date(t * 1000); // 초 → ms 변환
			const hh = String(date.getUTCHours()).padStart(2, '0');
			const mm = String(date.getUTCMinutes()).padStart(2, '0');
			result.push(`${hh}:${mm}`);
		}
		return result;
	}

	const TIME_SLOTS = generateTimeSlots(checkInTime, checkOutTime);

	const rangeTimeSolts = generateTimeSlots(
		changeStrTimeToNumber(selectedTimeStart),
		changeStrTimeToNumber(selectedTimeStart) + maxUsageTime * 3600,
	);

	const handleCreatReservation = async () => {
		if (!guestName || !guestPhone) {
			sweetBasicAlert('예약자 정보를 모두 입력해주세요!');
			return;
		}
		try {
			const reservationInput: ReservationInput = {
				propertyId: searchFilter.propertyId,
				roomTypeId: searchFilter.roomTypeId,
				stayPlanId: searchFilter.stayPlanId,
				reservationCheckIn: searchFilter.reservationCheckIn,
				reservationCheckOut: searchFilter.reservationCheckOut,
				reservationCheckInAt: selectedTimeStart,
				reservationCheckOutAt: rangeTimeSolts[rangeTimeSolts.length - 1],
				memberInfo: searchFilter.memberInfo,
				reservationQty: 1,
			};

			await createReservation({ variables: { input: reservationInput } });
			if (user._id) {
				sweetTopSmallSuccessAlert('예약이 완료 되었습니다!');
				router.push('/mypage/user?category=reservation-details');
			} else {
				sweetTopSmallSuccessAlert('예약이 완료 되었습니다!');
				router.push('/');
			}
		} catch (err: any) {
			sweetErrorAlert(err.message);
		}
	};

	return (
		<Container maxWidth="lg" className="container">
			<Box className="reservation-layout">
				{/* LEFT */}
				<Box className="reservation-main">
					<Typography variant="h5" className="reservation-title">
						예약 확인 및 결제
					</Typography>

					{/* 이용시간 */}
					{searchFilter?.stayPlan === 'DAY_USE' && (
						<Box className="section">
							<Box className="section-header">
								<Typography className="section-title">이용시간</Typography>
								<Typography className="section-sub">최대 {maxUsageTime}시간 이용 가능</Typography>
							</Box>
							<Box className="time-chip-wrap">
								{TIME_SLOTS.map((time) => {
									const startTime = selectedTimeStart === time;
									const endTime = rangeTimeSolts[rangeTimeSolts.length - 1] === time;
									const rangeClassName = time !== selectedTimeStart ? rangeTimeSolts.includes(time) : '';
									return (
										<Button
											key={time}
											variant="outlined"
											className={
												'time-chip' +
												(selectedTimeStart === time ? ' time-chip--selected' : '') +
												(rangeClassName ? ' time-chip--range-time' : '') +
												(startTime ? ' time-chip--start-time' : '') +
												(endTime ? ' time-chip--end-time' : '')
											}
											onClick={() => setSelectedTimeStart(time)}
										>
											{time}
										</Button>
									);
								})}
							</Box>
						</Box>
					)}

					{/* 예약자 정보 (폭 50%) */}
					<Box className="section section--half">
						<Typography className="section-title">예약자 정보</Typography>

						<Box className="field-group">
							<Typography className="field-label">예약자 이름</Typography>
							<TextField
								size="small"
								fullWidth
								placeholder="홍길동"
								value={guestName}
								onChange={(e) => {
									setSearchFilter({
										...searchFilter,
										memberInfo: {
											...searchFilter.memberInfo,
											guestName: e.target.value,
										},
									});

									setGuestName(e.target.value);
								}}
								InputProps={{
									endAdornment: guestName && (
										<InputAdornment position="end">
											<IconButton
												size="small"
												onClick={() => {
													setSearchFilter({
														...searchFilter,
														memberInfo: {
															...searchFilter.memberInfo,
															guestName: '',
														},
													});
													setGuestName('');
												}}
												edge="end"
											>
												<ClearIcon fontSize="small" />
											</IconButton>
										</InputAdornment>
									),
								}}
							/>
						</Box>

						<Box className="field-group">
							<Typography className="field-label">휴대폰 번호</Typography>
							<TextField
								size="small"
								fullWidth
								value={guestPhone}
								onChange={(e) => {
									setSearchFilter({
										...searchFilter,
										memberInfo: {
											...searchFilter.memberInfo,
											guestPhone: e.target.value,
										},
									});

									setGuestPhone(e.target.value);
								}}
								InputProps={{
									endAdornment: guestPhone && (
										<InputAdornment position="end">
											<IconButton
												size="small"
												onClick={() => {
													setSearchFilter({
														...searchFilter,
														memberInfo: {
															...searchFilter.memberInfo,
															guestPhone: '',
														},
													});
													setGuestPhone('');
												}}
												edge="end"
											>
												<ClearIcon fontSize="small" />
											</IconButton>
										</InputAdornment>
									),
								}}
							/>
							<Typography className="field-help">입력한 휴대폰 번호는 안심번호로 변경되어 숙소에 전달돼요.</Typography>
						</Box>

						<Box className="field-group">
							<Typography className="field-label">방문 방법</Typography>
							<Box className="visit-method-wrap">
								<Button
									className={'visit-btn' + (visitMethod === 'walk' ? ' visit-btn--active' : '')}
									onClick={() => setVisitMethod('walk')}
								>
									🚶 도보 방문
								</Button>
								<Button
									className={'visit-btn' + (visitMethod === 'car' ? ' visit-btn--active' : '')}
									onClick={() => setVisitMethod('car')}
								>
									🚗 차량 방문
								</Button>
							</Box>
						</Box>
					</Box>

					<Divider className="divider-lg" />

					{/* 결제 수단 */}
					<Box className="section">
						<Typography className="section-title">결제 수단</Typography>

						<Box className="payment-grid">
							{PAYMENT_METHODS.map((method) => (
								<Button
									key={method}
									className={'payment-chip' + (paymentMethod === method ? ' payment-chip--selected' : '')}
									onClick={() => setPaymentMethod(method)}
								>
									{method}
								</Button>
							))}
						</Box>

						<FormControlLabel
							className="remember-check"
							control={<Checkbox checked={agreeAll} onChange={(e) => setAgreeAll(e.target.checked)} size="small" />}
							label="이 결제 수단을 다음에도 사용"
						/>
					</Box>
				</Box>

				{/* RIGHT */}
				<Box className="reservation-sidebar">
					<Card className="room-card" variant="outlined">
						<CardContent>
							<Typography className="room-title">{searchFilter.propertyName}</Typography>
							<Box className="room-info">
								<img className="room-thumb" src={`${process.env.REACT_APP_API_URL}/${roomData?.roomImages[0]}`} />
								<Box className="room-meta">
									<Box className="room-meta-row">
										<span className="room-meta-label">객실</span>
										<span className="room-meta-value">{roomData?.roomName}</span>
									</Box>
									<Box className="room-meta-row">
										<span className="room-meta-label">일정</span>
										{searchFilter.stayPlan === 'DAY_USE' ? (
											<span className="room-meta-value">
												{formatToMD(searchFilter.reservationCheckIn!)} (
												{fweek(new Date(searchFilter.reservationCheckIn!))}) {selectedTimeStart} ~{' '}
												{formatToMD(searchFilter.reservationCheckOut!)} (
												{fweek(new Date(searchFilter.reservationCheckOut!))}){' '}
												{rangeTimeSolts[rangeTimeSolts.length - 1]} (대실)
											</span>
										) : (
											<span className="room-meta-value">
												{formatToMD(searchFilter.reservationCheckIn!)} (
												{fweek(new Date(searchFilter.reservationCheckIn!))}) {searchFilter.reservationCheckInAt} ~{' '}
												{formatToMD(searchFilter.reservationCheckOut!)} (
												{fweek(new Date(searchFilter.reservationCheckOut!))}) {searchFilter.reservationCheckOutAt}{' '}
												(숙박)
											</span>
										)}
									</Box>
								</Box>
							</Box>
						</CardContent>
					</Card>

					<Card className="payment-card" variant="outlined">
						<CardContent>
							<Typography className="section-title mb-16">결제 정보</Typography>
							<Box className="payment-row">
								<span className="payment-label">객실 가격</span>
								<span className="payment-value">{roomPrice?.toLocaleString()}원</span>
							</Box>
							<Box className="payment-row">
								<span className="payment-label">할인 금액</span>
								<span className="payment-value">{discount ? `-${discount}원` : '0원'}</span>
							</Box>
							<Divider className="divider-sm" />
							<Box className="payment-row total">
								<span className="payment-label">총 결제 금액</span>
								<span className="payment-total">{totalPrice.toLocaleString()}원</span>
							</Box>

							<Box className="agree-wrap">
								<FormControlLabel
									control={<Checkbox size="small" checked={agreeAll} onChange={(e) => setAgreeAll(e.target.checked)} />}
									label="약관 전체동의"
								/>
							</Box>

							<Button fullWidth className="pay-button" disabled={!agreeAll} onClick={handleCreatReservation}>
								{totalPrice.toLocaleString()}원 결제하기
							</Button>
						</CardContent>
					</Card>
				</Box>
			</Box>
		</Container>
	);
};

ReservationCheckoutPage.defaultProps = {
	initialInput: {
		propertyId: '',
		roomTypeId: '',
		stayPlanId: '',
		reservationCheckIn: '',
		reservationCheckOut: '',
		reservationCheckInAt: '',
		reservationCheckOutAt: '',
		memberInfo: {
			guestName: '',
			guestPhone: '',
		},
	},
};

export default LayoutHome(ReservationCheckoutPage);
