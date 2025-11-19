import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Properties = () => {
	const router = useRouter();
	const raw = router.query.input;
	if (typeof raw === 'string') {
		const parsed = JSON.parse(raw); // ✅
		console.log(parsed);
	}
	return <h1>Properties</h1>;
};

export default Properties;
