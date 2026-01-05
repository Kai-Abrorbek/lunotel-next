import React, { useState } from 'react';
import LayoutHome from '../../libs/components/layout/LayoutHome';
import ChatWindow from '../../libs/components/cs/ChatWindow';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

// --- 아이콘 컴포넌트 (그대로 유지) ---
const PhoneIcon = () => (
	<svg
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		stroke="#ccc"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
	</svg>
);
const ChatIcon = () => (
	<svg width="16" height="16" viewBox="0 0 24 24" fill="#666" style={{ marginRight: '6px' }}>
		<path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
	</svg>
);
const ChevronDownIcon = () => (
	<svg
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill="none"
		stroke="#ccc"
		strokeWidth="3"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<polyline points="6 9 12 15 18 9"></polyline>
	</svg>
);

const CATEGORIES = [
	'자주 묻는 질문',
	'이용문의',
	'결제/혜택',
	'패키지',
	'국내 숙소',
	'해외 숙소',
	'공간대여',
	'레저·티켓',
	'실시간렌터카',
	'국내 항공',
	'해외 항공',
	'항공+숙소',
];

interface FAQItem {
	id: number;
	category: string;
	question: string;
	answer: string;
}

const FAQ_LIST: FAQItem[] = [
	{
		id: 1,
		category: '숙소',
		question: '예약을 취소하고 싶어요.',
		answer:
			'예약 취소는 [마이페이지 > 예약 내역]에서 가능합니다. 단, 숙소의 취소 규정에 따라 수수료가 발생할 수 있으니 유의해주세요.',
	},
	{
		id: 2,
		category: '공통',
		question: '천재지변/감염병으로 인한 예약취소는 어떻게 하나요?',
		answer: '천재지변이나 감염병으로 인한 취소는 고객센터로 직접 문의해주시면 상황 확인 후 처리를 도와드리고 있습니다.',
	},
	{
		id: 3,
		category: '공통',
		question: '천재지변/감염병으로 인한 예약취소는 어떻게 하나요?',
		answer: '천재지변이나 감염병으로 인한 취소는 고객센터로 직접 문의해주시면 상황 확인 후 처리를 도와드리고 있습니다.',
	},
	{
		id: 4,
		category: '공통',
		question: '천재지변/감염병으로 인한 예약취소는 어떻게 하나요?',
		answer: '천재지변이나 감염병으로 인한 취소는 고객센터로 직접 문의해주시면 상황 확인 후 처리를 도와드리고 있습니다.',
	},
	{
		id: 5,
		category: '공통',
		question: '천재지변/감염병으로 인한 예약취소는 어떻게 하나요?',
		answer: '천재지변이나 감염병으로 인한 취소는 고객센터로 직접 문의해주시면 상황 확인 후 처리를 도와드리고 있습니다.',
	},
	{
		id: 6,
		category: '공통',
		question: '천재지변/감염병으로 인한 예약취소는 어떻게 하나요?',
		answer: '천재지변이나 감염병으로 인한 취소는 고객센터로 직접 문의해주시면 상황 확인 후 처리를 도와드리고 있습니다.',
	},
];

const CustomerCenter = () => {
	const [activeCategory, setActiveCategory] = useState<string>('자주 묻는 질문');
	const [openFaqId, setOpenFaqId] = useState<number | null>(null);
	const [isChatOpen, setIsChatOpen] = useState(false);

	const toggleFaq = (id: number) => {
		setOpenFaqId((prev) => (prev === id ? null : id));
	};

	return (
		<div className="customer-center-container">
			<header className="page-header">
				<h1>고객센터</h1>
				<p>어려움이나 궁금한 점이 있으신가요?</p>
			</header>
			<section className="contact-card">
				<div className="info-area">
					<div className="phone-number-row">
						<PhoneIcon />
						<h2>1234-5678</h2>
					</div>
					<div className="operating-hours">
						<p>고객행복센터(전화): 오전 9시 ~ 새벽 3시 운영</p>
						<p>채팅 상담 문의: 24시간 운영</p>
					</div>
				</div>
				<button className="chat-button" onClick={() => setIsChatOpen(true)}>
					<ChatIcon />
					채팅 상담
				</button>
			</section>
			<section className="faq-section">
				<h3>자주 묻는 질문</h3>
				<div className="category-tabs">
					{CATEGORIES.map((cat) => (
						<button
							key={cat}
							className={`tab-item ${activeCategory === cat ? 'active' : ''}`}
							onClick={() => setActiveCategory(cat)}
						>
							{cat}
						</button>
					))}
				</div>

				<ul className="faq-list">
					{FAQ_LIST.map((item) => {
						const isOpen = openFaqId === item.id;
						return (
							<li key={item.id} className={`faq-item ${isOpen ? 'open' : ''}`}>
								<div className="question-row" onClick={() => toggleFaq(item.id)}>
									<span className="q-icon">Q</span>
									<span className="question-text">
										[{item.category}] {item.question}
									</span>
									<span className="arrow-icon">
										<ChevronDownIcon />
									</span>
								</div>

								{/* 애니메이션을 위한 Wrapper 구조 변경 */}
								<div className="answer-wrapper">
									<div className="answer-content">{item.answer}</div>
								</div>
							</li>
						);
					})}
				</ul>
			</section>
			{isChatOpen && <ChatWindow onClose={() => setIsChatOpen(false)} />}
		</div>
	);
};

export default LayoutHome(CustomerCenter);
