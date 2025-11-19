import { Box, Typography, Button, Stack } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

export default function Footer() {
	return (
		<Stack className="container">
			<Box className="footer-container">
				{/* 고객센터 */}
				<Box className="footer-section">
					<Typography className="footer-title">고객센터</Typography>

					<Typography className="footer-sub">
						고객행복센터(전화): 오전 9시 ~ 새벽 3시 운영 <br />
						채팅 상담 문의: 24시간 운영
					</Typography>

					<Box className="footer-btns">
						<Button className="footer-call-btn">
							<PhoneIcon className="footer-btn-icon" />
							1670-6250
						</Button>

						<Button className="footer-chat-btn">
							<ChatBubbleOutlineIcon className="footer-btn-icon" />
							채팅 상담
						</Button>
					</Box>
				</Box>

				{/* 회사 */}
				<Box className="footer-section">
					<Typography className="footer-title">회사</Typography>

					<Box className="footer-links">
						<div>회사소개</div>
					</Box>
				</Box>

				{/* 서비스 */}
				<Box className="footer-section">
					<Typography className="footer-title">서비스</Typography>

					<Box className="footer-links">
						<div>공지사항</div>
						<div>자주 묻는 질문</div>
						<div>기업 출장/복지 서비스 문의</div>
						<div>국내 여행매거진</div>
						<div>해외 여행매거진</div>
					</Box>
				</Box>

				{/* 혜택 */}
				<Box className="footer-section">
					<Typography className="footer-title">혜택</Typography>

					<Box className="footer-links">
						<div>엘리트 멤버십</div>
						<div>트립홀릭 혜택 안내</div>
						<div>여기어때 상품권 조회</div>
					</Box>
				</Box>

				{/* 모든 여행 */}
				<Box className="footer-section">
					<Typography className="footer-title">모든 여행</Typography>

					<Box className="footer-links">
						<div>국내숙소</div>
						<div>해외숙소</div>
						<div>패키지 여행</div>
						<div>항공</div>
						<div>항공+숙소</div>
						<div>레저·티켓</div>
						<div>렌터카</div>
						<div>공연대여</div>
					</Box>
				</Box>
			</Box>
		</Stack>
	);
}
