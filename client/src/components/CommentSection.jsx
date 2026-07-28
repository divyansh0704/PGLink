import { useEffect, useState } from "react";
import { MessageCircle, Send, Trash2, Pencil, X } from "lucide-react";
import { toast } from "react-toastify";
import API from "../utils/api";
import "../styles/commentSection.css";

const CommentSection = ({ pgId }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/comments/pg/${pgId}`);
      setComments(response.data);
    } catch (error) {
      toast.error("Could not load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [pgId]);

  const handlePostComment = async (event) => {
    event.preventDefault();

    if (!currentUser) {
      toast.info("Please log in to write a comment.");
      return;
    }

    if (!content.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }

    try {
      setIsPosting(true);

      const response = await API.post(`/comments/pg/${pgId}`, {
        content: content.trim(),
      });

      const newComment = {
        ...response.data.comment,
        User: {
          id: currentUser.id,
          name: currentUser.name,
        },
      };

      setComments((previousComments) => [
        newComment,
        ...previousComments,
      ]);

      setContent("");
      toast.success("Comment posted successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not post comment");
    } finally {
      setIsPosting(false);
    }
  };

  const handleSaveEdit = async (commentId) => {
    if (!editContent.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }

    try {
      const response = await API.put(`/comments/${commentId}`, {
        content: editContent.trim(),
      });

      setComments((previousComments) =>
        previousComments.map((comment) =>
          comment.id === commentId ? response.data.comment : comment
        )
      );

      setEditingId(null);
      setEditContent("");
      toast.success("Comment updated successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update comment");
    }
  };

  const handleDelete = async (commentId) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this comment?"
    );

    if (!shouldDelete) return;

    try {
      await API.delete(`/comments/${commentId}`);

      setComments((previousComments) =>
        previousComments.filter((comment) => comment.id !== commentId)
      );

      toast.success("Comment deleted successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete comment");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="comment-section">
      <div className="comment-heading">
        <div>
          <h2>
            <MessageCircle size={23} />
            Comments
          </h2>
          <p>Share your experience or ask a question about this PG.</p>
        </div>

        <span className="comment-count">
          {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
        </span>
      </div>

      <form className="comment-form" onSubmit={handlePostComment}>
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder={
            currentUser
              ? "Write your comment here..."
              : "Log in to write a comment..."
          }
          maxLength={1000}
          disabled={!currentUser || isPosting}
        />

        <div className="comment-form-footer">
          <span>{content.length}/1000</span>

          <button
            type="submit"
            className="post-comment-btn"
            disabled={!currentUser || isPosting || !content.trim()}
          >
            <Send size={17} />
            {isPosting ? "Posting..." : "Post Comment"}
          </button>
        </div>
      </form>

      <div className="comment-list">
        {loading ? (
          <p className="comment-status">Loading comments...</p>
        ) : comments.length === 0 ? (
          <div className="no-comments">
            <MessageCircle size={28} />
            <p>No comments yet. Be the first to share your experience.</p>
          </div>
        ) : (
          comments.map((comment) => {
            const isOwner = currentUser?.id === comment.userId;
            const canDelete = isOwner || currentUser?.role === "admin";

            return (
              <article className="comment-card" key={comment.id}>
                <div className="comment-avatar">
                  {(comment.User?.name || "U").charAt(0).toUpperCase()}
                </div>

                <div className="comment-content">
                  <div className="comment-meta">
                    <div>
                      <h4>{comment.User?.name || "PGLink User"}</h4>
                      <span>{formatDate(comment.createdAt)}</span>
                    </div>

                    {isOwner && editingId !== comment.id && (
                      <button
                        className="comment-icon-btn"
                        onClick={() => {
                          setEditingId(comment.id);
                          setEditContent(comment.content);
                        }}
                        title="Edit comment"
                      >
                        <Pencil size={16} />
                      </button>
                    )}

                    {canDelete && (
                      <button
                        className="comment-icon-btn delete-comment-btn"
                        onClick={() => handleDelete(comment.id)}
                        title="Delete comment"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  {editingId === comment.id ? (
                    <div className="edit-comment-box">
                      <textarea
                        value={editContent}
                        onChange={(event) => setEditContent(event.target.value)}
                        maxLength={1000}
                      />

                      <div className="edit-comment-actions">
                        <button
                          className="cancel-edit-btn"
                          onClick={() => {
                            setEditingId(null);
                            setEditContent("");
                          }}
                        >
                          <X size={16} />
                          Cancel
                        </button>

                        <button
                          className="save-edit-btn"
                          onClick={() => handleSaveEdit(comment.id)}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="comment-text">{comment.content}</p>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
};

export default CommentSection;