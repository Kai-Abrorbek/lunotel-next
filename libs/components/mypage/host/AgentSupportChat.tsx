import { useReactiveVar } from '@apollo/client';
import { Circle, MessageSquare, Send } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { userVar } from '../../../../apollo/store';
import { getJwtToken } from '../../../auth';

type Message = {
	event: 'message';
	roomId: string;
	text: string;
	from: 'AGENT' | 'USER' | 'GUEST';
	memberData?: { memberNick?: string; memberImage?: string; _id?: string };
	at: number;
};

interface Room {
	roomId: string; // "support:<userId>"
	lastMessage: string;
	lastAt: number;
	onlineCount: number;
	user: {
		memberImage?: string;
		memberNick?: string;
		_id: string;
	} | null;
}

interface OnlineUser {
	_id: string;
	memberNick: string;
	memberImage?: string;
}

type Incoming =
	| { event: 'getMessages'; roomId: string; list: Message[] }
	| Message
	| { event: 'onlineUsers'; roomId: string; totalClients: number; users: OnlineUser[]; at: number }
	| { event: 'roomUpsert'; room: Room }; // ✅ adminLobby

const AdminSupportChat = () => {
	const [rooms, setRooms] = useState<Room[]>([]);
	const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
	const [inputText, setInputText] = useState('');
	const [wsStatus, setWsStatus] = useState<'offline' | 'connecting' | 'online'>('offline');

	const roomWsRef = useRef<WebSocket | null>(null);
	const lobbyWsRef = useRef<WebSocket | null>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const user = useReactiveVar(userVar);
	const token = getJwtToken();

	const lobbyWsUrl = useMemo(() => {
		if (!token) return '';
		return `${process.env.REACT_APP_API_WS}?token=${token}&roomId=adminLobby`;
	}, [token]);

	useEffect(() => {
		if (!token) return;
		fetchRooms();
		connectAdminLobby();

		return () => {
			lobbyWsRef.current?.close();
			roomWsRef.current?.close();
		};
	}, [token]);

	const fetchRooms = async () => {
		try {
			const res = await fetch(`${process.env.REACT_APP_API_URL}/admin/support/rooms`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			const data = await res.json();
			console.log(data);
			setRooms(data);
		} catch (e) {
			console.error('Failed to fetch rooms:', e);
			setRooms([]);
		}
	};

	const connectAdminLobby = () => {
		if (!lobbyWsUrl) return;

		const ws = new WebSocket(lobbyWsUrl);
		lobbyWsRef.current = ws;

		ws.onopen = () => {};
		ws.onerror = () => {};
		ws.onclose = () => {};

		ws.onmessage = (e) => {
			const data: Incoming = JSON.parse(e.data);

			if (data.event === 'roomUpsert') {
				const room = data.room;
				setRooms((prev) => {
					const exists = prev.find((r) => r.roomId === room.roomId);
					const next = exists ? prev.map((r) => (r.roomId === room.roomId ? { ...r, ...room } : r)) : [room, ...prev];

					next.sort((a, b) => (b.lastAt ?? 0) - (a.lastAt ?? 0));
					return next;
				});
			}
		};
	};

	const handleRoomSelect = async (roomId: string) => {
		if (selectedRoomId === roomId) return;

		roomWsRef.current?.close();
		setSelectedRoomId(roomId);

		setMessages([]);
		setOnlineUsers([]);
		setWsStatus('connecting');

		try {
			const res = await fetch(
				`${process.env.REACT_APP_API_URL}/admin/support/messages?roomId=${encodeURIComponent(roomId)}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				},
			);
			const list = await res.json();
			setMessages(list);
		} catch (e) {
			console.error('Failed to fetch messages:', e);
			setMessages([]);
		}

		connectToRoom(roomId);
	};

	const connectToRoom = (roomId: string) => {
		if (!token) return;

		const ws = new WebSocket(`${process.env.REACT_APP_API_WS}?token=${token}&roomId=${encodeURIComponent(roomId)}`);
		roomWsRef.current = ws;

		ws.onopen = () => setWsStatus('online');
		ws.onclose = () => setWsStatus('offline');
		ws.onerror = () => setWsStatus('offline');

		ws.onmessage = (event) => {
			const data: Incoming = JSON.parse(event.data);

			if (data.event === 'message') {
				setMessages((prev) => [...prev, data]);
				return;
			}

			if (data.event === 'onlineUsers') {
				const uniq = Array.from(new Map(data.users.map((u) => [u._id, u])).values());
				console.log(uniq);
				setOnlineUsers(uniq);
			}
		};
	};

	const handleSendMessage = () => {
		const text = inputText.trim();
		if (!text || !selectedRoomId) return;

		const ws = roomWsRef.current;
		if (!ws || ws.readyState !== WebSocket.OPEN) return;

		ws.send(JSON.stringify({ event: 'message', data: { text } }));
		setInputText('');
	};

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	const formatTime = (ts: number) => new Date(ts).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

	const formatRelativeTime = (ts: number) => {
		if (!ts) return '';
		const diff = Date.now() - ts;
		const minutes = Math.floor(diff / 60000);
		if (minutes < 1) return '방금 전';
		if (minutes < 60) return `${minutes}분 전`;
		const hours = Math.floor(minutes / 60);
		if (hours < 24) return `${hours}시간 전`;
		return `${Math.floor(hours / 24)}일 전`;
	};

	return (
		<div className="chat-container">
			{/* Left Panel - Room List */}
			<div className="chat-rooms-panel">
				<div className="chat-panel-header">
					<h3>문의 방 목록</h3>
					<span className="room-count">{rooms.length}</span>
				</div>

				<div className="chat-rooms-list">
					{rooms.map((room) => (
						<div
							key={room.roomId}
							className={`chat-room-item ${selectedRoomId === room.roomId ? 'active' : ''}`}
							onClick={() => handleRoomSelect(room.roomId)}
						>
							<div className="room-item-main">
								<div className="room-item-header">
									<span className="room-id">{room.user?.memberNick ?? room.roomId.slice(0, 10)}</span>
									<span className="room-time">{formatRelativeTime(room.lastAt)}</span>
								</div>
								<p className="room-last-message">{room.lastMessage || '(메시지 없음)'}</p>
							</div>
							{room.onlineCount > 0 && <div className="room-online-badge">{room.onlineCount}</div>}
						</div>
					))}
				</div>
			</div>

			{/* Center Panel - Chat Messages */}
			<div className="chat-messages-panel">
				{selectedRoomId ? (
					<>
						<div className="chat-messages-header">
							<div className="chat-header-info">
								<h3>{selectedRoomId.slice(0, 10)}</h3>
								<div className="ws-status">
									<Circle
										size={8}
										fill={wsStatus === 'online' ? '#10b981' : wsStatus === 'connecting' ? '#f59e0b' : '#ef4444'}
										color={wsStatus === 'online' ? '#10b981' : wsStatus === 'connecting' ? '#f59e0b' : '#ef4444'}
									/>
									<span>
										{wsStatus === 'online' ? '연결됨' : wsStatus === 'connecting' ? '연결 중...' : '오프라인'}
									</span>
								</div>
							</div>
						</div>

						<div className="chat-messages-content">
							{messages.map((msg) => (
								<div
									key={`${msg.roomId}-${msg.at}`}
									className={`chat-message ${msg.from === 'AGENT' ? 'admin' : 'user'}`}
								>
									{msg.from === 'USER' && msg.memberData && (
										<div className="message-avatar user-avatar">{msg.memberData?.memberNick!.charAt(0)}</div>
									)}
									<div className="message-content">
										{msg.from !== 'AGENT' && (
											<div className="message-sender">{msg.memberData?.memberNick ?? 'User'}</div>
										)}
										<div className="message-bubble">
											<p>{msg.text}</p>
											<span className="message-time">{formatTime(msg.at)}</span>
										</div>
									</div>
									{msg.from === 'AGENT' && (
										<div className="message-avatar admin-avatar">{msg.memberData?.memberNick!.charAt(0)}</div>
									)}
								</div>
							))}
							<div ref={messagesEndRef} />
						</div>

						<div className="chat-input-container">
							<input
								type="text"
								className="chat-input"
								placeholder="메시지를 입력하세요..."
								value={inputText}
								onChange={(e) => setInputText(e.target.value)}
								onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
							/>
							<button className="chat-send-btn" onClick={handleSendMessage}>
								<Send size={20} />
							</button>
						</div>
					</>
				) : (
					<div className="chat-empty-state">
						<MessageSquare size={64} color="#cbd5e1" />
						<p>방을 선택해주세요</p>
					</div>
				)}
			</div>

			{/* Right Panel - Online Users */}
			<div className="chat-users-panel">
				<div className="chat-panel-header">
					<h3>접속 중인 유저</h3>
					<span className="user-count">{onlineUsers.length}</span>
				</div>

				<div className="chat-users-list">
					{onlineUsers.length > 0 ? (
						onlineUsers.map((u) => (
							<div key={u._id} className="online-user-item">
								<div className="online-user-avatar">{(u.memberNick ?? 'U').charAt(0)}</div>
								<div className="online-user-info">
									<div className="online-user-name">{u.memberNick ?? 'User'}</div>
									<div className="online-user-email">{u._id}</div>
								</div>
								<div className="online-indicator"></div>
							</div>
						))
					) : (
						<div className="no-users-state">
							<p>접속 중인 유저가 없습니다</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default AdminSupportChat;
