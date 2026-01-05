import { useEffect, useMemo, useRef, useState } from 'react';
import { getJwtToken } from '../../libs/auth';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import LayoutHome from '../../libs/components/layout/LayoutHome';

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
	memberData?: { memberNick?: string };
	at: number;
};

type Incoming =
	| { event: 'getMessages'; roomId: string; list: Message[] }
	| Message
	| { event: 'onlineUsers'; roomId: string; totalClients: number; users: OnlineUser[]; at: number };

const SupportChatUser = () => {
	const wsRef = useRef<WebSocket | null>(null);
	const user = useReactiveVar(userVar);
	// ✅ 너 프로젝트 값으로 교체
	const token = getJwtToken();
	const userId = user._id;

	const roomId = useMemo(() => `support:${userId}`, [userId]);
	const wsUrl = useMemo(() => `ws://localhost:3001?token=${token}&roomId=${roomId}`, [token, roomId]);
	const [status, setStatus] = useState<'connecting' | 'online' | 'offline'>('connecting');
	const [messages, setMessages] = useState<Message[]>([]);
	const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
	const [input, setInput] = useState('');

	useEffect(() => {
		if (!token || !userId) return;

		fetch(`${process.env.REACT_APP_API_URL}/admin/support/messages?roomId=support:${userId}`, {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => res.json())
			.then((list) => setMessages(list));
	}, [token, userId]);

	useEffect(() => {
		setStatus('connecting');

		const ws = new WebSocket(wsUrl);
		wsRef.current = ws;

		ws.onopen = () => setStatus('online');
		ws.onclose = () => setStatus('offline');
		ws.onerror = () => setStatus('offline');

		ws.onmessage = (e) => {
			const data: Incoming = JSON.parse(e.data);
			console.log(data);
			if (data.event === 'getMessages') setMessages(data.list);
			if (data.event === 'message') setMessages((prev) => [...prev, data]);
			if (data.event === 'onlineUsers') setOnlineUsers(data.users);
		};

		return () => ws.close();
	}, [wsUrl]);

	const sendMessage = () => {
		const text = input.trim();
		if (!text) return;
		if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

		wsRef.current.send(JSON.stringify({ event: 'message', data: { text } }));
		setInput('');
	};

	return (
		<div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 16, marginTop: '75px' }}>
			<div>
				<div style={{ marginBottom: 8 }}>
					상태: <b>{status}</b>
				</div>

				<ul style={{ border: '1px solid #ddd', padding: 12, minHeight: 260 }}>
					{messages.map((m, i) => (
						<li key={i} style={{ marginBottom: 6 }}>
							<b>{m.from}:</b> {m.text}
						</li>
					))}
				</ul>

				<div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
					<input
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
						style={{ flex: 1 }}
						placeholder="문의 내용을 입력하세요"
					/>
					<button onClick={sendMessage}>전송</button>
				</div>
			</div>

			<aside style={{ border: '1px solid #ddd', padding: 12 }}>
				<div style={{ marginBottom: 8 }}>
					이 방 접속 <b>{onlineUsers.length}</b>
				</div>
				<ul>
					{onlineUsers.map((u) => (
						<li key={u._id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
							<span style={{ width: 8, height: 8, borderRadius: 999, background: 'green' }} />
							{u.memberNick}
						</li>
					))}
				</ul>
			</aside>
		</div>
	);
};

export default LayoutHome(SupportChatUser);
