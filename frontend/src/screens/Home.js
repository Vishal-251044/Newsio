import React, { useEffect, useState } from "react";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import axios from "axios";
import { Card, Modal, Button, Spin } from "antd";
import Swal from "sweetalert2";
import "../screens_CSS/Home.css";

const Home = () => {
  const [news, setNews] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("https://newsio-backend.onrender.com/news");
        setNews(response.data);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const showModal = (item) => {
    setSelectedNews(item);
    setVisible(true);
  };

  const handleLike = async (item) => {
    if (!user) {
      Swal.fire({
        title: "Please Log In",
        text: "You need to log in to like this news.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    if (item.likedBy && item.likedBy.includes(user._id)) {
      Swal.fire({
        title: "Already Liked",
        text: "You have already liked this news.",
        icon: "info",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }

    try {
      const response = await axios.post(`https://newsio-backend.onrender.com/api/like`, {
        user: user._id,
        newsId: item._id,
      });

      if (response.data.success) {
        Swal.fire({
          title: "Liked!",
          text: "You have liked this news.",
          icon: "success",
          showConfirmButton: false,
          timer: 1000,
        });

        setNews((prevNews) =>
          prevNews.map((newsItem) =>
            newsItem._id === item._id
              ? {
                  ...newsItem,
                  likes: newsItem.likes + 1,
                  likedBy: [...(newsItem.likedBy || []), user._id],
                }
              : newsItem
          )
        );
      }
    } catch (error) {
      console.error("Error liking the news:", error.response?.data || error.message);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "There was an error liking this news.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const filterAndSortNews = () => {
    if (user) {
      const userDomain = user.domain; // Assuming the user's domain is stored in localStorage
      const matchedDomainNews = news.filter((item) => item.domain === userDomain);
      const otherNews = news.filter((item) => item.domain !== userDomain);

      // Sort news by createdAt date and time, latest first
      const sortedMatchedNews = matchedDomainNews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const sortedOtherNews = otherNews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return [...sortedMatchedNews, ...sortedOtherNews];
    } else {
      // If user is not logged in, return all news sorted by createdAt date and time
      return news.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  const filteredNews = filterAndSortNews();

  return (
    <div>
      <Navbar />
      {loading ? (
        <div className="spinner-container">
          <Spin size="large" />
        </div>
      ) : (
        <div className="news-container_home">
          {filteredNews.map((item) => (
            <Card
              key={item._id}
              className="news-card"
              onClick={() => showModal(item)}
              actions={[
                <Button
                  type="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(item);
                  }}
                  style={{
                    backgroundColor: user && item.likedBy?.includes(user._id) ? "green" : "",
                  }}
                >
                  {user && item.likedBy?.includes(user._id) ? "✔️ Liked" : "👍 Like"} ({item.likes})
                </Button>,
              ]}
            >
              <img src={`https://newsio-backend.onrender.com/${item.image}`} alt={item.title} />
              <h2>{item.title}</h2>
            </Card>
          ))}
        </div>
      )}

      <Modal
        title={selectedNews ? selectedNews.title : ""}
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button key="back" onClick={() => setVisible(false)}>
            Close
          </Button>,
        ]}
      >
        <p><b>Username: </b> {selectedNews?.username}</p>
        <p><b>Description: </b> {selectedNews?.description}</p>
        <p><b>Post Date: </b> {new Date(selectedNews?.createdAt).toLocaleString()}</p>
      </Modal>
      <Footer />
    </div>
  );
};

export default Home;
