import React, { useState, useEffect } from "react";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import Swal from "sweetalert2";
import "../screens_CSS/Profile.css";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [news, setNews] = useState([]);
  const [newsForm, setNewsForm] = useState({
    title: "",
    description: "",
    image: null,
  });
  const [totalLikes, setTotalLikes] = useState(0);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingRemove, setLoadingRemove] = useState(null);

  useEffect(() => {
    const fetchUserNews = async () => {
      if (user) {
        const response = await fetch(
          `http://localhost:5000/api/news/user/${user.username}`
        );
        const data = await response.json();
        if (response.ok) {
          setNews(data);
          const totalLikes = data.reduce((sum, item) => sum + item.likes, 0);
          setTotalLikes(totalLikes);
        } else {
          console.error("Failed to fetch news:", data.message);
        }
      }
    };

    fetchUserNews();
  }, [user]);

  const handleInputChange = (e) => {
    setNewsForm({ ...newsForm, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setNewsForm({ ...newsForm, image: e.target.files[0] });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);

    const formData = new FormData();
    formData.append("title", newsForm.title);
    formData.append("description", newsForm.description);
    formData.append("image", newsForm.image);
    formData.append("username", user?.username);
    formData.append("domain", user?.domain);

    try {
      const response = await fetch("http://localhost:5000/api/news/create", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setLoadingSubmit(false);

      if (response.ok) {
        Swal.fire({
          title: "Success!",
          text: "News created successfully!",
          icon: "success",
        });

        setNewsForm({ title: "", description: "", image: null });

        // ✅ Use Cloudinary URL from API response
        setNews((prev) => [...prev, { ...data.news, image: data.news.image }]);

        setTotalLikes(totalLikes + data.news.likes);
      } else {
        Swal.fire({
          title: "Error!",
          text: data.message || "Something went wrong.",
          icon: "error",
        });
      }
    } catch (error) {
      setLoadingSubmit(false);
      Swal.fire({
        title: "Error!",
        text: "An unexpected error occurred.",
        icon: "error",
      });
    }
  };

  const handleRemoveNews = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoadingRemove(id);
        try {
          const response = await fetch(
            `http://localhost:5000/api/news/delete/${id}`,
            {
              method: "DELETE",
            }
          );
          const data = await response.json();

          setLoadingRemove(null);
          if (response.ok) {
            setNews(news.filter((item) => item._id !== id));
            setTotalLikes(totalLikes - data.likes);

            Swal.fire("Deleted!", "Your news has been deleted.", "success");
          } else {
            Swal.fire("Error!", data.message || "Failed to delete news.", "error");
          }
        } catch (error) {
          setLoadingRemove(null);
          Swal.fire("Error!", "An unexpected error occurred.", "error");
        }
      }
    });
  };

  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <h1>Profile</h1>
        {user ? (
          <div className="profile-box">
            <p>
              <strong>Name:</strong> {user.fullName}
            </p>
            <p>
              <strong>Username:</strong> {user.username}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Description:</strong> {user.description}
            </p>
            <p>
              <strong>Domain:</strong> {user.domain}
            </p>
            <p className="total_likes">
              <strong>Total Likes:</strong> {totalLikes}
            </p>
          </div>
        ) : (
          <p>No user information available. Please log in.</p>
        )}

        {/* News Form */}
        <div className="news-form-container">
          <h2>Add News</h2>
          <form onSubmit={handleFormSubmit} encType="multipart/form-data">
            <div className="form-group">
              <label htmlFor="image">News Image (PNG, JPG):</label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/png, image/jpeg"
                onChange={handleImageChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="title">News Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newsForm.title}
                onChange={handleInputChange}
                placeholder="Enter news title"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">News Description:</label>
              <textarea
                id="description"
                name="description"
                value={newsForm.description}
                onChange={handleInputChange}
                placeholder="Enter news description"
                maxLength="1000"
                required
              />
            </div>
            <button type="submit" className="submit-btn" disabled={loadingSubmit}>
              {loadingSubmit ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>

        {/* Display User's News */}
        <div className="news-container">
          <h2>Your News</h2>
          {news.length > 0 ? (
            <div className="news-boxes">
              {news.map((item) => (
                <div key={item._id} className="news-box">
                  <img src={item.image} alt={item.title} className="news-image" />

                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <p>
                    <strong>Likes:</strong> {item.likes}
                  </p>
                  <button
                    className="remove"
                    onClick={() => handleRemoveNews(item._id)}
                    disabled={loadingRemove === item._id}
                  >
                    {loadingRemove === item._id ? "Removing..." : "Remove"}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="no_news">No news available.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
