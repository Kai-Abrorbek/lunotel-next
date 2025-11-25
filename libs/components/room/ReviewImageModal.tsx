// ImageGalleryModal.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Box, IconButton, Tabs, Tab, Typography, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export type ImageCategory = 'ALL' | 'ROOM';

export interface GalleryImage {
	id: number;
	src: string;
	alt: string;
	category?: ImageCategory; // 'ALL' or 'ROOM'
}

interface ImageGalleryModalProps {
	open: boolean;
	onClose: () => void;
	images: GalleryImage[];
	reviewImgIndex?: number;
}

const ReviewImageModal: React.FC<ImageGalleryModalProps> = ({ open, onClose, images, reviewImgIndex = 0 }) => {
	const [tab, setTab] = useState<ImageCategory>('ALL');
	const [currentIndex, setCurrentIndex] = useState(reviewImgIndex);

	const filteredImages = useMemo(() => {
		if (tab === 'ALL') return images;
		return images.filter((img) => img.category === 'ROOM');
	}, [images, tab]);

	// 모달 열릴 때 index 초기화
	useEffect(() => {
		if (open) setCurrentIndex(reviewImgIndex);
	}, [open, reviewImgIndex]);

	const handlePrev = () => {
		setCurrentIndex((prev) => (prev === 0 ? filteredImages.length - 1 : prev - 1));
	};

	const handleNext = () => {
		setCurrentIndex((prev) => (prev === filteredImages.length - 1 ? 0 : prev + 1));
	};

	const handleThumbClick = (idx: number) => {
		setCurrentIndex(idx);
	};

	if (!filteredImages.length) return null;
	const active = filteredImages[currentIndex];

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
				</Box>

				{/* 가운데 큰 이미지 영역 */}
				<Box className="image-modal-main">
					<IconButton className="image-modal-nav image-modal-nav--left" onClick={handlePrev}>
						<ChevronLeftIcon />
					</IconButton>

					<Box className="image-modal-main-img-wrap">
						<img src={active.src} alt={active.alt} />
					</Box>

					<IconButton className="image-modal-nav image-modal-nav--right" onClick={handleNext}>
						<ChevronRightIcon />
					</IconButton>
				</Box>

				{/* 하단 썸네일 바 */}
				<Box className="image-modal-thumbs-bar">
					<Box className="image-modal-thumbs">
						{filteredImages.map((img, idx) => (
							<button
								key={img.id}
								className={idx === currentIndex ? 'image-modal-thumb image-modal-thumb--active' : 'image-modal-thumb'}
								onClick={() => handleThumbClick(idx)}
							>
								<img src={img.src} alt={img.alt} />
							</button>
						))}
					</Box>
					<Box className="image-modal-counter">
						대표 사진 {currentIndex + 1} / {filteredImages.length}
					</Box>
				</Box>
			</Box>
		</Modal>
	);
};

export default ReviewImageModal;
