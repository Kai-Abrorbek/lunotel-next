import React, { useEffect, useRef, useState } from 'react';
import { Reservation } from '../../../types/reservation/reservation';
import { CommentInput } from '../../../types/comment/comment.input';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../../sweetAlert';
import { getJwtToken } from '../../../auth';
import axios from 'axios';
import { useMutation } from '@apollo/client';
import { CREATE_COMMENT } from '../../../../apollo/user/mutation';

interface ReviewPageProps {
	isOpen: boolean;
	setIsOpen: (v: boolean) => void;
	reservation: Reservation;
	initialInput: CommentInput;
}

const ReviewPage = ({ isOpen, setIsOpen, reservation, initialInput }: ReviewPageProps) => {
	const [reviewData, setReviewData] = useState<CommentInput>(initialInput);
	const [hoverRating, setHoverRating] = useState<{ [key: string]: number }>({});
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [previewImg, setPreviewImg] = useState<string[]>([]);
	const [commentImgfiles, setcommentImgfiles] = useState<File[]>([]);
	const token = getJwtToken();

	const [createComment] = useMutation(CREATE_COMMENT);

	useEffect(() => {
		if (reservation._id) {
			setReviewData({
				...reviewData,
				commentRefId: reservation.propertyData?.[0]._id!,
				commentTargetId: reservation._id,
			});
		}
	}, [reservation]);

	const doDisabledCheck = () => {
		if (reviewData.commentContent === '' || reviewData.commentRating === 0 || commentImgfiles.length === 0) {
			return true;
		}
	};

	const handleRatingClick = (category: keyof CommentInput, rating: number) => {
		setReviewData({ ...reviewData, [category]: rating });
	};

	const handleRatingHover = (category: string, rating: number) => {
		setHoverRating({ ...hoverRating, [category]: rating });
	};

	const handleRatingLeave = (category: string) => {
		const newHoverRating = { ...hoverRating };
		delete newHoverRating[category];
		setHoverRating(newHoverRating);
	};

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files) {
			const newImages: string[] = [];
			Array.from(files).forEach((file) => {
				const reader = new FileReader();
				reader.onloadend = () => {
					newImages.push(reader.result as string);
					if (newImages.length === files.length) {
						setcommentImgfiles([...commentImgfiles, ...Array.from(files)]);
						setPreviewImg([...previewImg, ...newImages]);
					}
				};
				reader.readAsDataURL(file);
			});
		}
	};

	const removeImage = (index: number) => {
		const newImages = previewImg.filter((_, i) => i !== index);
		const result = commentImgfiles.filter((_, i) => i !== index);
		setPreviewImg(newImages);
		setcommentImgfiles(result);
	};

	const triggerFileInput = () => {
		fileInputRef.current?.click();
	};

	const handleSubmit = async () => {
		try {
			const formData = new FormData();
			const selectedFiles = commentImgfiles;
			if (selectedFiles?.length === 0) return false;
			if (selectedFiles!.length > 5) throw new Error('Cannot upload more than 5 images!');

			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImagesUploader($files: [Upload!]!, $target: String!) {
						imagesUploader(files: $files, target: $target)
				}`,
					variables: {
						files: [null, null, null, null, null],
						target: 'comments',
					},
				}),
			);
			formData.append(
				'map',
				JSON.stringify({
					'0': ['variables.files.0'],
					'1': ['variables.files.1'],
					'2': ['variables.files.2'],
					'3': ['variables.files.3'],
					'4': ['variables.files.4'],
				}),
			);
			for (const key in selectedFiles) {
				if (/^\d+$/.test(key)) formData.append(`${key}`, selectedFiles[key]);
			}

			const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			const responseImages = response.data.data.imagesUploader;
			const next = { ...reviewData, commentImages: responseImages };
			setReviewData(next);
			await createComment({ variables: { input: next } });
			await sweetTopSmallSuccessAlert('댓글이 만들어졌습니다!');
			handleClose();
		} catch (err: any) {
			console.log('err: ', err.message);
			await sweetMixinErrorAlert(err.message);
		}
	};

	const handleClose = () => {
		setIsOpen(false);
		setReviewData({ ...initialInput });
		setPreviewImg([]);
		setcommentImgfiles([]);
	};
	// const addTag = (type: 'pros' | 'cons', tag: string) => {
	// 	if (tag && !reviewData[type].includes(tag)) {
	// 		setReviewData({ ...reviewData, [type]: [...reviewData[type], tag] });
	// 	}
	// };

	// const removeTag = (type: 'pros' | 'cons', tag: string) => {
	// 	setReviewData({ ...reviewData, [type]: reviewData[type].filter((t) => t !== tag) });
	// };

	const handleOverlayClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			setIsOpen(false);
		}
	};

	const renderStars = (category: keyof CommentInput, categoryName: string) => {
		const rating = reviewData[category] as number;
		const hover = hoverRating[categoryName] || 0;

		return (
			<div className="star-rating">
				{[1, 2, 3, 4, 5].map((star) => (
					<span
						key={star}
						className={`star ${star <= (hover || rating) ? 'filled' : ''}`}
						onClick={() => handleRatingClick(category, star)}
						onMouseEnter={() => handleRatingHover(categoryName, star)}
						onMouseLeave={() => handleRatingLeave(categoryName)}
					>
						★
					</span>
				))}
				<span className="rating-text">{rating > 0 ? rating.toFixed(1) : '평가하기'}</span>
			</div>
		);
	};

	const recommendedTags = {
		pros: [
			'깨끗해요',
			'친절해요',
			'조용해요',
			'위치가 좋아요',
			'가성비 좋아요',
			'시설이 좋아요',
			'침구가 편해요',
			'조식이 맛있어요',
		],
		cons: [
			'소음이 있어요',
			'청결하지 않아요',
			'시설이 낡았어요',
			'위치가 불편해요',
			'서비스가 아쉬워요',
			'냄새가 나요',
			'주차가 불편해요',
		],
	};

	return (
		<div className={`review-page ${isOpen ? 'active' : ''}`}>
			<div className="modal-overlay" onClick={handleOverlayClick}>
				<div className="modal">
					<div className="modal-header">
						<div className="modal-title">숙소 이용 후기 작성</div>
						<button className="close-btn" onClick={() => setIsOpen(false)}>
							✕
						</button>
					</div>

					<div className="modal-body">
						<div className="booking-info-card">
							<img
								className="booking-image"
								src={`${process.env.REACT_APP_API_URL}/${reservation?.propertyData?.[0].propertyImages[0]}`}
								alt=""
							/>
							<div className="booking-details">
								<div className="property-name">{reservation.propertyData?.[0].propertyName}</div>
								<div className="booking-detail-row">
									<span className="detail-label">체크인</span>
									<span>{reservation.reservationCheckIn}</span>
								</div>
								<div className="booking-detail-row">
									<span className="detail-label">체크아웃</span>
									<span>{reservation.reservationCheckOut}</span>
								</div>
								<div className="booking-detail-row">
									<span className="detail-label">객실</span>
									<span>
										{'객실스탠다드 더블'} · {reservation.priceBreakdown.length}박
									</span>
								</div>
							</div>
						</div>

						<div className="section">
							<div className="section-title">
								전체 평점 <span className="required">*</span>
							</div>
							<div className="overall-rating-section">
								<div className="overall-rating-label">숙소는 어떠셨나요?</div>
								<div className="overall-stars">
									{[1, 2, 3, 4, 5].map((star) => (
										<span
											key={star}
											className={`star ${star <= (hoverRating['overall'] || reviewData.commentRating) ? 'filled' : ''}`}
											onClick={() => handleRatingClick('commentRating', star)}
											onMouseEnter={() => handleRatingHover('overall', star)}
											onMouseLeave={() => handleRatingLeave('overall')}
										>
											★
										</span>
									))}
								</div>
								{reviewData.commentRating > 0 && (
									<div className="overall-rating-value">{reviewData.commentRating.toFixed(1)}</div>
								)}
							</div>
						</div>

						{/* <div className="section">
							<div className="section-title">세부 평가</div>
							<div className="detailed-ratings">
								<div className="rating-row">
									<span className="rating-label">청결도</span>
									{renderStars('cleanlinessRating', 'cleanliness')}
								</div>
								<div className="rating-row">
									<span className="rating-label">서비스</span>
									{renderStars('serviceRating', 'service')}
								</div>
								<div className="rating-row">
									<span className="rating-label">시설</span>
									{renderStars('facilityRating', 'facility')}
								</div>
								<div className="rating-row">
									<span className="rating-label">위치</span>
									{renderStars('locationRating', 'location')}
								</div>
							</div>
						</div>

						<div className="section">
							<div className="section-title">이용 정보</div>
							<div className="form-group">
								<label className="form-label">방문 목적</label>
								<select
									className="form-select"
									value={reviewData.visitPurpose}
									onChange={(e) => setReviewData({ ...reviewData, visitPurpose: e.target.value })}
								>
									<option value="">선택해주세요</option>
									<option value="business">비즈니스</option>
									<option value="leisure">여행</option>
									<option value="family">가족여행</option>
									<option value="couple">커플여행</option>
									<option value="friends">친구여행</option>
								</select>
							</div>
						</div>

						<div className="section">
							<div className="section-title">😊 좋았던 점</div>
							<div className="tags-section">
								<div className="tags-container">
									{recommendedTags.pros.map((tag) => (
										<div
											key={tag}
											className={`tag ${reviewData.pros.includes(tag) ? 'selected' : ''}`}
											onClick={() => (reviewData.pros.includes(tag) ? removeTag('pros', tag) : addTag('pros', tag))}
										>
											{tag}
										</div>
									))}
								</div>
								{reviewData.pros.length > 0 && (
									<div className="selected-tags">
										{reviewData.pros.map((tag) => (
											<div key={tag} className="selected-tag">
												{tag}
												<span className="remove-tag" onClick={() => removeTag('pros', tag)}>
													✕
												</span>
											</div>
										))}
									</div>
								)}
							</div>
						</div>

						<div className="section">
							<div className="section-title">😕 아쉬웠던 점</div>
							<div className="tags-section">
								<div className="tags-container">
									{recommendedTags.cons.map((tag) => (
										<div
											key={tag}
											className={`tag ${reviewData.cons.includes(tag) ? 'selected' : ''}`}
											onClick={() => (reviewData.cons.includes(tag) ? removeTag('cons', tag) : addTag('cons', tag))}
										>
											{tag}
										</div>
									))}
								</div>
								{reviewData.cons.length > 0 && (
									<div className="selected-tags">
										{reviewData.cons.map((tag) => (
											<div key={tag} className="selected-tag cons">
												{tag}
												<span className="remove-tag" onClick={() => removeTag('cons', tag)}>
													✕
												</span>
											</div>
										))}
									</div>
								)}
							</div>
						</div> */}

						<div className="section">
							<div className="section-title">
								상세 리뷰 <span className="required">*</span>
							</div>
							{/* <div className="form-group">
								<label className="form-label">리뷰 제목</label>
								<input
									type="text"
									className="form-input"
									placeholder="리뷰 제목을 입력해주세요"
									value={reviewData.commentContent}
									onChange={(e) => setReviewData({ ...reviewData, commentContent: e.target.value })}
									maxLength={50}
								/>
								<div className="char-count">{reviewData.commentContent.length}/50</div>
							</div> */}
							<div className="form-group">
								<label className="form-label">리뷰 내용</label>
								<textarea
									className="form-textarea"
									placeholder="숙소 이용 경험을 자세히 공유해주세요."
									value={reviewData.commentContent}
									onChange={(e) => setReviewData({ ...reviewData, commentContent: e.target.value })}
									maxLength={1000}
								/>
								<div className="char-count">{reviewData.commentContent.length}/1000</div>
								<div className="helper-text">※ 욕설, 비방, 허위 내용이 포함된 리뷰는 삭제될 수 있습니다.</div>
							</div>
						</div>

						<div className="section">
							<div className="section-title">📷 사진 첨부 (선택)</div>
							<div className="image-upload-section">
								{previewImg.length < 10 && (
									<div className="upload-area" onClick={triggerFileInput}>
										<div className="upload-icon">📤</div>
										<div className="upload-text">사진을 업로드해주세요</div>
										<div className="upload-hint">최대 10장까지 업로드 가능</div>
									</div>
								)}
								<input
									ref={fileInputRef}
									type="file"
									accept="image/*"
									multiple
									style={{ display: 'none' }}
									onChange={handleImageUpload}
								/>
								{previewImg.length > 0 && (
									<div className="image-preview-grid">
										{previewImg.map((img, index) => (
											<div key={index} className="image-preview">
												<img src={img} alt={`preview ${index + 1}`} className="preview-image" />
												<button className="remove-image" onClick={() => removeImage(index)}>
													✕
												</button>
											</div>
										))}
									</div>
								)}
							</div>
						</div>
					</div>

					<div className="modal-footer">
						<button className="btn btn-cancel" onClick={() => setIsOpen(false)}>
							취소
						</button>
						<button
							className={`btn btn-submit ${!doDisabledCheck() ? 'active' : ''}`}
							onClick={() => handleSubmit()}
							disabled={doDisabledCheck()}
						>
							리뷰 등록하기
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

ReviewPage.defaultProps = {
	initialInput: {
		commentRefId: '',
		commentTargetId: '',
		commentGroup: 'PROPERTY',
		commentRating: 0,
		commentContent: '',
		commentImages: [],
	},
};
export default ReviewPage;
