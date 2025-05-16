import { NextFunction, Request, Response } from 'express';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { ConnectionRequestUseCase } from '../../../Application2/usecases/ConnectionRequest/ConnectionRequestUseCase';



export class ConnectionRequestController {

    constructor(private connectionRequestUseCase : ConnectionRequestUseCase
       
    ){}

   createConnectionRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void>  => {
  try {
    const { fromUser, toUser } = req.body;
    const newRequest = await this.connectionRequestUseCase.createConnectionRequest(
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

  getAllConnectionRequestsForUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void>  => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const { pendingRequests, totalRequests } =
      await this.connectionRequestUseCase.getConnectionRequestForUser(
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

getAllConnectionRequestsSentByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const { pendingRequests, totalRequests } =
      await this.connectionRequestUseCase.getConnectionRequestSentByUser(
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


 getConnectionRequestById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const request = await this.connectionRequestUseCase.getConnectionRequestById(id);

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


  getAllConnectionsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || null;

    const { connections, total } =
      await this.connectionRequestUseCase.findAllConnections(
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



getRecommendationsForUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void>  => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { users, total } =
      await this.connectionRequestUseCase.recommendationForUsers(
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


 acceptConnectionRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const acceptedRequest =
      await this.connectionRequestUseCase.acceptConnectionRequest(id);
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

 rejectConnectionRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const rejectedRequest =
      await this.connectionRequestUseCase.rejectConnectionRequest(id);
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

 deleteConnectionRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void>  =>{
  try {
    const { id } = req.params;
    const deleted = await this.connectionRequestUseCase.deleteConnectionRequest(id);
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


}


