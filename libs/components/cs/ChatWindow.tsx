import { useReactiveVar } from '@apollo/client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getJwtToken } from '../../auth';
import { userVar } from '../../../apollo/store';

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
const UserAvatar = () => (
	<svg width="40" height="40" viewBox="0 0 24 24" fill="#f5f5f5" stroke="#6b7280" strokeWidth="1.5">
		<circle cx="12" cy="12" r="10" />
		<circle cx="12" cy="10" r="3" />
		<path d="M7 18c0-2.5 2.5-4 5-4s5 1.5 5 4" />
	</svg>
);

// 현재 시간 구하는 헬퍼 함수
const formatTime = (at: number) =>
	new Date(at).toLocaleTimeString('ko-KR', {
		hour: '2-digit',
		minute: '2-digit',
	});
interface ChatWindowProps {
	onClose: () => void;
}

type OnlineUser = {
	_id: string;
	memberNick: string;
	memberImage?: string;
};

type Message = {
	event: 'message';
	roomId: string;
	text: string;
	from: 'ADMIN' | 'USER' | 'AGENT';
	memberData?: { memberNick?: string; memberImage: string };
	at: number;
	timestamp: string;
};

type Incoming =
	| { event: 'getMessages'; roomId: string; list: Message[] }
	| Message
	| { event: 'onlineUsers'; roomId: string; totalClients: number; users: OnlineUser[]; at: number };

const ChatWindow: React.FC<ChatWindowProps> = ({ onClose }) => {
	const [isAgentTyping, setIsAgentTyping] = useState(false);
	const [status, setStatus] = useState<'connecting' | 'online' | 'offline'>('connecting');
	const [messages, setMessages] = useState<Message[]>([]);
	const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
	const [input, setInput] = useState('');

	const wsRef = useRef<WebSocket | null>(null);
	const user = useReactiveVar(userVar);
	const token = getJwtToken();
	const userId = user._id;
	const wsUrl = useMemo(() => {
		if (!token || !userId) return '';
		return `${process.env.REACT_APP_API_WS}?token=${token}&roomId=support:${userId}`;
	}, [token, userId]);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages, isAgentTyping]);

	useEffect(() => {
		if (!token || !userId) return;

		fetch(`${process.env.REACT_APP_API_URL}/admin/support/messages?roomId=support:${userId}`, {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => res.json())
			.then((list) => setMessages(list));
	}, [token, userId]);

	useEffect(() => {
		if (!wsUrl) return;
		setStatus('connecting');

		const ws = new WebSocket(wsUrl);
		wsRef.current = ws;

		ws.onopen = () => setStatus('online');
		ws.onclose = () => setStatus('offline');
		ws.onerror = () => setStatus('offline');

		ws.onmessage = (e) => {
			const data: Incoming = JSON.parse(e.data);
			console.log(data);
			if (data.event === 'getMessages') setMessages(data.list); // ✅ 여기서 "대화 내역" 불러옴
			if (data.event === 'message') setMessages((prev) => [...prev, data]);
			if (data.event === 'onlineUsers') setOnlineUsers(data.users);
		};

		return () => ws.close();
	}, [wsUrl]);

	// 메시지 전송 핸들러
	const sendMessage = () => {
		const text = input.trim();
		if (!text) return;
		if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

		wsRef.current.send(JSON.stringify({ event: 'message', data: { text } }));
		setInput('');
	};

	return (
		<div className="chat-modal-overlay">
			<div className="chat-window-wrapper">
				<header className="chat-header">
					<div className="agent-info">
						<AgentAvatar />
						<div className="text-info">
							<h3>고객행복센터</h3>
							{onlineUsers.length >= 2 && <span className="status-badge-possible">● 상담 가능</span>}
							{onlineUsers.length < 2 && <span className="status-badge-inbossible">● 상담 대기중</span>}
						</div>
					</div>
					<button className="close-btn" onClick={onClose}>
						<CloseIcon />
					</button>
				</header>

				<div className="chat-messages">
					<div className="date-divider">
						<span>오늘</span>
					</div>
					{messages.map((msg) => {
						console.log(msg);
						return (
							<div key={`${msg.roomId}-${msg.at}`} className={`message-bubble ${msg.from}`}>
								{msg.from === 'AGENT' && (
									<div className="avatar-small">
										<AgentAvatar />
									</div>
								)}
								{msg.from === 'USER' && (
									<div className="avatar-small">
										<UserAvatar />
									</div>
								)}
								<div className="bubble-content">
									<p>{msg.text}</p>
									<span className="time">{formatTime(msg.at)}</span>
								</div>
							</div>
						);
					})}
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
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
					/>
					<button className="send-btn" onClick={sendMessage} disabled={!input.trim()}>
						<SendIcon />
					</button>
				</footer>
			</div>
		</div>
	);
};

export default ChatWindow;
