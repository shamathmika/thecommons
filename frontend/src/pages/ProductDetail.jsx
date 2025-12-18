// src/pages/ProductDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import PixelStar from '../components/PixelStar';
import PixelTrash from '../components/PixelTrash';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import '../styles/ProductDetail.css';

const apiBase = import.meta.env.VITE_API_BASE || '/backend';

export default function ProductDetail() {
  const { id } = useParams(); // e.g. "N1", "W5"
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromMarketplace = location.state?.fromMarketplace;
  const { openModal } = useModal();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Review Form State
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  const [topProducts, setTopProducts] = useState([]);
  const [loadingTop, setLoadingTop] = useState(false);
  const [showTop5, setShowTop5] = useState(false);

  // Determine Type & Action based on ID
  const isNestly = id?.startsWith('N');
  const isWhisk = id?.startsWith('W');
  const isPetsit = id?.startsWith('P');

  const companyName = isNestly
    ? 'NESTLY'
    : isWhisk
    ? 'WHISK'
    : isPetsit
    ? 'PETSITHUB'
    : 'MARKETPLACE';

  const companyCode = isNestly
    ? 'nestly'
    : isWhisk
    ? 'whisk'
    : isPetsit
    ? 'petsit'
    : 'petsit';

  const actionLabel = isWhisk ? 'Buy Now' : 'Book Now';

  // Simple mapping for “contact to proceed” text (replace with real URLs)
  const companyContactUrl =
    companyCode === 'nestly'
      ? 'https://shamathmikacmpe272.app'
      : companyCode === 'whisk'
      ? 'https://wendynttn.com'
      : 'https://http://anandita-prakash.infinityfreeapp.com/';

  // Back Link Logic
  const backLink = fromMarketplace
    ? '/marketplace'
    : isNestly
    ? '/nestly'
    : isWhisk
    ? '/whisk'
    : isPetsit
    ? '/petsit'
    : '/';

  const backText = fromMarketplace
    ? '← Back to Marketplace'
    : isNestly
    ? '← Back to Listings'
    : isWhisk
    ? '← Back to Menu'
    : isPetsit
    ? '← Back to Services'
    : '← Back to Village';

  const fetchTopProducts = async () => {
    if (showTop5) {
      setShowTop5(false);
      return;
    }

    setLoadingTop(true);
    setShowTop5(true);
    try {
      const endpoint = isNestly
        ? `${apiBase}/nestly/listings/top.php`
        : isWhisk
        ? `${apiBase}/whisk/menu/top.php`
        : `${apiBase}/petsit/services/top.php`;

      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        setTopProducts(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to fetch top products', err);
    } finally {
      setLoadingTop(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      try {
        setLoading(true);
        let endpoint = '';
        if (isNestly) endpoint = `${apiBase}/nestly/listings/get.php`;
        else if (isWhisk) endpoint = `${apiBase}/whisk/menu/get.php`;
        else if (isPetsit) endpoint = `${apiBase}/petsit/services/get.php`;
        else endpoint = `${apiBase}/marketplace/products/top.php`; // Fallback

        const res = await fetch(endpoint);
        if (!res.ok) throw new Error('Failed to fetch details');

        const data = await res.json();
        let found = null;

        if (Array.isArray(data)) {
          found = data.find((p) => p.id === id);
        } else if (data.top) {
          found = data.top.find((p) => p.id === id);
        }

        if (found) {
          setProduct(found);
        } else {
          setError('Product not found in the village.');
        }
      } catch (err) {
        console.error(err);
        setError('Could not load product details.');
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id, isNestly, isWhisk, isPetsit]);

  // Visit tracking
  useEffect(() => {
    if (!id || !product) return;

    const trackVisit = async () => {
      const visitedKey = `visited_${id}`;
      if (sessionStorage.getItem(visitedKey)) return;

      try {
        const res = await fetch(`${apiBase}/marketplace/tracking.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product_id: id,
            company: companyCode,
            user_id: user ? user.id : null,
          }),
        });

        if (res.ok) {
          sessionStorage.setItem(visitedKey, 'true');
          setProduct((prev) =>
            prev ? { ...prev, visits: (prev.visits || 0) + 1 } : prev
          );
        }
      } catch (e) {
        console.error('Tracking error', e);
      }
    };

    trackVisit();
  }, [id, product?.id, companyCode, user]);

  // 3. Fetch Reviews
  async function fetchReviews() {
    try {
      const res = await fetch(
        `${apiBase}/marketplace/reviews.php?product_id=${encodeURIComponent(
          id
        )}`
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setReviews(data);
        }
      }
    } catch (e) {
      console.error('Failed to load reviews', e);
    }
  }

  useEffect(() => {
    if (id) fetchReviews();
  }, [id]);

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) return;
    if (!user) return navigate('/login');

    setSubmittingReview(true);
    try {
      const payload = {
        product_id: id,
        company: companyCode,
        user_id: user.id || 0,
        rating: reviewRating,
        comment: reviewText,
      };

      const res = await fetch(`${apiBase}/marketplace/reviews.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const refreshRes = await fetch(
          `${apiBase}/marketplace/reviews.php?product_id=${encodeURIComponent(
            id
          )}`
        );
        if (refreshRes.ok) {
          const data = await refreshRes.json();
          setReviews(data);
        }
        setReviewText('');
        setReviewRating(5);
        openModal({
          title: 'Success!',
          message: 'Your review has been submitted.\nThank you!',
        });
      } else {
        openModal({
          title: 'Error',
          message: 'Failed to submit review. Please try again.',
        });
      }
    } catch (e) {
      console.error(e);
      openModal({
        title: 'Error',
        message: 'Error submitting review. Please try again.',
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReviewConfirmed = async (reviewId) => {
    try {
      const res = await fetch(
        `${apiBase}/marketplace/reviews.php?id=${reviewId}&action=delete`,
        { method: 'POST' }
      );
      if (res.ok) {
        fetchReviews();
      } else {
        openModal({
          title: 'Error',
          message: 'Failed to delete review. Please try again.',
        });
      }
    } catch (err) {
      console.error(err);
      openModal({
        title: 'Error',
        message: 'Error deleting review. Please try again.',
      });
    }
  };

  const handleDeleteReview = (reviewId) => {
    openModal({
      title: 'Delete review?',
      message: 'Are you sure you want to delete this review?',
      showCancel: true,
      onConfirm: () => handleDeleteReviewConfirmed(reviewId),
    });
  };

  if (loading)
    return (
      <div className="product-detail-container">
        <div className="pixel-card">
          <p>Loading pixel data...</p>
        </div>
      </div>
    );

  if (error || !product)
    return (
      <div className="product-detail-container">
        <div className="pixel-card">
          <p style={{ color: 'red' }}>{error}</p>
          <Link to="/" className="pixel-btn">
            Return to Village
          </Link>
        </div>
      </div>
    );

  const priceDisplay = product.price
    ? `$${product.price.toLocaleString()}${isNestly ? '/mo' : ''}`
    : 'Contact Us';

  return (
    <div className="product-detail-container">
      {/* LEFT COLUMN: Product Details */}
      <div className="product-info-card">
        <div className="pd-header">
          <h1 className="pd-title">{product.name}</h1>
          <span className={`pd-company-tag tag-${companyCode}`}>
            {companyName}
          </span>
        </div>

        {product.image && (
          <div className="pd-image-wrapper">
            <img src={product.image} alt={product.name} className="pd-image" />
          </div>
        )}

        <div className="pd-meta-row">
          <div className="pd-price">{priceDisplay}</div>
          <div className="pd-rating">
            <span style={{ marginRight: '8px' }}>
              {Number(product.rating || 0).toFixed(1)}
            </span>
            <PixelStar />
          </div>
        </div>

        <div className="pd-description">
          <p>
            {product.description ||
              'No description available for this item.'}
          </p>
          <p>
            <strong>Visits:</strong> {product.visits}
          </p>
        </div>

        <button
          className="pixel-btn pd-action-btn"
          onClick={() =>
            openModal({
              title: `${actionLabel} coming soon!`,
              message: `This action will be completed on the original ${companyName} website.\n\nFor now, contact ${companyName} to proceed:\n${companyContactUrl}`,
            })
          }
        >
          {actionLabel}
        </button>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginTop: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          <Link
            to={backLink}
            className="pixel-btn"
            style={{ backgroundColor: 'var(--wood-dark)', fontSize: '0.9rem' }}
          >
            {backText}
          </Link>
          <Link
            to={`${backLink}?filter=top`}
            className="pixel-btn"
            style={{ fontSize: '0.9rem' }}
            onClick={fetchTopProducts}
          >
            View Top 5 {isNestly ? 'Listings' : isWhisk ? 'Menu Items' : 'Services'}
          </Link>
        </div>
      </div>

      {/* RIGHT COLUMN: Reviews */}
      <div className="reviews-card">
        <h3 className="reviews-header">Community Reviews</h3>

        {/* Add Review Box */}
        <div className="add-review-box">
          {user ? (
            <div>
              <p>
                <strong>Leave a Review</strong>
              </p>

              {/* Simple Star Selector */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '5px',
                  marginBottom: '10px',
                }}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <div
                    key={star}
                    onClick={() => setReviewRating(star)}
                    style={{
                      cursor: 'pointer',
                      opacity: star <= reviewRating ? 1 : 0.3,
                    }}
                  >
                    <PixelStar />
                  </div>
                ))}
              </div>

              <textarea
                className="pixel-input"
                placeholder="Write your thoughts..."
                rows="3"
                style={{ marginBottom: '1rem', resize: 'vertical' }}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
              <button
                className="pixel-btn"
                style={{ width: '100%' }}
                onClick={handleSubmitReview}
                disabled={submittingReview}
              >
                {submittingReview ? 'Sending...' : 'Submit Review'}
              </button>
            </div>
          ) : (
            <p className="login-prompt">
              Want to leave a review?
              <br />
              <span
                className="login-link"
                onClick={() => navigate('/login')}
              >
                Log In
              </span>
            </p>
          )}
        </div>

        <div className="review-list">
          {reviews.length === 0 && (
            <p
              style={{
                fontStyle: 'italic',
                opacity: 0.7,
                textAlign: 'center',
              }}
            >
              No reviews yet. Be the first!
            </p>
          )}

          {reviews.map((review) => (
            <div key={review.id} className="review-item">
              <div
                className="review-header"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="review-author">
                    {review.author_name || 'Anonymous Citizen'}
                  </span>
                  <span className="review-date">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>

                {user && String(user.id) === String(review.user_id) && (
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="delete-review-btn"
                    title="Delete this review"
                  >
                    <PixelTrash size={18} />
                  </button>
                )}
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '2px',
                  marginBottom: '0.5rem',
                  marginTop: '0.25rem',
                }}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <PixelStar
                    key={star}
                    size={16}
                    filled={star <= review.rating}
                  />
                ))}
              </div>
              <p className="review-text">"{review.comment}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
