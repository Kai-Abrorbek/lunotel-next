import React, { useState, useEffect, useRef } from 'react';

// --- 아이콘 컴포넌트 ---
const SendIcon = () => (
	<svg
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<line x1="22" y1="2" x2="11" y2="13"></line>
		<polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
	</svg>
);
const CloseIcon = () => (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<line x1="18" y1="6" x2="6" y2="18"></line>
		<line x1="6" y1="6" x2="18" y2="18"></line>
	</svg>
);
const AgentAvatar = () => (
	<svg width="40" height="40" viewBox="0 0 24 24" fill="#e1f0ff" stroke="#1273e4" strokeWidth="1.5">
		<circle cx="12" cy="12" r="10" />
		<path d="M8 14s1.5 2 4 2 4-2 4-2" />
		<line x1="9" y1="9" x2="9.01" y2="9" />
		<line x1="15" y1="9" x2="15.01" y2="9" />
	</svg>
);

// --- 타입 정의 ---
interface Message {
	id: number;
	text: string;
	sender: 'user' | 'agent';
	timestamp: string;
}

const INITIAL_MESSAGES: Message[] = [
	{ id: 1, text: '안녕하세요! 무엇을 도와드릴까요? 😊', sender: 'agent', timestamp: getCurrentTime() },
];

// 현재 시간 구하는 헬퍼 함수
function getCurrentTime() {
	const now = new Date();
	return now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
}

interface ChatWindowProps {
	onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onClose }) => {
	const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
	const [inputText, setInputText] = useState('');
	const [isAgentTyping, setIsAgentTyping] = useState(false);

	// 스크롤 제어를 위한 Ref
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// 메시지 추가될 때마다 스크롤 아래로 이동
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages, isAgentTyping]);

	// 메시지 전송 핸들러
	const handleSendMessage = (text: string) => {
		if (!text.trim()) return;

		const newMessage: Message = {
			id: Date.now(),
			text: text,
			sender: 'user',
			timestamp: getCurrentTime(),
		};

		setMessages((prev) => [...prev, newMessage]);
		setInputText('');
		setIsAgentTyping(true); // 상담원 입력중 표시 시작

		// 1.5초 뒤에 상담원 자동 응답 시뮬레이션
		setTimeout(() => {
			const replyText = getAutoReply(text);
			const agentMessage: Message = {
				id: Date.now() + 1,
				text: replyText,
				sender: 'agent',
				timestamp: getCurrentTime(),
			};
			setMessages((prev) => [...prev, agentMessage]);
			setIsAgentTyping(false); // 입력중 표시 끝
		}, 1500);
	};

	// 간단한 응답 로직 (실제로는 서버 통신)
	const getAutoReply = (msg: string) => {
		if (msg.includes('취소')) return '취소 수수료는 숙소 규정에 따라 다릅니다. 예약 상세 페이지를 확인해주세요.';
		if (msg.includes('시간')) return '기본 체크인은 15:00, 체크아웃은 11:00 입니다.';
		return '네, 확인 후 안내해 드리겠습니다. 잠시만 기다려 주세요.';
	};

	return (
		<div className="chat-modal-overlay">
			<div className="chat-window-wrapper">
				<header className="chat-header">
					<div className="agent-info">
						<AgentAvatar />
						<div className="text-info">
							<h3>고객행복센터</h3>
							<span className="status-badge">● 상담 가능</span>
						</div>
					</div>
					{/* ★ 닫기 버튼에 onClose 연결 */}
					<button className="close-btn" onClick={onClose}>
						<CloseIcon />
					</button>
				</header>

				{/* ... (이하 내용은 기존 ChatWindow와 완전히 동일) ... */}
				<div className="chat-messages">
					<div className="date-divider">
						<span>오늘</span>
					</div>
					{messages.map((msg) => (
						<div key={msg.id} className={`message-bubble ${msg.sender}`}>
							{msg.sender === 'agent' && (
								<div className="avatar-small">
									<AgentAvatar />
								</div>
							)}
							<div className="bubble-content">
								<p>{msg.text}</p>
								<span className="time">{msg.timestamp}</span>
							</div>
						</div>
					))}
					{isAgentTyping && (
						<div className="message-bubble agent typing">
							<div className="avatar-small">
								<AgentAvatar />
							</div>
							<div className="bubble-content typing-indicator">
								<span></span>
								<span></span>
								<span></span>
							</div>
						</div>
					)}
					<div ref={messagesEndRef} />
				</div>

				<footer className="chat-input-area">
					<input
						type="text"
						placeholder="메시지를 입력해주세요..."
						value={inputText}
						onChange={(e) => setInputText(e.target.value)}
						onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
					/>
					<button className="send-btn" onClick={() => handleSendMessage(inputText)} disabled={!inputText.trim()}>
						<SendIcon />
					</button>
				</footer>
			</div>
		</div>
	);
};

export default ChatWindow;
