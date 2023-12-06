import { Router, Request, Response } from 'express';
import { Comment, Photo } from '../db';
import { Op } from 'sequelize';
const HomeRoutes = Router();

HomeRoutes.get('/posts', async (req: Request, res: Response) => {
  try {
    const comments = await Comment.findAll();
    const photos = await Photo.findAll({where: {[Op.and]: [{isCostume: false}, {isThrow: false}]}});
    const posts = {comments, photos};
    res.status(200)
      .send(posts);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

HomeRoutes.get('/costumes', async (req: Request, res: Response) => {
  try {
    const costumes = await Photo.findAll({where: {isCostume: true}});
    res.status(200)
      .send(costumes);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

HomeRoutes.get('/throws', async (req: Request, res: Response) => {
  try {
    const throws = await Photo.findAll({where: {isThrow: true}});
    res.status(200)
      .send(throws);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

HomeRoutes.post('/:ownerId', async (req: Request, res: Response) => {
  const { ownerId } = req.params;
  const { comment } = req.body;
  try {
    const post = await Comment.create({ ownerId, comment })
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

export default HomeRoutes;