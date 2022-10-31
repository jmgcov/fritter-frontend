import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import BookmarkCollection from '../bookmark/collection';

// TODO - WHAT IS THE STATUS?  REMOVE THE CONSOLE.LOGS?  OR STILL BROKEN?
/**
 * Checks if a bookmark with bookmarkId is req.params exists
 */
const isBookmarkExists = async (req: Request, res: Response, next: NextFunction) => {
  console.log('here.');
  console.log('rec body bookmarkid', req.params.bookmarkId);
  const validFormat = Types.ObjectId.isValid(req.params.bookmarkId);
  console.log('validFormat', validFormat);
  const bookmark = validFormat ? await BookmarkCollection.findOne(req.params.bookmarkId) : '';
  if (!bookmark) {
    res.status(404).json({
      error: {
        bookmarkNotFound: `Bookmark with bookmark ID ${req.params.bookmarkId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the owner of the bookmark whose bookmarkId is in req.params
 */
const isValidBookmarkModifier = async (req: Request, res: Response, next: NextFunction) => {
  const bookmark = await BookmarkCollection.findOne(req.params.bookmarkId);
  const userId = bookmark.user;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' bookmarks.'
    });
    return;
  }

  next();
};

export {
  isBookmarkExists,
  isValidBookmarkModifier
};

// TODO
// CHECK FOR DUPLICATES, HTTP 409 IF CONFLICT
// ALSO NEED TO CHECK THAT FREET EXISTS, AND MAKE SURE THE BEHAVIOR IS CORRECT WHEN USER DELETES A
// FREET WHICH IS PREVIOUSLY BOOKMARKED
