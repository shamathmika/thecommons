// src/pages/ProductDetail.jsx
import React, { useEffect, useState } from 'react';
import PixelStar from '../components/PixelStar';

import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/ProductDetail.css';

const apiBase = import.meta.env.VITE_API_BASE || '/backend';

export default function ProductDetail() {
  const { id } = useParams(); // e.g. "N1", "W5"
  const { user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Review Form State
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  // Determine Type & Action based on ID
  const isNestly = id?.startsWith('N');
  const isWhisk = id?.startsWith('W');
  const companyName = isNestly ? 'NESTLY' : isWhisk ? 'WHISK' : 'MARKETPLACE';
  const companyCode = isNestly ? 'nestly' : isWhisk ? 'whisk' : 'petsit';
  const actionLabel = isNestly ? 'Book Now' : 'Buy Now';
  
  // Back Link Logic
  const backLink = isNestly ? '/nestly' : isWhisk ? '/whisk' : '/';
  const backText = isNestly ? '← Back to Listings' : isWhisk ? '← Back to Menu' : '← Back to Village';

  useEffect(() => {
    if (!id) return;
    
    // 1. Track Visit (Industry Standard: Unique per session/cookie)
    const trackVisit = async () => {
      // Check if already visited this session
      const visitedKey = `visited_${id}`;
      const hasVisited = sessionStorage.getItem(visitedKey); // Simple session storage check

      if (hasVisited) return; 

      try {
        const res = await fetch(`${apiBase}/marketplace/tracking.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product_id: id,
            company: companyCode,
            user_id: user ? user.id : null
          })
        });

        if (res.ok) {
           // Mark as visited
           sessionStorage.setItem(visitedKey, 'true');
           
           // Optimistically update visit count in UI if product is loaded
           setProduct(prev => prev ? ({...prev, visits: (prev.visits || 0) + 1}) : prev);
        }
      } catch (e) {
        console.error("Tracking failed", e);
      }
    };
    if (product) {
       // Only track once product is identified/loaded to avoid ghost tracking
       trackVisit();
    }

    // 2. Fetch Product Details
    async function fetchProduct() {
      try {
        setLoading(true);
        let endpoint = '';
        if (isNestly) endpoint = `${apiBase}/nestly/listings/get.php`;
        else if (isWhisk) endpoint = `${apiBase}/whisk/menu/get.php`;
        else endpoint = `${apiBase}/marketplace/products/top.php`; // Fallback

        const res = await fetch(endpoint);
        if (!res.ok) throw new Error('Failed to fetch details');
        
        const data = await res.json();
        let found = null;
        
        if (Array.isArray(data)) {
            found = data.find(p => p.id === id);
        } else if (data.top) { 
            found = data.top.find(p => p.id === id);
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
  }, [id, isNestly, isWhisk]);

  // Separate effect for tracking to wait for product load and avoid double-firing
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
              user_id: user ? user.id : null
            })
        });
        if (res.ok) {
            sessionStorage.setItem(visitedKey, 'true');
            setProduct(prev => ({...prev, visits: (prev.visits || 0) + 1}));
        }
      } catch (e) {
         console.error("Tracking error", e);
      }
    };
    trackVisit();
  }, [id, product?.id]); // Only run when product ID is confirmed loaded

    // 3. Fetch Reviews
    async function fetchReviews() {
      try {
        const res = await fetch(`${apiBase}/marketplace/reviews.php?product_id=${encodeURIComponent(id)}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setReviews(data);
          }
        }
      } catch (e) {
        console.error("Failed to load reviews", e);
      }
    }


    useEffect(() => {
        fetchReviews();
    }, [id]);

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) return;
    if (!user) return navigate('/login');

    setSubmittingReview(true);
    try {
      const payload = {
        product_id: id,
        company: companyCode,
        user_id: user.id || 0, // Fallback if id missing
        rating: reviewRating,
        comment: reviewText
      };

      const res = await fetch(`${apiBase}/marketplace/reviews.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        // Refresh reviews
        const refreshRes = await fetch(`${apiBase}/marketplace/reviews.php?product_id=${encodeURIComponent(id)}`);
        if (refreshRes.ok) {
           const data = await refreshRes.json();
           setReviews(data);
        }
        setReviewText('');
        setReviewRating(5);
        alert('Review submitted!');
      } else {
        alert('Failed to submit review');
      }
    } catch (e) {
      console.error(e);
      alert('Error submitting review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return (
    <div className="product-detail-container">
       <div className="pixel-card"><p>Loading pixel data...</p></div>
    </div>
  );

  if (error || !product) return (
    <div className="product-detail-container">
       <div className="pixel-card">
         <p style={{color:'red'}}>{error}</p>
         <Link to="/" className="pixel-btn">Return to Village</Link>
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
              {/* Show stars based on rating */}
              <span style={{marginRight: '8px'}}>{Number(product.rating || 0).toFixed(1)}</span>
              <PixelStar />
           </div>
        </div>

        <div className="pd-description">
           <p>{product.description || "No description available for this item."}</p>
           <p><strong>Visits:</strong> {product.visits}</p>
        </div>

        <button className="pixel-btn pd-action-btn" onClick={() => alert(`${actionLabel} functionality coming soon!`)}>
           {actionLabel}
        </button>
        
        <Link to={backLink} style={{display:'block', textAlign:'center', marginTop:'1rem', color: 'var(--wood-light)'}}>
          {backText}
        </Link>
      </div>

      {/* RIGHT COLUMN: Reviews */}
      <div className="reviews-card">
         <h3 className="reviews-header">Community Reviews</h3>
         
         {/* Add Review Box */}
         <div className="add-review-box">
            {user ? (
               <div>
                  <p><strong>Leave a Review</strong></p>
                  
                  {/* Simple Star Selector */}
                  <div style={{display:'flex', justifyContent:'center', gap:'5px', marginBottom:'10px'}}>
                    {[1,2,3,4,5].map(star => (
                      <div key={star} onClick={() => setReviewRating(star)} style={{cursor:'pointer', opacity: star <= reviewRating ? 1 : 0.3}}>
                        <PixelStar />
                      </div>
                    ))}
                  </div>

                  <textarea 
                    className="pixel-input" 
                    placeholder="Write your thoughts..." 
                    rows="3" 
                    style={{marginBottom:'1rem', resize:'vertical'}} 
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  />
                  <button className="pixel-btn" style={{width:'100%'}} onClick={handleSubmitReview} disabled={submittingReview}>
                    {submittingReview ? 'Sending...' : 'Submit Review'}
                  </button>
               </div>
            ) : (
               <p className="login-prompt">
                  Want to leave a review?<br/>
                  <span className="login-link" onClick={() => navigate('/login')}>Log In</span>
               </p>
            )}
         </div>

         <div className="review-list">
            {reviews.length === 0 && <p style={{fontStyle:'italic', opacity:0.7, textAlign:'center'}}>No reviews yet. Be the first!</p>}
            
            {reviews.map(review => (
               <div key={review.id} className="review-item">
                  <span className="review-author">{review.author_name || 'Anonymous Citizen'}</span>
                  {/* Format Date if possible, or just show raw */}
                  <span className="review-date">{new Date(review.created_at).toLocaleDateString()}</span>
                  <div style={{display:'flex', gap:'2px', marginBottom:'0.5rem'}}>
                     {[1,2,3,4,5].map(star => (
                        <PixelStar key={star} size={16} filled={star <= review.rating} />
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
