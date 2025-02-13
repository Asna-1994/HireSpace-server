import { NextFunction, Request, Response } from 'express';
import { ConnectionRequestUseCase } from '../../../Application/usecases/connectionReqeust/connectionRequestUseCase';
import { ConnectionRequestImpl } from '../../../Domain/repository/implementation/ConnectionRequestRepoImpl';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { UserRepositoryImpl } from '../../../Domain/repository/implementation/userRepositoryImpl';

const connectionRequestUseCase = new ConnectionRequestUseCase(
  new ConnectionRequestImpl(),
  new UserRepositoryImpl()
);

//  create a connection request
export async function createConnectionRequest(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { fromUser, toUser } = req.body;
    const newRequest = await connectionRequestUseCase.createConnectionRequest(
      fromUser,
      toUser
    );
    res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: 'Connection request send',
      data: {
        newRequest,
      },
    });
  } catch (error) {
    next(error);
  }
}

// get conection request for user
export async function getAllConnectionRequestsForUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const { pendingRequests, totalRequests } =
      await connectionRequestUseCase.getConnectionRequestForUser(
        userId,
        page,
        limit
      );

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: MESSAGES.DATA_FETCHED,
      data: {
        pendingRequests,
        totalRequests,
        currentPage: page,
        totalPages: Math.ceil(totalRequests / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}

//request sent by user
export async function getAllConnectionRequestsSentByUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const { pendingRequests, totalRequests } =
      await connectionRequestUseCase.getConnectionRequestSentByUser(
        userId,
        page,
        limit
      );
    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: MESSAGES.DATA_FETCHED,
      data: {
        pendingRequests,
        totalRequests,
        currentPage: page,
        totalPages: Math.ceil(totalRequests / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}
// get a connection request by ID
export async function getConnectionRequestById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const request = await connectionRequestUseCase.getConnectionRequestById(id);

    if (!request) {
      res.status(404).json({ message: 'Connection request not found' });
      return;
    }

    res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: 'Connection request send',
      data: {
        request,
      },
    });
  } catch (error) {
    next(error);
  }
}

//getting all accepted connections
export async function getAllConnectionsByUserId(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || null;

    const { connections, total } =
      await connectionRequestUseCase.findAllConnections(
        userId,
        page,
        limit,
        search
      );
    const totalPages = Math.ceil(total / limit);

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: MESSAGES.DATA_FETCHED,
      data: {
        connections,
        total,
        totalPages,
        currentPage: page,
      },
    });
  } catch (error) {
    next(error);
  }
}

//get recommendations for user
export async function getRecommendationsForUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { users, total } =
      await connectionRequestUseCase.recommendationForUsers(
        userId,
        page,
        limit
      );

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: MESSAGES.DATA_FETCHED,
      data: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        recommendations: users,
        total,
      },
    });
  } catch (error) {
    next(error);
  }
}

//  accept a connection request
export async function acceptConnectionRequest(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const acceptedRequest =
      await connectionRequestUseCase.acceptConnectionRequest(id);
    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: 'Connection request accepted',
      data: {
        acceptedRequest,
      },
    });
  } catch (error) {
    next(error);
  }
}

// reject a connection request
export async function rejectConnectionRequest(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const rejectedRequest =
      await connectionRequestUseCase.rejectConnectionRequest(id);
    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: 'Connection request rejected',
      data: {
        rejectedRequest,
      },
    });
  } catch (error) {
    next(error);
  }
}

//delete a connection request
export async function deleteConnectionRequest(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const deleted = await connectionRequestUseCase.deleteConnectionRequest(id);
    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: 'Connection request Deleted',
      data: {
        deleted,
      },
    });
  } catch (error) {
    next(error);
  }
}
