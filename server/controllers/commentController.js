const { Comment, PG, User } = require("../models");
const asyncHandler = require("../utils/asyncHandler");


exports.createComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { pgId } = req.params;

  if (!content || !content.trim()) {
    return res.status(400).json({ message: "Comment cannot be empty" });
  }

  const pg = await PG.findByPk(pgId);

  if (!pg) {
    return res.status(404).json({ message: "PG not found" });
  }

  const comment = await Comment.create({
    content: content.trim(),
    userId: req.user.id,
    pgId,
  });

  res.status(201).json({
    message: "Comment added successfully",
    comment,
  });
});


exports.getCommentsByPgId = asyncHandler(async (req, res) => {
  const { pgId } = req.params;

  const comments = await Comment.findAll({
    where: { pgId },
    include: [
      {
        model: User,
        attributes: ["id", "name"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json(comments);
});


exports.updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { id } = req.params;

  if (!content || !content.trim()) {
    return res.status(400).json({ message: "Comment cannot be empty" });
  }

  const comment = await Comment.findByPk(id);

  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }

  
  if (comment.userId !== req.user.id) {
    return res.status(403).json({
      message: "You can edit only your own comment",
    });
  }

  comment.content = content.trim();
  await comment.save();

  res.status(200).json({
    message: "Comment updated successfully",
    comment,
  });
});


exports.deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const comment = await Comment.findByPk(id);

  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }

  if (comment.userId !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({
      message: "You can delete only your own comment",
    });
  }

  await comment.destroy();

  res.status(200).json({
    message: "Comment deleted successfully",
  });
});