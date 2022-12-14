import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import ReaderModeCollection from './collection';
import * as userValidator from '../user/middleware';
import * as readerModeValidator from './middleware';
// Import * as util from './util';

const router = express.Router();

/**
 * Get the current user's readerMode
 *
 * @name GET /api/readerMode
 *
 * @return {string} - a success message
 * @throws {403} - if the user is not logged in
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const readerMode = await ReaderModeCollection.findOneByUserId(req.session.userId);
    res.status(200).json(readerMode);
  }
);

/**
 * Enter readerMode
 *
 * @name PUT /api/readerMode/enter
 *
 * @return {string} - a success message
 * @throws {403} - if the user is not logged in
 */
router.put(
  '/enter',
  [
    userValidator.isUserLoggedIn
    // UserValidator.isUserExists_paramsVersion,
  ],
  async (req: Request, res: Response) => {
    const readerMode = await ReaderModeCollection.enterReaderMode(req.session.userId);
    res.status(200).json({
      message: 'Your have successfully entered Reader Mode (a safe browsing mode). Public-facing actions are disabled.'
    });
  }
);

/**
 * Exit readerMode
 *
 * @name PUT /api/readerMode/exit
 *
 * @return {string} - a success message
 * @throws {403} - if the user is not logged in
 */
router.put(
  '/exit',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const readerMode = await ReaderModeCollection.exitReaderMode(req.session.userId);
    res.status(200).json({
      message: 'Your have now exited Reader Mode, and have returned to the default browsing mode.'
    });
  }
);

// /**
//  * Get the current user's readerMode
//  *
//  * @name GET /api/readerMode
//  *
//  * @return {string} - a success message
//  * @throws {403} - if the user is not logged in
//  */
// router.get(
//   '/',
//   [
//     userValidator.isUserLoggedIn
//   ],
//   async (req: Request, res: Response) => {
//     const readerMode = await ReaderModeCollection.findOneByUserId(req.params.userId);
//     res.status(200).json(readerMode);
//   }
// );

export {router as readerModeRouter};
