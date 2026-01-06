import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				{/* <!-- Favicon --> */}
				<meta name="robots" content="index,follow" />
				<link rel="icon" type="image/png" href="/newlogo2.png" />
				<link rel="apple-touch-icon" href="/favicon-lunotel.png" />

				{/* <!-- Theme color --> */}
				<meta name="theme-color" content="#ffb45a" />
				{/* SEO */}
				<meta name="title" content="Lunotel — 빠른 호텔 예약 플랫폼" />
				<meta
					name="description"
					content="Find and book hotels anytime with Lunotel. Affordable cozy stays, quick booking, and easy search. | Бронируйте отели легко и удобно с Lunotel. Лучшие цены и комфортные номера. | Lunotel에서 빠르게 호텔을 예약하세요. 최적의 가격과 최고의 숙소를 만나보세요."
				/>

				<meta
					name="keywords"
					content="hotel,호텔예약,숙소검색,여행,예약,room booking,South Korea hotels,Lunotel,cheap hotels,best hotels,코리안 호텔,guesthouse,travel"
				/>

				{/* Open Graph (SNS 공유용)  */}
				<meta property="og:type" content="website" />
				<meta property="og:site_name" content="Lunotel" />
				<meta property="og:title" content="Lunotel — 귀여운 호텔 예약 플랫폼" />
				<meta
					property="og:description"
					content="즉시 검색하고 예약하세요. Lunotel에서 최적의 가격으로 최고의 숙소를 만나보세요."
				/>
				<meta property="og:image" content="/lunotel-favicon.png" />
				<meta property="og:url" content="https://lunotel.cloud" />
				<meta
					name="description"
					content={
						'Find and book hotels anytime, anywhere with Lunotel. Discover the best stays at the best prices. | ' +
						'Бронируйте отели в любое время и в любом месте с Lunotel. Лучшие варианты размещения по лучшим ценам. | ' +
						'언제 어디서든 호텔을 예약하세요. Lunotel에서 최적의 가격으로 최고의 숙소를 만나보세요.'
					}
				/>
				<script
					src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.KAKAO_JAVASCRIPT_KEY_MAP}&autoload=false&libraries=services`}
					type="text/javascript"
				></script>
				<script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
