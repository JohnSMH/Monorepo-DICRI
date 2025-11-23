import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as AuthRepo from "../repositories/auth.repo.js";

export const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await AuthRepo.getUserByUsername(username);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role
    }
  });
};

