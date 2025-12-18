// src/pages/UserProfile.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import PixelStar from '../components/PixelStar';
import '../styles/UserProfile.css';

// Avatar imports
import avatar1 from "../assets/1.png";
import avatar2 from "../assets/2.png";
import avatar3 from "../assets/3.png";
import avatar4 from "../assets/4.png";
import avatar5 from "../assets/5.png";

const apiBase = import.meta.env.VITE_API_BASE || '/backend';

export default function UserProfile() {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { openModal } = useModal();

  const isOwnProfile = user && String(user.id) === String(id);

  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [productNames, setProductNames] = useState({});

  // Avatar selection
  const avatarMap = [avatar1, avatar2, avatar3, avatar4, avatar5];
  const avatar = avatarMap[id % 5];

  // Fetch User Reviews
  useEffect(() => {
    async function fetchUserReviews() {
      try {
        const res = await fetch(`${apiBase}/marketplace/reviews.php?user_id=${id}`);
        if (res.ok) {
          const data = await res.json();
          setReviews(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to fetch user reviews", err);
      } finally {
        setLoadingReviews(false);
      }
    }
    fetchUserReviews();
  }, [id]);

  // Fetch products to map names
  useEffect(() => {
    async function fetchAllMarketplaceInfo() {
      try {
        const [nestlyRes, whiskRes] = await Promise.all([
          fetch(`${apiBase}/nestly/listings/get.php`),
          fetch(`${apiBase}/whisk/menu/get.php`)
        ]);

        const nameMap = {};

        if (nestlyRes.ok) {
          const nestlyData = await nestlyRes.json();
          if (Array.isArray(nestlyData)) {
            nestlyData.forEach((p) => (nameMap[p.id] = p.name));
          }
        }

        if (whiskRes.ok) {
          const whiskData = await whiskRes.json();
          if (Array.isArray(whiskData)) {
            whiskData.forEach((p) => (nameMap[p.id] = p.name));
          }
        }

        setProductNames(nameMap);
      } catch (err) {
        console.error("Failed to fetch product name map", err);
      }
    }
    fetchAllMarketplaceInfo();
  }, []);

  // Delete Account: opens modal
  const handleDeleteAccount = () => {
    openModal({
      title: "Delete Account?",
      message:
        "This will permanently erase your profile, reviews, and village history.\nThis cannot be undone!",
      showCancel: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`${apiBase}/marketplace/users/delete.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          });

          if (res.ok) {
            openModal({
              title: "Goodbye, traveler!",
              message: "Your data has been erased from the village.",
            });
            logout();
            navigate("/");
          } else {
            openModal({
              title: "Error",
              message: "Failed to delete account. Please contact the village elder.",
            });
          }
        } catch (err) {
          console.error(err);
          openModal({
            title: "Error",
            message: "An unexpected error occurred during deletion.",
          });
        }
      },
    });
  };

  return (
    <div className="user-profile-container">

      {/* HEADER CARD WITH AVATAR */}
      <div className="pixel-card profile-header-card">
        <div className="profile-header-flex">
          <img 
            src={avatar} 
            alt="Villager avatar" 
            className="profile-avatar"
          />

          <div className="profile-info-section">
            <h1 className="profile-title">
              {isOwnProfile ? "My Profile" : "User Profile"}
            </h1>

            <div className="profile-info">
              <p>
                <strong>Name:</strong>{" "}
                {isOwnProfile ? user.name : "Citizen " + id}
              </p>
              <p>
                <strong>Status:</strong> Active Resident
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* GRID LAYOUT */}
      <div className="profile-grid">

        {/* LEFT: User Stats + Reviews */}
        <div className="pixel-card stats-card">
          <h3>My Community Activity</h3>

          <div className="stat-item">
            <span className="stat-label">Reviews Written:</span>
            <span className="stat-value">{reviews.length}</span>
          </div>

          <div className="user-reviews-list">
            {loadingReviews ? (
              <p>Loading your contributions...</p>
            ) : reviews.length > 0 ? (
              reviews.map((rev) => {
                const company = rev.company === "nestly" ? "nestly" : "whisk";
                const detailPath = `/${company}/${rev.product_id}`;

                return (
                  <div key={rev.id} className="user-review-item">
                    <div className="user-review-meta">
                      <Link to={detailPath} className="user-review-product-link">
                        Product: {productNames[rev.product_id] || rev.product_id}
                      </Link>

                      <div className="user-review-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <PixelStar
                            key={star}
                            filled={star <= rev.rating}
                            size={14}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="user-review-comment">"{rev.comment}"</p>
                    <span className="user-review-date">
                      {new Date(rev.created_at).toLocaleDateString()}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="no-data">
                No reviews written yet. Visit the shops to share your thoughts!
              </p>
            )}
          </div>
        </div>

        {/* RIGHT: Account Actions */}
        <div className="pixel-card actions-card">
          <h3>Village Actions</h3>

          <div className="action-links">
            <Link to="/" className="pixel-btn">
              Browse Marketplace
            </Link>

            {isOwnProfile && (
              <button
                onClick={handleDeleteAccount}
                className="pixel-btn delete-btn"
                style={{
                  marginTop: "auto",
                  backgroundColor: "#8b0000",
                }}
              >
                Delete My Data & Account
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
