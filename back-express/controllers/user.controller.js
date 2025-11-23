import * as UserRepo from "../repositories/user.repo.js";

import bcrypt from "bcryptjs";

export const list = async (req, res, next) => {
  try {
    const users = await UserRepo.list();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const user = await UserRepo.getById(req.params.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const { username, password, role } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await UserRepo.create({
      username,
      passwordHash,
      role
    });

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const user = await UserRepo.update(req.params.id, req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    await UserRepo.remove(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
