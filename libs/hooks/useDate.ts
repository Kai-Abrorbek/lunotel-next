import { useMemo, useState } from 'react';

function useDateHook() {
	const formatDate = (date: Date, addDays = 0) => {
		const d = new Date(date);
		d.setDate(d.getDate() + addDays);
		const y = d.getFullYear();
		const m = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		return `${y}-${m}-${day}`;
	};

	const today = useMemo(() => {
		const d = new Date();
		return new Date(d.getFullYear(), d.getMonth(), d.getDate());
	}, []);

	function isSameDate(a: Date | undefined, b: Date | undefined) {
		if (!a || !b) return false;
		return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
	}

	const toDate = (value: string | undefined): Date | undefined => {
		return value ? new Date(value) : undefined;
	};

	const inRange = (day: Date, checkIn: Date | undefined, checkOut: Date | undefined) => {
		if (!checkIn || !checkOut) return false;
		const t = day.getTime();
		return t > checkIn.getTime() && t < checkOut.getTime();
	};

	const isPastDate = (day: Date | null, baseMonth: Date) => {
		if (!day) return false;
		const cellDate = new Date(baseMonth.getFullYear(), baseMonth.getMonth(), day.getDate());
		return cellDate < today;
	};

	return {
		formatDate,
		today,
		isSameDate,
		toDate,
		inRange,
		isPastDate,
	};
}

export default useDateHook;
