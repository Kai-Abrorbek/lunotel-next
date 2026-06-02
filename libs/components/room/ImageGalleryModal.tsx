// ImageGalleryModal.tsx
import React, { useEffect, useState } from 'react';
import { Box, IconButton, Tabs, Tab, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export type ImageCategory = 'ALL' | 'ROOM';

interface ImageGalleryModalProps {
	open: boolean;
	onClose: () => void;
	title: string;
	images: string[];
	initialIndex?: number;
}

const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({ open, onClose, title, images, initialIndex = 0 }) => {
	const [tab, setTab] = useState<ImageCategory>('ALL');
	const [currentIndex, setCurrentIndex] = useState(initialIndex);

	useEffect(() => {
		if (open) setCurrentIndex(initialIndex);
	}, [open, initialIndex]);

	useEffect(() => {
		if (!open) return;
		const handler = (e: KeyboardEvent) => {
			if (e.key === 'ArrowLeft') handlePrev();
			if (e.key === 'ArrowRight') handleNext();
			if (e.key === 'Escape') onClose();
		};
		window.addEventListener('keydown', handler);
		return () => window.removeEventListener('keydown', handler);
	}, [open, currentIndex, images?.length]);

	const handlePrev = () => setCurrentIndex((p) => (p === 0 ? images.length - 1 : p - 1));
	const handleNext = () => setCurrentIndex((p) => (p === images.length - 1 ? 0 : p + 1));

	if (!images?.length) return null;
	const active = images[currentIndex];

	return (
		<Modal open={open} onClose={onClose} closeAfterTransition>
			<Box className="igm-backdrop" onClick={onClose}>
				<Box className="igm" onClick={(e) => e.stopPropagation()}>
					{/* 헤더 */}
					<Box className="igm__header">
						<IconButton className="igm__close" onClick={onClose}>
							<CloseIcon />
						</IconButton>
						<Tabs value={tab} onChange={(_, v) => setTab(v)} className="igm__tabs">
							<Tab label="전체" value="ALL" />
							<Tab label="객실" value="ROOM" />
						</Tabs>
						<Box className="igm__title">{title}</Box>
					</Box>

					{/* 메인 이미지 */}
					<Box className="igm__main">
						<IconButton className="igm__nav igm__nav--left" onClick={handlePrev}>
							<ChevronLeftIcon />
						</IconButton>
						<Box className="igm__img-wrap">
							<img src={`${process.env.REACT_APP_API_URL}/${active}`} alt="" />
						</Box>
						<IconButton className="igm__nav igm__nav--right" onClick={handleNext}>
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

export default ImageGalleryModal;
