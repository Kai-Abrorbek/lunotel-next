import { useState } from 'react';

function useCalendar() {
	const [currentMonth, setCurrentMonth] = useState<Date>(() => {
		const d = new Date();
		return new Date(d.getFullYear(), d.getMonth(), 1);
	});
	const [nextMonth, setNextMonth] = useState<Date>(() => {
		const d = new Date();
		return new Date(d.getFullYear(), d.getMonth() + 1, 1);
	});

	const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

	const formatRangeLabel = (checkIn: Date | undefined, checkOut: Date | undefined) => {
		if (!checkIn || !checkOut) return '날짜를 선택하세요';

		const nights = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24);

		const fmonth = (d: Date) => (d.getMonth() + 1).toString().padStart(2, '0');
		const fday = (d: Date) => d.getDate().toString().padStart(2, '0');
		const fweek = (d: Date) => WEEK_DAYS[d.getDay()];

		return `${fmonth(checkIn)}.${fday(checkIn)} ${fweek(checkIn)} - ${fmonth(checkOut)}.${fday(checkOut)} ${fweek(
			checkOut,
		)} (${nights}박)`;
	};

	const buildCalendarCells = (monthDate: Date) => {
		const year = monthDate.getFullYear();
		const month = monthDate.getMonth();
		const firstDay = new Date(year, month, 1);
		const firstDow = firstDay.getDay();
		const daysInMonth = new Date(year, month + 1, 0).getDate();

		const cells: (Date | null)[] = [];

		for (let i = 0; i < firstDow; i++) cells.push(null);
		for (let d = 1; d <= daysInMonth; d++) {
			cells.push(new Date(year, month, d));
		}
		while (cells.length % 7 !== 0) cells.push(null);

		return cells;
	};

	const changeMonth = (offset: number) => {
		setCurrentMonth((prev) => {
			const year = prev.getFullYear();
			const month = prev.getMonth() + offset;
			return new Date(year, month, 1);
		});

		setNextMonth((prev) => {
			const year = prev.getFullYear();
			const month = prev.getMonth() + offset;
			return new Date(year, month, 1);
		});
	};

	return {
		currentMonth,
		setCurrentMonth,
		nextMonth,
		setNextMonth,
		formatRangeLabel,
		WEEK_DAYS,
		buildCalendarCells,
		changeMonth,
	};
}

export default useCalendar;
