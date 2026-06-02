import React, { useEffect } from 'react';
import { Box, IconButton, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useState } from 'react';

interface ReviewImageModalProps {
	open: boolean;
	onClose: () => void;
	images: string[];
	reviewImgIndex?: number;
}

const ReviewImageModal: React.FC<ReviewImageModalProps> = ({ open, onClose, images, reviewImgIndex = 0 }) => {
	const [currentIndex, setCurrentIndex] = useState(reviewImgIndex);

	useEffect(() => {
		if (open) setCurrentIndex(reviewImgIndex);
	}, [open, reviewImgIndex]);

	useEffect(() => {
		if (!open) return;
		const handler = (e: KeyboardEvent) => {
			if (e.key === 'ArrowLeft') setCurrentIndex((p) => (p === 0 ? images.length - 1 : p - 1));
			if (e.key === 'ArrowRight') setCurrentIndex((p) => (p === images.length - 1 ? 0 : p + 1));
			if (e.key === 'Escape') onClose();
		};
		window.addEventListener('keydown', handler);
		return () => window.removeEventListener('keydown', handler);
	}, [open, images?.length]);

	if (!images?.length) return null;
	const active = images[currentIndex];

	return (
		<Modal open={open} onClose={onClose} closeAfterTransition>
			<Box className="igm-backdrop" onClick={onClose}>
				<Box className="igm" onClick={(e) => e.stopPropagation()}>
					{/* 헤더 */}
					<Box className="igm__header" style={{ gridTemplateColumns: '48px 1fr' }}>
						<IconButton className="igm__close" onClick={onClose}>
							<CloseIcon />
						</IconButton>
						<Box className="igm__title" style={{ textAlign: 'left' }}>
							리뷰 사진
						</Box>
					</Box>

					{/* 메인 이미지 */}
					<Box className="igm__main">
						<IconButton
							className="igm__nav igm__nav--left"
							onClick={() => setCurrentIndex((p) => (p === 0 ? images.length - 1 : p - 1))}
						>
							<ChevronLeftIcon />
						</IconButton>
						<Box className="igm__img-wrap">
							<img src={`${process.env.REACT_APP_API_URL}/${active}`} alt="" />
						</Box>
						<IconButton
							className="igm__nav igm__nav--right"
							onClick={() => setCurrentIndex((p) => (p === images.length - 1 ? 0 : p + 1))}
						>
							<ChevronRightIcon />
						</IconButton>
						<Box className="igm__counter">
							{currentIndex + 1} / {images.length}
						</Box>
					</Box>

					{/* 썸네일 */}
					<Box className="igm__thumbs-bar">
						<Box className="igm__thumbs">
							{images.map((img, idx) => (
								<button
									key={idx}
									className={`igm__thumb ${idx === currentIndex ? 'igm__thumb--active' : ''}`}
									onClick={() => setCurrentIndex(idx)}
								>
									<img src={`${process.env.REACT_APP_API_URL}/${img}`} alt="" />
								</button>
							))}
						</Box>
					</Box>
				</Box>
			</Box>
		</Modal>
	);
};

export default ReviewImageModal;
