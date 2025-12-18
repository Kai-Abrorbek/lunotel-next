// ImageGalleryModal.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Box, IconButton, Tabs, Tab, Typography, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export type ImageCategory = 'ALL' | 'ROOM';

interface ImageGalleryModalProps {
	open: boolean;
	onClose: () => void;
	title: string; // 숙소 이름
	images: string[];
	initialIndex?: number;
}

const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({ open, onClose, title, images, initialIndex = 1 }) => {
	const [tab, setTab] = useState<ImageCategory>('ALL');
	const [currentIndex, setCurrentIndex] = useState(initialIndex);

	// const filteredImages = useMemo(() => {
	// 	if (tab === 'ALL') return images;
	// 	// return images.filter((img) => img.category === 'ROOM');
	// }, [images, tab]);

	// 모달 열릴 때 index 초기화
	useEffect(() => {
		if (open) setCurrentIndex(initialIndex);
	}, [open, initialIndex]);

	const handlePrev = () => {
		setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
	};

	const handleNext = () => {
		setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
	};

	const handleThumbClick = (idx: number) => {
		setCurrentIndex(idx);
	};

	if (!images?.length) return null;
	const active = images[currentIndex];

	return (
		<Modal
			aria-labelledby="spring-modal-title"
			aria-describedby="spring-modal-description"
			open={open}
			onClose={onClose}
			closeAfterTransition
		>
			<Box className="image-modal">
				{/* 상단 헤더 */}
				<Box className="image-modal-header">
					<IconButton onClick={onClose} className="image-modal-close">
						<CloseIcon />
					</IconButton>

					<Tabs value={tab} onChange={(_, v) => setTab(v)} className="image-modal-tabs">
						<Tab label="전체" value="ALL" />
						<Tab label="객실" value="ROOM" />
					</Tabs>

					<p className="image-modal-title">{title}</p>
				</Box>

				{/* 가운데 큰 이미지 영역 */}
				<Box className="image-modal-main">
					<IconButton className="image-modal-nav image-modal-nav--left" onClick={handlePrev}>
						<ChevronLeftIcon />
					</IconButton>

					<Box className="image-modal-main-img-wrap">
						<img src={`${process.env.REACT_APP_API_URL}/${active}`} alt={active} />
					</Box>

					<IconButton className="image-modal-nav image-modal-nav--right" onClick={handleNext}>
						<ChevronRightIcon />
					</IconButton>
				</Box>

				{/* 하단 썸네일 바 */}
				<Box className="image-modal-thumbs-bar">
					<Box className="image-modal-thumbs">
						{images?.map((img, idx) => (
							<button
								key={img}
								className={idx === currentIndex ? 'image-modal-thumb image-modal-thumb--active' : 'image-modal-thumb'}
								onClick={() => handleThumbClick(idx)}
							>
								<img src={`${process.env.REACT_APP_API_URL}/${img}`} alt={img} />
							</button>
						))}
					</Box>
					<Box className="image-modal-counter">
						대표 사진 {currentIndex + 1} / {images?.length}
					</Box>
				</Box>
			</Box>
		</Modal>
	);
};

export default ImageGalleryModal;
