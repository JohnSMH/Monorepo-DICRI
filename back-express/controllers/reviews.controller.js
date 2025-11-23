import * as repo from "../repositories/review.repo.js";

// Create review
export async function createReview(req, res) {
  try {
    const review = await repo.createReview(req.body);
    res.json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

// Get all reviews
export async function getReviews(req, res) {
  try {
    const reviews = await repo.getReviews();
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

// Get review by ID
export async function getReviewById(req, res) {
  try {
    const review = await repo.getReviewById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Revisión no encontrada" });
    }

    res.json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

// Update review
export async function updateReview(req, res) {
  try {
    await repo.updateReview(req.params.id, req.body);
    res.json({ message: "Revisión actualizada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

// Delete review
export async function deleteReview(req, res) {
  try {
    await repo.deleteReview(req.params.id);
    res.json({ message: "Revisión eliminada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
