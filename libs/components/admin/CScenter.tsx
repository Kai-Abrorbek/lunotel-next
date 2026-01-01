import { useState } from 'react';

// CSCenter 컴포넌트
const CSCenter = () => {
	const [activeTab, setActiveTab] = useState<'notice' | 'faq'>('notice');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalType, setModalType] = useState<'notice' | 'faq'>('notice');

	const [notices, setNotices] = useState([
		{
			id: 1,
			title: '시스템 정기 점검 안내',
			content: '2025년 1월 5일 오전 2시부터 4시까지 정기 점검이 진행됩니다.',
			date: '2025-12-20',
			author: '관리자',
		},
		{
			id: 2,
			title: '개인정보 처리방침 변경 안내',
			content: '개인정보 처리방침이 2025년 1월 1일부로 변경됩니다.',
			date: '2025-12-15',
			author: '관리자',
		},
		{
			id: 3,
			title: '신규 결제 시스템 도입',
			content: '더욱 편리한 결제를 위해 신규 결제 시스템을 도입했습니다.',
			date: '2025-12-10',
			author: '관리자',
		},
	]);

	const [faqs, setFaqs] = useState([
		{
			id: 1,
			question: '숙소 등록은 어떻게 하나요?',
			answer: '호스트 신청 후 승인이 완료되면 숙소를 등록하실 수 있습니다.',
			category: '호스트',
		},
		{
			id: 2,
			question: '예약 취소 수수료는 어떻게 되나요?',
			answer: '예약 취소 정책은 숙소마다 다르며, 예약 시 확인하실 수 있습니다.',
			category: '예약',
		},
		{
			id: 3,
			question: '회원 탈퇴는 어떻게 하나요?',
			answer: '마이페이지 > 설정 > 회원탈퇴에서 진행하실 수 있습니다.',
			category: '계정',
		},
		{
			id: 4,
			question: '환불은 언제 되나요?',
			answer: '취소 완료 후 영업일 기준 3-5일 이내에 환불됩니다.',
			category: '결제',
		},
	]);

	const [formData, setFormData] = useState({
		title: '',
		content: '',
		question: '',
		answer: '',
		category: '호스트',
	});

	const openModal = (type: 'notice' | 'faq') => {
		setModalType(type);
		setIsModalOpen(true);
		setFormData({
			title: '',
			content: '',
			question: '',
			answer: '',
			category: '호스트',
		});
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	const handleSubmit = () => {
		if (modalType === 'notice') {
			const newNotice = {
				id: notices.length + 1,
				title: formData.title,
				content: formData.content,
				date: new Date().toISOString().split('T')[0],
				author: '관리자',
			};
			setNotices([newNotice, ...notices]);
		} else {
			const newFaq = {
				id: faqs.length + 1,
				question: formData.question,
				answer: formData.answer,
				category: formData.category,
			};
			setFaqs([newFaq, ...faqs]);
		}
		closeModal();
	};

	const handleDelete = (id: number, type: 'notice' | 'faq') => {
		if (window.confirm('정말로 삭제하시겠습니까?')) {
			if (type === 'notice') {
				setNotices(notices.filter((notice) => notice.id !== id));
			} else {
				setFaqs(faqs.filter((faq) => faq.id !== id));
			}
		}
	};

	return (
		<div>
			<div className="page-header">
				<h1 className="page-title">CS 센터</h1>
				<p className="page-subtitle">공지사항 및 FAQ 관리</p>
			</div>

			{/* Tabs */}
			<div className="cs-tabs">
				<button className={`tab-btn ${activeTab === 'notice' ? 'active' : ''}`} onClick={() => setActiveTab('notice')}>
					공지사항 ({notices.length})
				</button>
				<button className={`tab-btn ${activeTab === 'faq' ? 'active' : ''}`} onClick={() => setActiveTab('faq')}>
					FAQ ({faqs.length})
				</button>
			</div>

			{/* Add Button */}
			<div className="cs-header">
				<button className="add-btn" onClick={() => openModal(activeTab)}>
					+ {activeTab === 'notice' ? '공지사항 추가' : 'FAQ 추가'}
				</button>
			</div>

			{/* Notice List */}
			{activeTab === 'notice' && (
				<div className="cs-list">
					{notices.map((notice) => (
						<div key={notice.id} className="cs-item">
							<div className="cs-item-header">
								<h3 className="cs-item-title">{notice.title}</h3>
								<button className="delete-btn-icon" onClick={() => handleDelete(notice.id, 'notice')}>
									✕
								</button>
							</div>
							<p className="cs-item-content">{notice.content}</p>
							<div className="cs-item-footer">
								<span className="cs-date">📅 {notice.date}</span>
								<span className="cs-author">✍️ {notice.author}</span>
							</div>
						</div>
					))}
				</div>
			)}

			{/* FAQ List */}
			{activeTab === 'faq' && (
				<div className="cs-list">
					{faqs.map((faq) => (
						<div key={faq.id} className="cs-item">
							<div className="cs-item-header">
								<div className="faq-header-content">
									<span className="faq-category">{faq.category}</span>
									<h3 className="cs-item-title">{faq.question}</h3>
								</div>
								<button className="delete-btn-icon" onClick={() => handleDelete(faq.id, 'faq')}>
									✕
								</button>
							</div>
							<p className="cs-item-content faq-answer">{faq.answer}</p>
						</div>
					))}
				</div>
			)}

			{/* Modal */}
			{isModalOpen && (
				<div className="modal-overlay" onClick={closeModal}>
					<div className="modal-content" onClick={(e) => e.stopPropagation()}>
						<div className="modal-header">
							<h2 className="modal-title">{modalType === 'notice' ? '공지사항 추가' : 'FAQ 추가'}</h2>
							<button className="modal-close" onClick={closeModal}>
								✕
							</button>
						</div>

						<div className="modal-body">
							{modalType === 'notice' ? (
								<>
									<div className="form-group">
										<label className="form-label">제목</label>
										<input
											type="text"
											className="form-input"
											placeholder="공지사항 제목을 입력하세요"
											value={formData.title}
											onChange={(e) => setFormData({ ...formData, title: e.target.value })}
										/>
									</div>
									<div className="form-group">
										<label className="form-label">내용</label>
										<textarea
											className="form-textarea"
											placeholder="공지사항 내용을 입력하세요"
											rows={6}
											value={formData.content}
											onChange={(e) => setFormData({ ...formData, content: e.target.value })}
										/>
									</div>
								</>
							) : (
								<>
									<div className="form-group">
										<label className="form-label">카테고리</label>
										<select
											className="form-select"
											value={formData.category}
											onChange={(e) => setFormData({ ...formData, category: e.target.value })}
										>
											<option value="호스트">호스트</option>
											<option value="예약">예약</option>
											<option value="계정">계정</option>
											<option value="결제">결제</option>
											<option value="기타">기타</option>
										</select>
									</div>
									<div className="form-group">
										<label className="form-label">질문</label>
										<input
											type="text"
											className="form-input"
											placeholder="자주 묻는 질문을 입력하세요"
											value={formData.question}
											onChange={(e) => setFormData({ ...formData, question: e.target.value })}
										/>
									</div>
									<div className="form-group">
										<label className="form-label">답변</label>
										<textarea
											className="form-textarea"
											placeholder="답변을 입력하세요"
											rows={6}
											value={formData.answer}
											onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
										/>
									</div>
								</>
							)}
						</div>

						<div className="modal-footer">
							<button className="modal-btn-cancel" onClick={closeModal}>
								취소
							</button>
							<button className="modal-btn-submit" onClick={handleSubmit}>
								추가
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default CSCenter;
